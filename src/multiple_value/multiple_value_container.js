import React from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';
import MultipleValue from './multiple_value';
import {formatValue} from '../functions/number_date_format';
import {PLOT_CONFIG} from '../constants/plot_config';

let currentOptions = {};
let currentConfig = {};

const renderBlankVisualization = (element, done) => {
  ReactDOM.render(<MultipleValue config={{}} data={[]} />, element, done);
};

looker.plugins.visualizations.add({
  id: 'multiple_value',
  label: 'Multiple Value',
  options: PLOT_CONFIG,
  create: function (element, config) {
    this.chart = renderBlankVisualization(element, () => {});
  },
  updateAsync: function (data, element, config, queryResponse, details, done) {
    this.clearErrors();

    const measures = [].concat(
      queryResponse.fields.dimensions,
      queryResponse.fields.measures,
      queryResponse.fields.table_calculations
    );

    if (data.length < 1) {
      this.addError({title: 'No Results'});
      this.chart = renderBlankVisualization(element, done);
      return;
    }

    if (measures.length == 0) {
      this.addError({
        title: 'No Measures',
        message: 'This chart requires measures',
      });
      return;
    }

    if (queryResponse.fields.pivots.length) {
      this.addError({
        title: 'Pivoting not allowed',
        message: 'This visualization does not allow pivoting',
      });
      return;
    }

    if (measures.length > 10) {
      this.addError({
        title: 'Maximum number of data points',
        message:
          'This visualization does not allow more than 10 data points to be selected',
      });
      return;
    }

    let firstRow = data[0];

    const dataPoints = measures.map(measure => {
      return {
        name: measure.name,
        label: measure.label_short || measure.label,
        value: firstRow[measure.name].value,
        link: firstRow[measure.name].links,
        valueFormat: config[`value_format`],
        formattedValue:
          config[`value_format_${measure.name}`] === '' ||
          config[`value_format_${measure.name}`] === undefined
            ? LookerCharts.Utils.textForCell(firstRow[measure.name])
            : formatValue(
                config[`value_format_${measure.name}`],
                firstRow[measure.name].value,
                queryResponse.number_format
              ),
        html: firstRow[measure.name].html,
      };
    });

    const options = Object.assign({}, baseOptions);

    dataPoints.forEach((dataPoint, index) => {
      //Style -- apply to all
      if (config.orientation === 'horizontal') {
        options.dividers = {
          type: 'boolean',
          label: `Dividers between values?`,
          default: false,
          section: 'Style',
          order: 1,
        };
      }
      if (config[`show_comparison_${dataPoint.name}`] !== true) {
        options[`style_${dataPoint.name}`] = {
          type: `string`,
          label: `${dataPoint.label} - Color`,
          display: `color`,
          default: '#3A4245',
          section: 'Style',
          order: 10 * index + 3,
        };
        options[`show_title_${dataPoint.name}`] = {
          type: 'boolean',
          label: `${dataPoint.label} - Show Title`,
          default: true,
          section: 'Style',
          order: 10 * index + 2,
        };
        options[`title_override_${dataPoint.name}`] = {
          type: 'string',
          label: `${dataPoint.label} - Title`,
          section: 'Style',
          placeholder: dataPoint.label,
          order: 10 * index + 4,
        };
        options[`title_placement_${dataPoint.name}`] = {
          type: 'string',
          label: `${dataPoint.label} - Title Placement`,
          section: 'Style',
          display: 'select',
          values: [{'Above number': 'above'}, {'Below number': 'below'}],
          default: 'above',
          order: 10 * index + 5,
        };
        options[`value_format_${dataPoint.name}`] = {
          type: 'string',
          label: `${dataPoint.label} - Value Format`,
          section: 'Style',
          default: '',
          order: 10 * index + 6,
        };
      }
      // Comparison - all data points other than the first
      if (index >= 1) {
        options[`show_comparison_${dataPoint.name}`] = {
          type: 'boolean',
          label: `${dataPoint.label} - Show as comparison`,
          section: 'Comparison',
          default: false,
          order: 10 * index,
        };

        if (config[`show_comparison_${dataPoint.name}`] === true) {
          options[`comparison_style_${dataPoint.name}`] = {
            type: 'string',
            display: 'radio',
            label: `${dataPoint.label} - Style`,
            values: [
              {'Show as Value': 'value'},
              {'Show as Value Change': 'value_change'},
              {'Show as Percentage Change': 'percentage_change'},
              {'Calculate Progress': 'calculate_progress'},
              {
                'Calculate Progress (with Percentage)':
                  'calculate_progress_perc',
              },
            ],
            section: 'Comparison',
            default: 'value',
            order: 10 * index + 1,
          };
          options[`comparison_show_label_${dataPoint.name}`] = {
            type: 'boolean',
            label: `${dataPoint.label} - Show Label`,
            section: 'Comparison',
            default: true,
            order: 10 * index + 4,
          };
          if (config[`comparison_style_${dataPoint.name}`] === 'value_change') {
            options[`pos_is_bad_${dataPoint.name}`] = {
              type: 'boolean',
              label: `Positive Values are Bad`,
              section: 'Comparison',
              default: false,
              order: 10 * index + 2,
            };
          }
          if (
            config[`comparison_style_${dataPoint.name}`] === 'percentage_change'
          ) {
            options[`pos_is_bad_${dataPoint.name}`] = {
              type: 'boolean',
              label: `Positive Values are Bad`,
              section: 'Comparison',
              default: false,
              order: 10 * index + 3,
            };
          }
          if (config[`comparison_show_label_${dataPoint.name}`]) {
            options[`comparison_label_${dataPoint.name}`] = {
              type: 'string',
              label: `${dataPoint.label} - Label`,
              placeholder: dataPoint.label,
              section: 'Comparison',
              order: 10 * index + 5,
            };
            options[`comparison_label_placement_${dataPoint.name}`] = {
              type: 'string',
              label: `${dataPoint.label} - Label Placement`,
              display: 'select',
              values: [
                {Above: 'above'},
                {Below: 'below'},
                {Left: 'left'},
                {Right: 'right'},
              ],
              default: 'below',
              section: 'Comparison',
              order: 10 * index + 6,
            };
            if (
              config[`comparison_style_${dataPoint.name}`] === 'value' ||
              config[`comparison_style_${dataPoint.name}`] ===
                'calculate_progress_perc'
            ) {
              options[`comp_value_format_${dataPoint.name}`] = {
                type: 'string',
                label: `Comparison Value Format`,
                placeholder: 'Spreadsheet-style format code',
                section: 'Comparison',
                default: '',
                order: 10 * index + 7,
              };
            }
          }
        }
      }
    });

    if (!isEqual(currentOptions, options) || !isEqual(currentConfig, config)) {
      this.trigger('registerOptions', options);
      currentOptions = Object.assign({}, options);
      currentConfig = Object.assign({}, config);
    }

    let valuesToComparisonsMap = {};
    let lastDataPointIndex = -1;
    const fullValues = dataPoints
      .filter((dataPoint, index) => {
        if (config[`show_comparison_${dataPoint.name}`] !== true) {
          lastDataPointIndex++;
          return true;
        } else {
          valuesToComparisonsMap[lastDataPointIndex] = index;
        }
        return false;
      })
      .map((fullValue, index) => {
        const comparisonIndex = valuesToComparisonsMap[index];
        if (comparisonIndex) {
          fullValue.comparison = dataPoints[comparisonIndex];
        }
        return fullValue;
      });

    this.chart = ReactDOM.render(
      <MultipleValue config={config} data={fullValues} />,
      element
    );
    done();
  },
});
