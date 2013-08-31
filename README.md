## level-json-wrapper

LevelDB JSON Wrapper

## Install

```bash
$ npm install level-json-wrapper
```

## Usage

```js
io = require('level-json-wrapper')('./db')

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

Call `level-json-wrapper` with a directory path to establish new LevelDB connection:

```js
io = require('level-json-wrapper')('./data')
```

A wrapper function with following methods will be returned:

* `get`
* `set`
* `destroy`
* `close`

The wrapper function can be called for getting and setting values like below:

```js
io('foo', { foo: 123 }, function (error) {

  io('foo', function (error, foo) {

    foo
    // => { foo: 123 }

  })

})
```
