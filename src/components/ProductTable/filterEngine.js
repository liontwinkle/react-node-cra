const getEqFilter = (products, key, value, type) => products.filter((productItem) => {
  if (productItem[key]) {
    if (typeof productItem[key] === 'boolean') {
      if (type === 'eq') {
        return productItem[key] === (value === 'true');
      }
      return !(productItem[key] === (value === 'true'));
    }

    if (typeof productItem[key] === 'number') {
      if (type === 'eq') {
        return productItem[key] === value;
      }
      return !(productItem[key] === value);
    }

    if (type === 'eq') {
      return productItem[key].match(value) && (productItem[key] === value);
    }
    return !(productItem[key].match(value) && (productItem[key] === value));
  }
  return false;
});

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
  if (productItem[key]) {
    if (type === 'contains') {
      return (productItem[key].indexOf(value) !== -1);
    }
    return (productItem[key].indexOf(value) === -1);
  }
  return false;
});

const getGreateFilter = (products, key, value, type) => products.filter((productItem) => {
  if (productItem[key]) {
    if (type === 'gt') {
      return (productItem[key] > value);
    }
    return (productItem[key] >= value);
  }
  return false;
});

const getLessFilter = (products, key, value, type) => products.filter((productItem) => {
  if (productItem[key]) {
    if (type === 'lt') {
      return (productItem[key] < value);
    }
    return (productItem[key] <= value);
  }
  return false;
});

const getBetween = (products, key, startVal, endVal, type) => products.filter((productItem) => {
  if (productItem[key]) {
    if (type === 'between') {
      return (startVal < productItem[key]) && (productItem[key] < endVal);
    }
    return (startVal > productItem[key]) && (productItem[key] < endVal);
  }
  return false;
});

const getEmptyFilter = (products, key, type) => products.filter((productItem) => {
  if (productItem[key]) {
    if (type === 'empty') {
      return (productItem[key] === '' || productItem[key] === null);
    }
    return (productItem[key] !== '' && productItem[key] !== null);
  }
  return false;
});

const FilterEngine = {
  empty: (products, key, value, type = 'empty') => getEmptyFilter(products, key, type),
  not_empty: (products, key, value, type = 'not_empty') => getEmptyFilter(products, key, type),
  eq: (products, key, value, type = 'eq') => getEqFilter(products, key, value, type),
  neq: (products, key, value, type = 'neq') => getEqFilter(products, key, value, type),
  begins_with: (products, key, value, type = 'begin') => getWithFilter(products, key, value, type),
  ends_with: (products, key, value, type = 'end') => getWithFilter(products, key, value, type),
  contains: (products, key, value, type = 'contains') => getCotainFilter(products, key, value, type),
  not_contains: (products, key, value, type = 'not_contains') => getCotainFilter(products, key, value, type),
  gt: (products, key, value, type = 'gt') => getGreateFilter(products, key, value, type),
  gte: (products, key, value, type = 'gte') => getGreateFilter(products, key, value, type),
  lt: (products, key, value, type = 'lt') => getLessFilter(products, key, value, type),
  lte: (products, key, value, type = 'lte') => getLessFilter(products, key, value, type),
  between: (products, key, startVal, endVal, type = 'between') => getBetween(products, key, startVal, endVal, type),
  not_between:
    (products, key, startVal, endVal, type = 'not_between') => getBetween(products, key, startVal, endVal, type),
};

export default FilterEngine;
