'use strict'

//---------//
// Imports //
//---------//

const path = require('path'),
  tedent = require('tedent'),
  {
    getType,
    keepValuesWhen,
    mapValues,
    omitAll,
    passThrough,
  } = require('./utils'),
  fileOrDir = new Set(['file', 'directory']),
  argToExpectedType = {
    absoluteStartDir: 'string',
    pathExcludes: 'array',
    pathIncludes: 'array',
    type: 'string',
  },
  allowedArgs = Object.keys(argToExpectedType)

//
//------//
// Main //
//------//

const sync = args => {
  validateArgs(args)

  return require('./sync')(args)
}

const async = async args => {
  validateArgs(args)

  return require('./async')(args)
}

//
//------------------//
// Helper Functions //
//------------------//

function validateArgs(args) {
  let errMsg

  const badArgs = Object.keys(omitAll(allowedArgs)(args)),
    badArgTypes = passThrough(args, [
      mapValues(getType),
      keepValuesWhen((type, arg) => type !== argToExpectedType[arg]),
      Object.entries,
    ])

  if (badArgs.length) {
    errMsg = tedent(`
      unexpected arguments were passed
      ${badArgs.join(', ')}

      only the following arguments are allowed
      ${allowedArgs.join(', ')}
    `)
  } else if (badArgTypes.length) {
    const badArgTypesStr = badArgTypes
      .map(([arg, badType]) => {
        const expectedType = argToExpectedType[arg]
        return `${arg}: expected '${expectedType}' but got '${badType}'`
      })
      .join('\n')

    errMsg = tedent(`
      unexpected arg types were passed.  All args must be strings

      ${badArgTypesStr}
    `)
  } else if (!path.isAbsolute(args.absoluteStartDir)) {
    errMsg = tedent(`
      absoluteStartDir is not absolute
      ${args.absoluteStartDir}
    `)
  } else if (!fileOrDir.has(args.type)) {
    errMsg = tedent(`
      type must be either 'file' or 'directory'
      type given: ${args.type}
    `)
  }

  if (errMsg) {
    const err = new Error(errMsg)
    err.id = 'invalid-args'
    throw err
  }
}

//
//---------//
// Exports //
//---------//

module.exports = { sync, async }
