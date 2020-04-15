#! /usr/bin/env node
'use strict'

const vIdx = process.argv.indexOf('-v') || process.argv.indexOf('--version')
const dIdx = process.argv.indexOf('-d') || process.argv.indexOf('--dir')
const version = vIdx !== -1 ? process.argv[vIdx + 1] : null
const dir = dIdx !== -1 ? process.argv[dIdx + 1] : null

require('./index')({ version, dir }).then(console.log).catch(console.log)
