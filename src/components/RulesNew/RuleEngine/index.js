import './monkeyPatch';

// Memoize building RegExp instances for rules
const RULE_CACHE = {
  ':': {},
  '::': {},
  ':=': {},
};

// Memoize RegExp escaping text
const ESCAPED_TEXT_CACHE = {};

const escapeText = (text) => {
  ESCAPED_TEXT_CACHE[text] = (ESCAPED_TEXT_CACHE[text] || `${text}`.replace(/[\\[.+*?(){|^$]/g, '\\$&'));
  return ESCAPED_TEXT_CACHE[text];
};

const RuleEngine = {
  ':': (ruleValue, ruleType = ':') => {
    console.log('Rule Value:', ruleValue);
    console.log('Rule Type:', ruleType);

    console.log('Escaped Text:', escapeText(ruleValue));
    console.log('Escaped Text:', escapeText(ruleValue).code);
    console.log(new RegExp(`${escapeText(ruleValue)}`, 'i').code);


    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`${escapeText(ruleValue)}`, 'i')
    );

    console.log('RULE_CACHE[ruleType][ruleValue]', RULE_CACHE[ruleType][ruleValue]);

    return RULE_CACHE[ruleType][ruleValue];
  },
  '::': (ruleValue, ruleType = '::') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`\b${escapeText(ruleValue)}\b`, 'i')
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  ':=': (ruleValue, ruleType = ':=') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`^${escapeText(ruleValue)}$`)
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
};

export default RuleEngine;
