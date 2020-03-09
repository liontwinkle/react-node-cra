// const url = require('url');
const ProductsModel = require('../products/products.model');
const VirtualModel = require('../categories/categories.model');
const AttributesModel = require('../attributes/attributes.model');
const {
  responseWithResult,
} = require('../../utils');

// fixme reduce duplicate
// const convertValues = (data) => {
//   const valueString = data.split(':');
//   return {
//     operation: valueString[0],
//     value: valueString[1],
//   };
// };


const RULE_CACHE = {
  contains_all_words_case_insensitive: {},
  contains_all_words_case_sensitive: {},
  contains_any_whole_words_case_insensitive: {},
  contains_any_whole_words_case_sensitive: {},
  exactly: {},
  contains_any_tokens_case_insensitive: {},
  contains_any_tokens_case_sensitive: {},
};

const ESCAPED_TEXT_CACHE = {};

const escapeText = (text) => {
  ESCAPED_TEXT_CACHE[text] = (ESCAPED_TEXT_CACHE[text] || `${text}`.replace(/[\\[.+*?(){|^$]/g, '\\$&'));
  return ESCAPED_TEXT_CACHE[text];
};
//
// const operationType = {
//   is: (key, value) => ({ [key]: value }),
//   is_not: (key, value) => ({ [key]: { $not: value } }),
//   includes: (key, value) => ({ [key]: new RegExp(
//   `${escapeText(value)}\\w+|${escapeText(value)}`, 'gi') }),
// };

const RuleEngine = {
  contains_all_words_case_insensitive: (ruleValue, ruleType = 'contains_all_words_case_insensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(`${ruleValue.split('|').sort().map(item => (`.*${escapeText(item)}.*`)).join('+')}`,
        'ig',)
    );
    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_all_words_case_sensitive: (ruleValue, ruleType = 'contains_all_words_case_sensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(`${ruleValue.split('|').sort().map(item => (`.*${escapeText(item)}.*`)).join('+')}.`,
        'g',)
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_whole_words_case_sensitive: (ruleValue, ruleType = 'contains_any_whole_words_case_sensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(`\\b${ruleValue.split('|').sort().map(item => (`.*${escapeText(item)}.*`)).join('|')}\\b`,
        'g',)
    );
    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_whole_words_case_insensitive: (ruleValue, ruleType = 'contains_any_whole_words_case_insensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue]
      || new RegExp(`\\b${ruleValue.split('|').sort().map(item => (`.*${escapeText(item)}.*`)).join('|')}\\b`,
        'ig',)
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  exactly: (ruleValue, ruleType = 'exactly') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`^${escapeText(ruleValue.toString())}$`, 'g')
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_tokens_case_insensitive: (ruleValue, ruleType = 'contains_any_tokens_case_insensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`${escapeText(ruleValue)}\\w+|${escapeText(ruleValue)}`, 'ig')
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
  contains_any_tokens_case_sensitive: (ruleValue, ruleType = 'contains_any_tokens_case_sensitive') => {
    RULE_CACHE[ruleType][ruleValue] = (
      RULE_CACHE[ruleType][ruleValue] || new RegExp(`${escapeText(ruleValue)}\\w+|${escapeText(ruleValue)}`, 'g')
    );

    return RULE_CACHE[ruleType][ruleValue];
  },
};

const selectCollections = (req) => {
  let collection = null;
  if (req.params.type === 'virtual' || req.params.type === 'native') {
    collection = VirtualModel(`${req.params.clientId}_${req.params.type}`);
  } else {
    collection = AttributesModel(`${req.params.clientId}_${req.params.type}`);
  }
  return collection;
};

const responseEmptyBody = (res) => {
  res.status(200)
    .json({
      data: [],
    });
};

exports.getProductsByRule = async (req, res) => {
  const { entityId, ruleIndex } = req.params;
  const productCollection = ProductsModel(`${req.params.clientId}_products`);
  const entityCollection = selectCollections(req);

  if (entityCollection) {
    const entity = await entityCollection.findOne({ _id: entityId });
    if (entity !== null) {
      const selectedRule = entity.rules[ruleIndex];
      if (selectedRule) {
        const querySingleString = {
          [selectedRule.key]: RuleEngine[selectedRule.type](selectedRule.criteria)
        };
        productCollection.find(querySingleString)
          .execAsync()
          .then(responseWithResult(res, 200));
      }
    } else {
      responseEmptyBody(res);
    }
  } else {
    res.status(500);
    res.send('Current collection does not exist or Wrong information');
  }
};

exports.getProductsByRules = async (req, res) => {
  const rules = req.body;
  console.log('### DEBUG RULES: ', rules); // fixme
  const productCollection = ProductsModel(`${req.params.clientId}_products`);
  if (rules.length > 0) {
    const ruleRegex = [];
    rules.forEach((item) => {
      if (item.basis.key === 'exclude') {
        ruleRegex.push({
          [item.key.key]: { $not: RuleEngine[item.type.key](item.criteria) }
        });
      } else {
        ruleRegex.push({
          [item.key.key]: RuleEngine[item.type.key](item.criteria)
        });
      }
    });
    if (ruleRegex.length > 0) {
      const queryString = ruleRegex.length > 1 ? {
        $or: [
          ...ruleRegex
        ]
      } : ruleRegex[0];
      productCollection.find(queryString)
        .execAsync()
        .then(responseWithResult(res, 200));
    } else {
      responseEmptyBody(res);
    }
  } else {
    res.status(500);
    res.send('Current collection does not exist or Wrong information');
  }
};
