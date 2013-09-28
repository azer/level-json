## level-json  [![Build Status](https://travis-ci.org/azer/level-json.png)](https://travis-ci.org/azer/level-json)

LevelDB wrapper to avoid repeating encoding fields for just JSON

## Install

```bash
$ npm install level-json
```

## Usage Example

```js
io = require('level-json')('./db')

io.set('foo', { foo: 123, bar: 456 }, function (error) {
  if (error) throw error

  io.get('foo', function (error, foo) {
    if (error) throw error

    foo
    // => { foo: 123, bar: 456 }
  })
})
```


## API

Call `level-json` with a directory path to establish new LevelDB connection:

```js
io = require('level-json')('./data')
```

A wrapper function with following methods will be returned:

* `del`
* `get`
* `set`
* `destroy`
* `close`
* `batch`
* `isClosed`
* `isOpen`

The wrapper function can be called for getting and setting values like below:

```js
io('foo', { foo: 123 }, function (error) {

  io('foo', function (error, foo) {

    foo
    // => { foo: 123 }

  })

})
```
