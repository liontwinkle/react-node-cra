import httpService from './http.service';

const fetchProductsByRules = (clientId, type, rules) => {
  const url = `/rules/client/${clientId}/types/${type}/entity/rules`;
  return httpService
    .post(url, rules)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.response));
};

const fetchProductsByRuleIndex = (clientId, type, entityId, ruleIndex) => {
  // eslint-disable-next-line max-len
  const url = `/rules/client/${clientId}/types/${type}/entity/${entityId}/rule/${ruleIndex}`;
  return httpService
    .get(url)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.response));
};

export default {
  fetchProductsByRuleIndex,
  fetchProductsByRules,
};
