// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import numfmt from 'numfmt';
import {
  LOCALE_NUMBER_FORMATS,
  LOCALE_TAGS,
} from '../constants/locale_formats_tags';

export function formatValue(format, value, localeFormat) {
  const formatter = numfmt(format);

  return formatter(value, {
    locale: getLocaleTagFromNumberFormat(localeFormat),
  });
}

function getLocaleTagFromNumberFormat(format) {
  switch (format) {
    case LOCALE_NUMBER_FORMATS.DEFAULT_EN:
      return LOCALE_TAGS.EN;
    case LOCALE_NUMBER_FORMATS.DEFAULT_EU:
      return LOCALE_TAGS.DE;
    default:
      return LOCALE_TAGS.EN;
  }
}
