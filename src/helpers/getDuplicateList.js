export const getDuplicateList = (value, field) => {
  const has = Object.prototype.hasOwnProperty

  const counter = value.reduce((acc, element) => {
    if (!has.call(acc, element[field])) {
      acc[element[field]] = 0
    }
    acc[element[field]]++
    return acc
  }, {})

  const result = Object.keys(counter).map((element) => {
    return { name: element, quantity: counter[element] }
  })
  return result
}
