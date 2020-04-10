'use strict'

//---------//
// Imports //
//---------//

const path = require('path'),
  tedent = require('tedent')

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

function validateArgs(args, isSync) {
  if (!path.isAbsolute(args.absoluteStartDir)) {
    const err = new Error(
      tedent(`
      absoluteStartDir is not absolute
      ${args.absoluteStartDir}
    `)
    )

    if (isSync) throw err
    else return Promise.reject(err)
  }
}

//
//---------//
// Exports //
//---------//

module.exports = { sync, async }
