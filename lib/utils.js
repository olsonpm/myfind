'use strict'

const includesAny = (pathToTest, pathsToInclude) => {
  for (const p of pathsToInclude) {
    if (pathToTest.includes(p)) return true
  }

  return false
}

const log = something => console.log(something)

module.exports = { includesAny, log }
