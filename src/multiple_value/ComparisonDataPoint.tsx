import React, { PureComponent, useState } from "react";
import styled from 'styled-components'
// @ts-ignore
import {formatType, lighten} from '../common'
import SSF from "ssf";

let ComparisonDataPointGroup = styled.div`
  flex: 1;
  width: 100%;

  margin: 10px 0;
  
  font-size: 0.9em;
  font-weight: 100;
  color: #a5a6a1;

  a.drillable-link {
    color: #a5a6a1;
    text-decoration: none;
  }
`
const UpArrow = styled.div.attrs({
  pos: (props: any) => props.pos,
})`
  display: inline-block;
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid ${props =>
    props.pos ? 'red' : 'green'
  };
  margin-right: 5px;
`

const DownArrow = styled.div.attrs({
  pos: (props: any) => props.pos,
})`
  display: inline-block;  
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid ${props =>
    props.pos ? 'green' : 'red'
  };
  margin-right: 5px;
`
const ComparisonPercentageChange = styled.div`
  display: inline-block;
  padding-right: 5px;
  :hover {
    text-decoration: underline;
  }
`
const ComparisonSimpleValue = styled.div`
  font-weight: 100;
  display: inline-block;
  padding-right: 5px;
  :hover {
    text-decoration: underline;
  }
`
const ComparisonProgressBar = styled.div.attrs({
  background: (props: any) => props.background,
})`
  position: relative;
  background-color: ${props => 
    props.background ? lighten(props.background, 60) : lighten("#282828", 80)
  };
  height: 40px;
  text-align: center;
`
const ComparisonProgressBarFilled = styled.div.attrs({
  background: (props: any) => props.background,
  pct: (props: any) => props.pct,
})`
  background-color: ${props => 
    props.background ? lighten(props.background, 45) : lighten("#282828", 60)
  };
  width: ${props => 
    props.pct
  }%;
  height: 40px;
`

const ComparisonProgressBarLabel = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;  
  color: #000000;

  a.drillable-link {
    color: #000000;
  }
`;

export const ComparisonDataPoint: React.FC<{
  config: any,
  compDataPoint: any,
  dataPoint: any,
  percChange: number,
  valueChange: number,
  progressPerc: number,
  handleClick: (i: any, j: any)=>{},
}> = ({ config, compDataPoint, dataPoint, percChange, valueChange, progressPerc, handleClick }) => {

  function tryFormatting(formatString: string, value: number, defaultString: string) {
    try {
      return SSF.format(formatString, value)
    }
    catch(err) {
      return defaultString
    }
  }

  return (
    <ComparisonDataPointGroup>

    {config[`comparison_style_${compDataPoint.name}`] !== 'percentage_change' ? null : (
      <ComparisonPercentageChange data-value={percChange} onClick={() => { handleClick(compDataPoint, event) }}>
        {percChange >= 0 ? <UpArrow pos={config[`pos_is_bad_${compDataPoint.name}`]}/> : <DownArrow pos={config[`pos_is_bad_${compDataPoint.name}`]}/>}
        {percChange}%
      </ComparisonPercentageChange>
    )}
    {config[`comparison_style_${compDataPoint.name}`] !== 'value_change' ? null : (
      <ComparisonPercentageChange data-value={valueChange} onClick={() => { handleClick(compDataPoint, event) }}>
        {valueChange >= 0 ? <UpArrow pos={config[`pos_is_bad_${compDataPoint.name}`]}/> : <DownArrow pos={config[`pos_is_bad_${compDataPoint.name}`]}/>}
        {valueChange.toLocaleString('en-US')}
      </ComparisonPercentageChange>
    )}

    {config[`comparison_style_${compDataPoint.name}`] !== 'value' ? null : 
    <ComparisonSimpleValue onClick={() => { handleClick(compDataPoint, event) }}>
      {config[`comp_value_format_${compDataPoint.name}`] === "" ? compDataPoint.formattedValue : tryFormatting(config[`comp_value_format_${compDataPoint.name}`], compDataPoint.value, compDataPoint.formattedValue)}
    </ComparisonSimpleValue>}

    {config[`comparison_style_${compDataPoint.name}`] !== 'calculate_progress' &&
    config[`comparison_style_${compDataPoint.name}`] !== 'calculate_progress_perc' ? null : (
      <ComparisonProgressBar background={config[`style_${dataPoint.name}`]}>
        <ComparisonProgressBarFilled
          background={config[`style_${dataPoint.name}`]}
          pct={()=>Math.min(progressPerc || 0, 100)}
        />
          {config[`comparison_show_label_${compDataPoint.name}`] === false ? null : (
            <ComparisonProgressBarLabel><div onClick={() => { handleClick(compDataPoint, event) }}>
              {config[`comparison_style_${compDataPoint.name}`] === 'calculate_progress' ? null :
                <>
                  {`${progressPerc}% of ${config[`comp_value_format_${compDataPoint.name}`] === "" ? compDataPoint.formattedValue : tryFormatting(config[`comp_value_format_${compDataPoint.name}`], compDataPoint.value, compDataPoint.formattedValue)} `}
                </>
              }
              {config[`comparison_label_${compDataPoint.name}`] || compDataPoint.label}
            </div></ComparisonProgressBarLabel>
          )}
      </ComparisonProgressBar>
    )}

    {(
      config[`comparison_show_label_${compDataPoint.name}`] === false ||
      config[`comparison_style_${compDataPoint.name}`] === 'calculate_progress' ||
      config[`comparison_style_${compDataPoint.name}`] === 'calculate_progress_perc')
    ? null 
    : config[`comparison_label_${compDataPoint.name}`] || compDataPoint.label}

    </ComparisonDataPointGroup>
  )
}
