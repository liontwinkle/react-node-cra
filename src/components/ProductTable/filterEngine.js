const getEqFilter = (products, key, value, type) => {
  const filter = [];
  console.log('### DEBUG EQUAL VALUE: ', value, type);
  return filter;
};

const getWithFilter = (products, key, value, type) => {
  const filter = [];
  console.log('### DEBUG FILTER VALUE: ', value, type);
  return filter;
};

const getCotainFilter = (products, key, value, type) => {
  const filter = [];
  console.log('### DEBUG CONTAIN VALUE: ', value, type);
  return filter;
};

const FilterEngine = {
  eq: (products, key, value, type = 'eq') => getEqFilter(products, key, value, type),
  neq: (products, key, value, type = 'neq') => getEqFilter(products, key, value, type),
  begins_with: (products, value, key, type = 'begin') => getWithFilter(products, key, value, type),
  ends_with: (products, key, value, type = 'end') => getWithFilter(products, key, value, type),
  contains: (products, key, value, type = 'contains') => getCotainFilter(products, key, value, type),
  not_contains: (products, key, value, type = 'not_contains') => getCotainFilter(products, key, value, type),
};

export default FilterEngine;
