export const getCombineList = (uniqueObj, duplicateObj, field) => {
  let newArrayObj = Object.keys(uniqueObj).map((element) => {
    const u = uniqueObj[element]
    const d = Object.keys(duplicateObj).reduce((acc, el) => {
      if (uniqueObj[element][field] == duplicateObj[el][field]) {
        acc['quantity'] = duplicateObj[el].quantity
      }

      return acc
    }, {})
    return { ...u, ...d }
  })
  return newArrayObj
}
