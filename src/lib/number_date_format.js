// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

import numfmt from 'numfmt';
import {
  LOCALE_NUMBER_FORMATS,
  LOCALE_TAGS,
} from '../constants/locale_formats_tags';

/**
 * Regex matching conditional bracket expressions like [>=1000000000] or [<0]
 */
const CONDITION_REGEX = /^\s*\[\s*(>=|<=|>|<|=|!=)\s*(-?\d+(?:\.\d+)?)\s*\](.*)$/;

/**
 * Formats a value using standard numfmt, with custom multi-condition support for format strings with >2 conditions.
 *
 * @param {string} format - The format string (e.g. '[>=1000000000]$0.0,,," B";[>=1000000]$0.0,," M";[>=100000]$0.0," K";$0.0')
 * @param {number} value - The numeric value to format
 * @param {string} localeFormat - Locale format key from Looker
 * @param {string} [fallbackValue] - Optional fallback string if formatting fails
 * @returns {string} Formatted string value
 */
export function formatValue(format, value, localeFormat, fallbackValue) {
  if (value === null || value === undefined) {
    return fallbackValue ?? '';
  }

  const localeTag = getLocaleTagFromNumberFormat(localeFormat);

  try {
    // Attempt standard numfmt formatting first
    const formatter = numfmt(format);
    return formatter(value, { locale: localeTag });
  } catch (err) {
    // Handles multi-condition strings (e.g., >2 conditions) that cause numfmt to throw "Unexpected partition"
    try {
      return formatMultiConditionValue(format, value, localeTag);
    } catch (fallbackErr) {
      console.warn('Failed to format value with multi-condition evaluator:', fallbackErr);
      return fallbackValue ?? String(value);
    }
  }
}

/**
 * Evaluates format strings with multiple explicit conditional rules sequentially.
 */
function formatMultiConditionValue(formatStr, value, localeTag) {
  const sections = formatStr.split(';');

  for (const section of sections) {
    const match = section.match(CONDITION_REGEX);

    if (match) {
      const op = match[1];
      const targetVal = parseFloat(match[2]);
      const subFormat = match[3];

      if (evalCondition(value, op, targetVal)) {
        const formatter = numfmt(subFormat);
        return formatter(value, { locale: localeTag });
      }
    } else {
      // Default non-conditional fallback section
      try {
        const formatter = numfmt(section);
        return formatter(value, { locale: localeTag });
      } catch (e) {
        // Continue to next section if parsing fails
      }
    }
  }

  // If no condition matched and default section parsing failed
  return String(value);
}

/**
 * Evaluates binary comparison operators
 */
function evalCondition(val, op, targetVal) {
  switch (op) {
    case '>=': return val >= targetVal;
    case '>': return val > targetVal;
    case '<=': return val <= targetVal;
    case '<': return val < targetVal;
    case '=': return val === targetVal;
    case '!=': return val !== targetVal;
    default: return false;
  }
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
