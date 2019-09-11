import './monkeyPatch';

// Memoize building RegExp instances for rules
const RULE_CACHE = {
  ':': {},
  '::': {},
  ':=': {},
};

const PRODUCTS_SET = {
  union: new Set(),
  difference: new Set(),
};
// Memoize RegExp escaping text
const ESCAPED_TEXT_CACHE = {};

const escapeText = (text) => {
  ESCAPED_TEXT_CACHE[text] = (ESCAPED_TEXT_CACHE[text] || `${text}`.replace(/[\\[.+*?(){|^$]/g, '\\$&'));
  return ESCAPED_TEXT_CACHE[text];
};

export const RuleEngine = {
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

export const AddSets = (newSets) => {
  PRODUCTS_SET.union = PRODUCTS_SET.union.union(newSets);
  console.log('New Union>>>', PRODUCTS_SET);// fixme
};

export const DiffSets = (newSets) => {
  PRODUCTS_SET.difference = PRODUCTS_SET.difference.intersection(newSets);
  console.log('New Intersection>>>', PRODUCTS_SET);// fixme
};

export const getData = () => PRODUCTS_SET;

export const formatProductsData = () => {
  PRODUCTS_SET.union.clear();
  PRODUCTS_SET.difference.clear();
};
