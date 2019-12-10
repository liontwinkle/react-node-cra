export const checkNameDuplicate = (attributes, name, groupId) => {
  let len = 0;
  const filterAttr = attributes.filter((attrItem) => (attrItem.group_id === groupId));
  filterAttr.forEach((arrItem) => {
    if (arrItem.name.toLowerCase() === name.toLowerCase()) {
      len++;
    }
  });
  return len;
};

export const getNewAppearData = (categories, currentLsit, currentCategoryItem) => {
  let result = [];
  if (currentCategoryItem.parent_id !== null) {
    const siblings = categories.filter((item) => (item.parent_id === currentCategoryItem.parent_id));
    let checkContainAttr = true;
    if (currentLsit.length === 0) {
      checkContainAttr = false;
    } else {
      siblings.forEach((siblingItem) => {
        if (currentLsit.find((currentLsitItem) => (currentLsitItem === siblingItem._id)) === -1) {
          if (siblingItem._id !== currentCategoryItem._id) {
            checkContainAttr = false;
          }
        }
      });
    }
    if (siblings.length === 1 || checkContainAttr) {
      result.push(currentCategoryItem.parent_id);
    }
    const nextCategory = categories.filter((item) => (item._id === currentCategoryItem.parent_id));
    result = [...result, ...getNewAppearData(categories, currentLsit, nextCategory[0])];
  }
  return result;
};

export const getAllChildData = (categories, currentCategoryItem, type) => {
  let result = [];
  const childArray = categories.filter((item) => (item[type] === currentCategoryItem._id));
  if (childArray.length > 0) {
    childArray.forEach((item) => {
      result.push(item._id);
      result = [...result, ...getAllChildData(categories, item, type)];
    });
  }
  return result;
};
