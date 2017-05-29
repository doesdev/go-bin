'use strict'

// Setup
const fs = require('fs')
const path = require('path')
const https = require('https')
const mkdirp = require('mkdirp')
const decompress = require('decompress')
const zip = require('decompress-unzip')
const tar = require('decompress-targz')
const arch = process.arch.match(/64/) ? 'amd64' : '386'
const isWin = process.platform === 'win32'
const platform = isWin ? 'windows' : process.platform
const fileType = isWin ? 'zip' : 'tar.gz'
const goRelUrl = 'https://storage.googleapis.com/golang'

// Exports
module.exports = goBin

// Main
function goBin (opts) {
  opts = opts || {}
  let tag = typeof opts === 'string' ? opts : opts.version
  if (!tag) return Promise.reject(new Error('Target version not specified'))
  let noTag = opts.includeTag === false
  let baseDir = path.resolve(opts.dir || path.resolve(__dirname, 'vendor'))
  let goDir = noTag ? baseDir : path.join(baseDir, `go-${tag}`)
  let pkg = `go${tag}.${platform}-${arch}.${fileType}`
  let pkgUrl = `${goRelUrl}/${pkg}`
  let zipDest = path.join(baseDir, pkg)
  return new Promise((resolve, reject) => {
    mkdirp(goDir, (err) => {
      if (err) return Promise.reject(err)
      let arc = fs.createWriteStream(zipDest)
      arc.on('error', reject)
      https.get(pkgUrl, (res) => {
        res.pipe(arc).on('error', reject).on('close', () => {
          let decompOpts = {strip: 1, plugins: [zip(), tar()]}
          decompress(zipDest, goDir, decompOpts).then(() => {
            fs.unlink(zipDest, (err) => { if (err) console.warn(err) })
            return resolve(goDir)
          }).catch(reject)
        })
      }).on('error', reject)
    })
  })
}
