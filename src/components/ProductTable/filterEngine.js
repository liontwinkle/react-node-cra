const getEqFilter = (products, key, value, type) => {
  if (type === 'eq') {
    return products.filter(productItem => (productItem[key] === value));
  }
  return products.filter(productItem => (productItem[key] !== value));
};

const getWithFilter = (products, key, value, type) => products.filter((productItem) => {
  if (typeof productItem[key] === 'string' && productItem[key].length >= value.length) {
    if ((type === 'begin' && productItem[key].slice(0, value.length) === value)
      || (type === 'end' && productItem[key].slice(productItem.length - value.length) === value)) {
      return true;
    }
  }
  return false;
});

const getCotainFilter = (products, key, value, type) => products.filter((productItem) => {
  if (type === 'contains') {
    return (productItem[key].includes(value) !== -1);
  }
  return (productItem[key].includes(value) === -1);
});

const FilterEngine = {
  eq: (products, key, value, type = 'eq') => getEqFilter(products, key, value, type),
  neq: (products, key, value, type = 'neq') => getEqFilter(products, key, value, type),
  begins_with: (products, value, key, type = 'begin') => getWithFilter(products, key, value, type),
  ends_with: (products, key, value, type = 'end') => getWithFilter(products, key, value, type),
  contains: (products, key, value, type = 'contains') => getCotainFilter(products, key, value, type),
  not_contains: (products, key, value, type = 'not_contains') => getCotainFilter(products, key, value, type),
};

export default FilterEngine;
