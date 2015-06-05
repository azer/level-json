var createTest = require('prova');
var newIO = require('./');

var io1 = newIO();
var io2 = newIO('./db2');

test('saves and reads JSON values', function (t) {
  io1 = newIO();

  io1('foo', { foo: true, bar: 123, qux: { span: 'Eggs' } }, function (error) {
    t.error(error);

    io1('foo', function (error, record) {
      t.error(error);
      t.ok(record.foo);
      t.equal(record.qux.span, 'Eggs');
      t.end();
    });
  });
});

test('saves and reads with JSON keys', function (t) {
  io1 = newIO();

  io1({ key: 'foo' }, { foo: true, bar: 123, qux: { span: 'Eggs' } }, function (error, record) {
    t.error(error);

    io1({ key: 'foo' }, function (error, record) {
      t.error(error);
      t.ok(record.foo);
      t.equal(record.qux.span, 'Eggs');
      t.end();
    });
  });
});

test('saves and deletes a record', function (t) {
  io1 = newIO();

  io1('foo', { foo: true, bar: 123, qux: { span: 'Eggs' } }, function (error, record) {
    t.error(error);

    io1.del('foo', function (error) {
      t.error(error);

      io1('foo', function (error, record) {
        t.ok(error);
        t.notOk(record);
        t.end();
      });
    });
  });

});

test('checks if db is closed or open', function (t) {
  io1 = newIO(function () {
    t.ok(io1.isOpen());

    io1.close(function () {
      t.ok(io1.isClosed());
      t.end();
    });
  });
});


test('saves to a custom path', function (t) {
  io1 = newIO();

  io1('foo', { foo: true }, function (error, record) {
    t.error(error);

    io2 = newIO('./db2');

    io2('foo', function (error, record) {
      t.ok(error);
      t.notOk(record);

      io2('foo', { bar: true }, function (error, record) {
        t.error(error);

        io2('foo', function (error, record) {
          t.error(error);
          t.notOk(record.foo);
          t.ok(record.bar);
          t.end();
        });
      });

    });

  });

});

function test (title, fn) {
  createTest(title, function (t) {
    reset(function () {
      fn(t);
    });
  });
}


function reset (done){
  io1.destroy(function () {
    io2.destroy(done);
  });
}
