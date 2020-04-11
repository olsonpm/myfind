'use strict'

//---------//
// Imports //
//---------//

const fs = require('fs'),
  path = require('path'),
  { includesAny, log } = require('./utils')

//
//------//
// Main //
//------//

const myfindSync = args =>
  recursiveMyfind(Object.assign({ curDir: './' }, args))

const recursiveMyfind = args => {
  const { absoluteStartDir, curDir, pathExcludes, pathIncludes, type } = args

  const fileInfo = fs
    .readdirSync(path.resolve(absoluteStartDir, curDir), {
      withFileTypes: true,
    })
    .map(dirEnt => {
      const pathToTest = path.join(curDir, dirEnt.name),
        isExcluded =
          pathExcludes.length && includesAny(pathToTest, pathExcludes),
        shouldTraverse =
          dirEnt.isDirectory() && !dirEnt.isSymbolicLink() && !isExcluded

      let shouldPrint = !isExcluded

      if (type === 'file') shouldPrint = shouldPrint && !dirEnt.isDirectory()
      else if (type === 'directory')
        shouldPrint = shouldPrint && dirEnt.isDirectory()

      if (pathIncludes.length)
        shouldPrint = shouldPrint && includesAny(pathToTest, pathIncludes)

      return { pathName: pathToTest, shouldPrint, shouldTraverse }
    })

  for (const { pathName, shouldPrint, shouldTraverse } of fileInfo) {
    if (shouldPrint) log(pathName)
    if (shouldTraverse) {
      const newArgs = Object.assign({}, args, { curDir: pathName })
      recursiveMyfind(newArgs)
    }
  }
}

//
//---------//
// Exports //
//---------//

module.exports = myfindSync
