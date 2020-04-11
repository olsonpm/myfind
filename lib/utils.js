'use strict'

const typeDetect = require('type-detect')

const getType = something => {
  const type = typeDetect(something)
  return type[0].toLowerCase() + type.slice(1)
}

const includesAny = (pathToTest, pathsToInclude) => {
  for (const p of pathsToInclude) {
    if (pathToTest.includes(p)) return true
  }

  return false
}

const keepValuesWhen = shouldKeep => obj => {
  const result = {}

  for (const [k, v] of Object.entries(obj)) {
    if (shouldKeep(v, k, obj)) {
      result[k] = v
    }
  }

  return result
}

const log = something => console.log(something)

const logErr = something => console.error(something)

const mapValues = mapperFn => obj => {
  const result = {}

  for (const [k, v] of Object.entries(obj)) {
    result[k] = mapperFn(v, k, obj)
  }

  return result
}

const omitAll = keys => obj => {
  const result = {}

  keys = new Set(keys)

  for (const [k, v] of Object.entries(obj)) {
    if (!keys.has(k)) result[k] = v
  }

  return result
}

const passThrough = (initialVal, allFns) => {
  let result = initialVal

  for (const fn of allFns) {
    result = fn(result)
  }

  return result
}

module.exports = {
  getType,
  includesAny,
  keepValuesWhen,
  log,
  logErr,
  mapValues,
  omitAll,
  passThrough,
}
