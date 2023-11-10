import {LOCALE_NUMBER_FORMATS} from '../constants/locale_formats_tags';
import {formatValue} from '../functions/number_date_format';

describe('formatValue', () => {
  test('should format value with appropiate format and locale settings', () => {
    expect(
      formatValue('0.0,k', 22789, LOCALE_NUMBER_FORMATS.DEFAULT_EU)
    ).toEqual('22,8k');
  });
});
