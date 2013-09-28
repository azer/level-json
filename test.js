var newIO = require('./');
var callAll = require("call-all");

var io1;
var io2;

before(function(done){
  io1 = newIO();
  io2 = newIO('./db2');
  done();
});

beforeEach(function(done){
  var fns = [];

  if (io1) {
    fns.push(io1.destroy);
  }

  if (io2) {
    fns.push(io2.destroy);
  }

  callAll(fns)(done);
});

it('saves and reads JSON values', function(done){
  io1 = newIO();

  io1('foo', { foo: true, bar: 123, qux: { span: 'Eggs' } }, function (error, record) {
    if(error) return done(error);

    io1('foo', function (error, record) {
      if (error) return done(error);
      expect(record.foo).to.be.true;
      expect(record.qux.span).to.equal('Eggs');
      done();
    });
  });
});

it('saves and reads with JSON keys', function(done){
  io1 = newIO();

  io1({ key: 'foo' }, { foo: true, bar: 123, qux: { span: 'Eggs' } }, function (error, record) {
    if(error) return done(error);

    io1({ key: 'foo' }, function (error, record) {
      if (error) return done(error);
      expect(record.foo).to.be.true;
      expect(record.qux.span).to.equal('Eggs');
      done();
    });
  });
});

it('saves and deletes a record', function(done){
  io1 = newIO();

  io1('foo', { foo: true, bar: 123, qux: { span: 'Eggs' } }, function (error, record) {
    if(error) return done(error);

    io1.del('foo', function (error) {
      if (error) return done(error);

      io1('foo', function (error, record) {
        expect(error).to.exist;
        expect(record).to.not.exist;
        done();
      });
    });
  });

});

it('checks if db is closed or open', function(done){
  io1 = newIO(function () {
    expect(io1.isOpen()).to.be.true;

    io1.close(function () {
      expect(io1.isClosed()).to.be.true;
      done();
    });
  });
});


it('saves to a custom path', function(done){
  io1 = newIO();

  io1('foo', { foo: true }, function (error, record) {
    if(error) return done(error);

    io2 = newIO('./db2');

    io2('foo', function (error, record) {
      expect(error).to.exist;
      expect(record).to.not.exist;

      io2('foo', { bar: true }, function (error, record) {
        if(error) return done(error);

        io2('foo', function (error, record) {
          if (error) return done(error);
          expect(record.foo).not.to.be.true;
          expect(record.bar).to.be.true;
          done();
        });
      });

    });

  });

});
