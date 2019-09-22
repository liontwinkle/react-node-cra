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

export const updateProperties = (propertyFields, properties) => {
  const nextProperties = {};
  propertyFields.forEach((item, key) => {
    if (properties[item.key] === item.default) {
      nextProperties[item.key] = propertyFields[key].default;
    } else if (properties[item.key] === (item.default === 'true')) {
      nextProperties[item.key] = (propertyFields[key].default === true);
    }
  });
  return nextProperties;
};
