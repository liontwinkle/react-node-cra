import './monkeyPatch';

// Memoize building RegExp instances for rules
const RULE_CACHE = {
  ':': {},
  '::': {},
  ':=': {},
};

const PRODUCTS_SET = {
  union: new Set(),
  includes: new Set(),
  excludes: new Set(),
};
// Memoize RegExp escaping text
const ESCAPED_TEXT_CACHE = {};

const escapeText = (text) => {
  ESCAPED_TEXT_CACHE[text] = (ESCAPED_TEXT_CACHE[text] || `${text}`.replace(/[\\[.+*?(){|^$]/g, '\\$&'));
  return ESCAPED_TEXT_CACHE[text];
};

export const RuleEngine = {
  ':': (ruleValue, ruleType = ':') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`${escapeText(ruleValue)}`, 'i')
    );
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

export const AddSets = (newSets, type) => {
  PRODUCTS_SET[type] = PRODUCTS_SET[type].union(newSets);
};

export const DiffSets = () => PRODUCTS_SET.includes.difference(PRODUCTS_SET.excludes);

export const getData = () => PRODUCTS_SET;

export const formatProductsData = () => {
  PRODUCTS_SET.union.clear();
};

export const formatDifference = () => {
  PRODUCTS_SET.includes.clear();
  PRODUCTS_SET.excludes.clear();
};

export const getUnion = (setA, setB) => setA.union(setB);
