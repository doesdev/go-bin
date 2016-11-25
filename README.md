# go-bin [![NPM version](https://badge.fury.io/js/go-bin.svg)](https://npmjs.org/package/go-bin)   [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

> Get GO binaries by version tag

## local install

```sh
$ npm install --save go-bin
```

## cli install

```sh
$ npm install --global go-bin
```

## programmatic usage

```js
const goBin = require('go-bin')
goBin({version: '1.7.3', dir: '~/here'}).then(console.log).catch(console.error)
```

## cli usage

```sh
$ go-bin -v 1.7.3 -d ~/here
# ~/here/go-1.7.3
```

## License

MIT © [Andrew Carpenter](https://github.com/doesdev)
