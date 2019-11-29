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
  if (currentCategoryItem.parentId !== 'null') {
    const siblings = categories.filter((item) => (item.parentId === currentCategoryItem.parentId));
    let checkContainAttr = true;
    if (currentLsit.length === 0) {
      checkContainAttr = false;
    } else {
      siblings.forEach((siblingItem) => {
        if (currentLsit.find((currentLsitItem) => (currentLsitItem === siblingItem.categoryId)) === -1) {
          if (siblingItem.categoryId !== currentCategoryItem.categoryId) {
            checkContainAttr = false;
          }
        }
      });
    }
    if (siblings.length === 1 || checkContainAttr) {
      result.push(parseInt(currentCategoryItem.parentId, 10));
    }
    const nextCategory = categories.filter((item) => (item.categoryId.toString() === currentCategoryItem.parentId));
    result = [...result, ...getNewAppearData(categories, currentLsit, nextCategory[0])];
  }
  return result;
};

export const getAllChildData = (categories, currentCategoryItem) => {
  let result = [];
  const childArray = categories.filter((item) => (item.parentId === currentCategoryItem.categoryId.toString()));
  if (childArray.length > 0) {
    childArray.forEach((item) => {
      result.push(item.categoryId);
      result = [...result, ...getAllChildData(categories, item)];
    });
  }
  return result;
};
