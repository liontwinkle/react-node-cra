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

export const getNewAppearData = (categories, currentLsit, currentCategoryItem) => {
  let result = [];
  if (currentCategoryItem.parentId !== '') {
    const siblings = categories.filter(item => (item.parentId === currentCategoryItem.parentId));
    let checkContainAttr = true;
    siblings.forEach((siblingItem) => {
      if (currentLsit.find(currentLsitItem => (currentLsitItem === siblingItem._id)) === -1) {
        if (siblingItem._id !== currentCategoryItem._id) {
          checkContainAttr = false;
        }
      }
    });
    if (siblings.length === 1 || checkContainAttr) {
      result.push(currentCategoryItem.parentId);
    }
    const nextCategory = categories.filter(item => (item._id === currentCategoryItem.parentId));
    result = [...result, ...getNewAppearData(categories, currentLsit, nextCategory[0])];
  }
  return result;
};

export const getAllChildData = (categories, currentCategoryItem) => {
  let result = [];
  const childArray = categories.filter(item => (item.parentId === currentCategoryItem._id));
  if (childArray.length > 0) {
    childArray.forEach((item) => {
      result.push(item._id);
      result = [...result, ...getAllChildData(categories, item)];
    });
  }
  return result;
};
