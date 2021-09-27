export const getUniqueList = (value, field) => {
  const uniqueObj = new Object()

  for (let i = 0; i < value.length; i++) {
    const element = value[i][field]
    uniqueObj[element] = value[i]
  }

  return uniqueObj
}
