/* eslint-disable import/prefer-default-export */
import { memo } from 'react';

export const View = memo(({ value, match, criteria }) => {
  const caseInsensitiveMatch = new RegExp(`${criteria}`, 'i');
  const caseSensitiveMatch = new RegExp(`${criteria}`);

  switch (match) {
    case ':=':
      return (value === criteria);
    case '::':
      return (caseInsensitiveMatch.test(value));
    case ':':
      return (caseSensitiveMatch.test(value));
    case ':<=':
      if (typeof value === 'number') {
        return (value < criteria);
      }
      return 'Unmatched Type.';

    case ':>=':
      if (typeof value === 'number') {
        return (value >= criteria);
      }
      return ('Unmatched Type');
    case ':<':
      if (typeof value === 'number') {
        return (value < criteria);
      }
      return ('Unmatched Type');
    case ':>':
      if (typeof value === 'number') {
        return (value > criteria);
      }
      return ('Unmatched Type');
    case ':==':
      if (typeof value === 'number') {
        return (value === criteria);
      }
      return ('Unmatched Type');
    default:
      break;
  }
});
