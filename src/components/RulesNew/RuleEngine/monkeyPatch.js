/* eslint-disable no-extend-native,no-restricted-syntax,prefer-rest-params */

/**
 * Adding methods to native Set
 */

Set.prototype.union = function (setB) {
  const union = new Set(this);
  for (const elem of setB) {
    union.add(elem);
  }
  return union;
};

Set.prototype.intersection = function (setB) {
  const intersection = new Set();
  for (const elem of setB) {
    if (this.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
};

Set.prototype.difference = function (setB) {
  const difference = new Set(this);
  for (const elem of setB) {
    difference.delete(elem);
  }
  return difference;
};


/**
 * Adding methods to native RegExp
 */
RegExp.any = function () {
  let components = [];
  let arg;

  for (let i = 0; i < arguments.length; i++) {
    arg = arguments[i];
    if (arg instanceof RegExp) {
      components = components.concat(arg._components || arg.source);
    }
  }

  const combined = new RegExp(`(?:${components.join(')|(?:')})`);
  combined._components = components; // For chained calls to "or" method
  return combined;
};

RegExp.prototype.or = function () {
  const args = Array.prototype.slice.call(arguments);
  return RegExp.any.apply(null, [this].concat(args));
};
