// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

/**
 * Functions to get percentages and value changes in comparison points
 */

export const getProgressPerc = (dataPoint, compDataPoint) => {
  return Math.round((dataPoint.value / compDataPoint?.value) * 100);
};

export const getPercChange = progressPerc => {
  return progressPerc - 100;
};

export const getValueChange = (dataPoint, compDataPoint) => {
  return dataPoint.value - compDataPoint?.value;
};
