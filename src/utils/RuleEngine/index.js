import './monkeyPatch';

// Memoize building RegExp instances for rules
const RULE_CACHE = {
  contains_all_words_case_insensitive: {},
  contains_all_words_case_sensitive: {},
  contains_any_whole_words_case_insensitive: {},
  contains_any_whole_words_case_sensitive: {},
  exactly: {},
  contains_any_tokens_case_insensitive: {},
  contains_any_tokens_case_sensitive: {},
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
  contains_all_words_case_insensitive: (ruleValue, ruleType = 'contains_all_words_case_insensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(
        `^${ruleValue.split('|').sort().map((item) => (`(?=.*\\b${escapeText(item)}\\b)`)).join('+')}.+`,
        'gi',
      )
    );
    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_all_words_case_sensitive: (ruleValue, ruleType = 'contains_all_words_case_sensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(
        `^${ruleValue.split('|').sort().map((item) => (`(?=.*\\b${escapeText(item)}\\b)`)).join('+')}.+`,
        'g',
      )
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_whole_words_case_sensitive: (ruleValue, ruleType = 'contains_any_whole_words_case_sensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(
        `^${ruleValue.split('|').sort().map((item) => (`(\\b${escapeText(item)}\\b)`)).join('|')}.+`,
        'g',
      )
    );
    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_whole_words_case_insensitive: (ruleValue, ruleType = 'contains_any_whole_words_case_insensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(
        `^${ruleValue.split('|').sort().map((item) => (`(\\b${escapeText(item)}\\b)`)).join('|')}.+`,
        'gi',
      )
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  exactly: (ruleValue, ruleType = 'exactly') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`^${escapeText(ruleValue)}$`)
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_tokens_case_insensitive: (ruleValue, ruleType = 'contains_any_tokens_case_insensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`${escapeText(ruleValue)} | ${escapeText(ruleValue)}\\w+`, 'gi')
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_tokens_case_sensitive: (ruleValue, ruleType = 'contains_any_tokens_case_sensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`${escapeText(ruleValue)} | ${escapeText(ruleValue)}\\w+`, 'g')
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
