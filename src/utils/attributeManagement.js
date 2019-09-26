/* eslint-disable import/prefer-default-export */
export const checkNameDuplicate = (attributes, name, groupId) => {
  let len = 0;
  const filterAttr = attributes.filter(attrItem => (attrItem.groupId === groupId));
  filterAttr.forEach((arrItem) => {
    if (arrItem.name.toLowerCase() === name.toLowerCase()) {
      len++;
    }
  });
  return len;
};
