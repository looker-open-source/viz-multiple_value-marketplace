/**
 * Functions to get percentages and value changes in comparison points
 */

export const getProgressPerc = (dataPoint, compDataPoint) => {
    return Math.round(
      (dataPoint.value / compDataPoint?.value) * 100);
  }

export const getPercChange = (progressPerc) => {
    return progressPerc - 100;
  }

export const getValueChange = (dataPoint, compDataPoint) => {
    return dataPoint.value - compDataPoint?.value;
  }