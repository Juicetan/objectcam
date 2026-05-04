export const removeObject = (arr, obj, findCallback) => {
  var index = arr.indexOf(obj);

  if (findCallback) {
    var foundIndex = arr.findIndex(findCallback);
    if (foundIndex >= 0) {
      index = foundIndex;
    }
  }

  if (index >= 0) {
    arr.splice(index, 1);
  }
  return arr;
}

export const moveObject = (arr, fromIdx, toIdx) => {
  const [item] = arr.splice(fromIdx, 1);
  if (item === undefined) {
    return arr;
  }
  arr.splice(toIdx, 0, item);
  return arr;
}