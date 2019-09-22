/* eslint-disable import/prefer-default-export */
export const initProperties = (properties, matchProperties) => {
  const updateProperties = {};
  const keys = Object.keys(properties);
  const propKeys = Object.keys(matchProperties);

  keys.forEach((key) => {
    if (propKeys.indexOf(key) > -1) {
      updateProperties[key] = properties[key];
    }
  });
  return updateProperties;
};
