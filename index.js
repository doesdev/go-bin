'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')
const mkdirp = require('mkdirp')
const decompress = require('decompress')
const zip = require('decompress-unzip')
const tar = require('decompress-targz')
const cpu64 = (process.env.PROCESSOR_ARCHITECTURE || '').indexOf('64') !== -1
const arch = (cpu64 || process.arch.indexOf('64') !== -1) ? 'amd64' : '386'
const isWin = process.platform === 'win32'
const platform = isWin ? 'windows' : process.platform
const fileType = isWin ? 'zip' : 'tar.gz'
const goRelUrl = 'https://storage.googleapis.com/golang'

module.exports = (opts) => {
  opts = opts || {}
  const tag = typeof opts === 'string' ? opts : opts.version

  if (!tag) return Promise.reject(new Error('Target version not specified'))

  const noTag = opts.includeTag === false
  const baseDir = path.resolve(opts.dir || path.resolve(__dirname, 'vendor'))
  const goDir = noTag ? baseDir : path.join(baseDir, `go-${tag}`)
  const pkg = `go${tag}.${platform}-${arch}.${fileType}`
  const pkgUrl = `${goRelUrl}/${pkg}`
  const zipDest = path.join(baseDir, pkg)

  return new Promise((resolve, reject) => {
    mkdirp(goDir).then(() => {
      const decompOpts = { strip: 1, plugins: [zip(), tar()] }
      const arc = fs.createWriteStream(zipDest)
      arc.on('error', reject)

      https.get(pkgUrl, (res) => {
        res.pipe(arc).on('error', reject).on('close', () => {
          decompress(zipDest, goDir, decompOpts).then(() => {
            fs.unlink(zipDest, (err) => {
              if (err) console.warn(err)
              return resolve(goDir)
            })
          }).catch(reject)
        })
      }).on('error', reject)
    }).catch(reject)
  })
}
