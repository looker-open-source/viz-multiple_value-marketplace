// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import {
  getProgressPerc,
  getPercChange,
  getValueChange,
} from '../lib/comparison_data_point';

const dataPoint = {value: 100};
const compDataPoint = {value: 20};
let progressPerc;

describe('getProgressPerc', () => {
  test('should get correct percentage', () => {
    expect((progressPerc = getProgressPerc(dataPoint, compDataPoint))).toEqual(
      '500'
    );
  });
});

describe('getPercChange', () => {
  test('should get correct percentage', () => {
    expect(getPercChange(progressPerc)).toEqual('400');
  });
});

describe('getValueChange', () => {
  test('should get correct value', () => {
    expect(getValueChange(dataPoint, compDataPoint)).toEqual('80');
  });
});
