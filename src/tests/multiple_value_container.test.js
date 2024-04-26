import {LOCALE_NUMBER_FORMATS} from '../constants/locale_formats_tags';
import {addBaseTagToHeadElement} from '../functions/add_base_element_to_head';
import {formatValue} from '../functions/number_date_format';

describe('formatValue', () => {
  test('should format value with appropiate format and locale settings', () => {
    expect(
      formatValue('0.0,k', 22789, LOCALE_NUMBER_FORMATS.DEFAULT_EU)
    ).toEqual('22,8k');
  });
});

describe('addBaseTagToHeadElement', () => {
  test('should add <base target="_parent"> to head element', () => {
    const testDoc = document.implementation.createHTMLDocument('Test document');
    addBaseTagToHeadElement(testDoc);

    const headElement = testDoc.getElementsByTagName('head')[0];
    const baseElement = headElement.querySelector('base');
    const targetAttribute = baseElement.getAttribute('target');

    expect(targetAttribute).toBe('_parent');
  });
});
