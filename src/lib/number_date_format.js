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
