#! /usr/bin/env node
'use strict'

//---------//
// Imports //
//---------//

const parseArgs = require('parse-args'),
  tedent = require('tedent'),
  myfind = require('./lib/sync'),
  { version } = require('./package.json'),
  { log } = require('./lib/utils')

//
//------//
// Init //
//------//

const rawArgs = process.argv.slice(2)

//
//------//
// Main //
//------//

run()

function run() {
  if (handleHelpAndVersion()) return

  const { pathExcludes, pathIncludes, type } = parseArgs.namedSimple({
    allArgs: rawArgs,
    allowMultiple: ['--path-excludes', '--path-includes'],
  })

  myfind({
    absoluteStartDir: process.cwd(),
    pathExcludes,
    pathIncludes,
    type,
  })
}

//
//------------------//
// Helper Functions //
//------------------//

function handleHelpAndVersion() {
  if (rawArgs.includes('--help')) {
    printHelp()
    return true
  } else if (rawArgs.includes('--version')) {
    log('version: ' + version)
    return true
  }
}

function printHelp() {
  log(
    tedent(`
    Description: another alternative to 'find'

    Usage: myfind [--help|--version|named args]

    Example: myfind --path-excludes node_modules --path-excludes .git --type f --path-includes .test.js

    * Below the term 'file' includes 'directory' unless otherwise stated

    This utility recursively traverses all files from the current working
    directory and prints relative file paths which match the filters passed in.
    With no filters, this utility will print every file.  Symbolic links are not
    traversed, nor are directories whose paths end up excluded.

    Named args
      --path-excludes   exclude files where the relative path contains this string.
                        you may declare this arg multiple times to exclude
                        multiple paths
      --path-includes   include files where the relative path contains this string.
                        again, you may declare this arg multiple times to include
                        multiple paths
      --type            'file' or 'directory'.  Note that here 'file' means
                        everything that isn't a directory.  Node's fs module
                        exposes files of various types that myfind doesn't provide
                        filters for.
  `)
  )
}
