import React from "react";
import * as d3 from "d3";
import _ from "lodash";

export const formatType = (valueFormat) => {
  if (typeof valueFormat != "string") {
    return function (x) {
      return x;
    };
  }
  let format = "";
  switch (valueFormat.charAt(0)) {
    case "$":
      format += "$";
      break;
    case "£":
      format += "£";
      break;
    case "€":
      format += "€";
      break;
  }
  if (valueFormat.indexOf(",") > -1) {
    format += ",";
  }
  const splitValueFormat = valueFormat.split(".");
  format += ".";
  format += splitValueFormat.length > 1 ? splitValueFormat[1].length : 0;

  switch (valueFormat.slice(-1)) {
    case "%":
      format += "%";
      break;
    case "0":
      format += "f";
      break;
  }
  return d3.format(format);
};

export const handleErrors = (vis, resp, options) => {
  function messageFromLimits(min, max, field) {
    let message = "You need " + min;
    if (max) {
      message += " to " + max;
    }
    message += " " + field;
    return message;
  }

  if (
    resp.fields.pivots.length < options.min_pivots ||
    resp.fields.pivots.length > options.max_pivots
  ) {
    let message;
    vis.addError({
      group: "pivot-req",
      title: "Incompatible Pivot Data",
      message: messageFromLimits(
        options.min_pivots,
        options.max_pivots,
        "pivots"
      ),
    });
    return false;
  } else {
    vis.clearErrors("pivot-req");
  }

  if (
    resp.fields.dimensions.length < options.min_dimensions ||
    resp.fields.dimensions.length > options.max_dimensions
  ) {
    vis.addError({
      group: "dim-req",
      title: "Incompatible Dimension Data",
      message: messageFromLimits(
        options.min_dimensions,
        options.max_dimensions,
        "dimensions"
      ),
    });
    return false;
  } else {
    vis.clearErrors("dim-req");
  }

  if (
    resp.fields.measure_like.length < options.min_measures ||
    resp.fields.measure_like.length > options.max_measures
  ) {
    vis.addError({
      group: "mes-req",
      title: "Incompatible Measure Data",
      message: messageFromLimits(
        options.min_measures,
        options.max_measures,
        "measures"
      ),
    });
    return false;
  } else {
    vis.clearErrors("mes-req");
  }
  return true;
};

const drillingCallback = (event) => {
  // eslint-disable-line
  const ds = event.currentTarget.dataset;
  const keys = Object.keys(ds);
  let links = [];
  _.forEach(keys, (key) => {
    const [k, i] = key.split("-");
    if (!links[i]) {
      links[i] = {};
    }
    links[i][k] = ds[key];
  });
  LookerCharts.Utils.openDrillMenu({ links, event });
};

// Attempt to display in this order: HTML/drill -> rendered -> value
export const displayData = (cell, formattedValue) => {
  if (_.isEmpty(cell)) {
    return null;
  }
  let formattedCell;
  if (cell.links) {
    let dataset = {};
    // Adding data to DOM that we will need when drilling into link which we would not
    // otherwise have when ag-grid hits our callback fn.
    _.forEach(cell.links, (link, i) => {
      dataset[`data-label-${i}`] = link.label;
      dataset[`data-url-${i}`] = link.url;
      dataset[`data-type-${i}`] = link.type;
    });
    // const val = !_.isUndefined(cell.rendered) ? cell.rendered : cell.value;
    formattedCell = (
      <a
        className="drillable-link"
        href="#"
        onClick={drillingCallback}
        {...dataset}
      >
        {formattedValue}
      </a>
    );
  } else if (cell.html) {
    formattedCell = LookerCharts.Utils.htmlForCell(cell).replace(
      "<a ",
      '<a className="drillable-link" '
    );
  } else {
    // formattedCell = LookerCharts.Utils.textForCell(cell);
    formattedCell = formattedValue;
  }

  return formattedCell;
};

// Manipulate HEX colors
const addLight = function (color, amount) {
  let cc = parseInt(color, 16) + amount;
  let c = cc > 255 ? 255 : cc;
  c = c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
  return c;
};

export const lighten = (color, amount) => {
  color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : color;
  amount = parseInt((255 * amount) / 100);
  return (color = `#${addLight(color.substring(0, 2), amount)}${addLight(
    color.substring(2, 4),
    amount
  )}${addLight(color.substring(4, 6), amount)}`);
};

const subtractLight = function (color, amount) {
  let cc = parseInt(color, 16) - amount;
  let c = cc < 0 ? 0 : cc;
  c = c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
  return c;
};

export const darken = (color, amount) => {
  color = color.indexOf("#") >= 0 ? color.substring(1, color.length) : color;
  amount = parseInt((255 * amount) / 100);
  return (color = `#${subtractLight(
    color.substring(0, 2),
    amount
  )}${subtractLight(color.substring(2, 4), amount)}${subtractLight(
    color.substring(4, 6),
    amount
  )}`);
};
