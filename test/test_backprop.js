var assert = require('assert');
var Backbone = require('backbone');

var Backprop = require('../backprop');

describe('Backprop monkeypatch', function() {
    it('creates Backbone.property()', function() {
        Backprop.monkeypatch(Backbone);
        assert.equal(typeof Backbone.property, 'function');
    });
});


describe('Created model properties', function() {
    Backprop.monkeypatch(Backbone);
    var M = Backbone.Model.extend({
        name: Backbone.property({ default: 'asdf' }),
    });

    it('are readable with working defaults', function() {
        var m = new M();
        assert.equal(m.name, 'asdf');
    });

    it('are writable', function() {
        var m = new M();
        m.name = 'foo';
        assert.equal(m.name, 'foo');
    });
});


describe('Property type coercion', function() {
    Backprop.monkeypatch(Backbone);
    var M = Backbone.Model.extend({
        myString: Backbone.property({ coerce: String }),
        myNum: Backbone.property({ coerce: Number }),
        myBool: Backbone.property({ coerce: Boolean }),
    });

    it('works for numbers', function() {
        var m = new M();

        m.myNum = 42;
        assert.strictEqual(m.myNum, 42);

        m.myNum = '123';
        assert.strictEqual(m.myNum, 123);

        m.myNum = 'asdf';
        assert.ok(isNaN(m.myNum));
    });

    it('works for strings', function() {
        var m = new M();

        m.myString = 'asdf';
        assert.strictEqual(m.myString, 'asdf');

        m.myString = 123;
        assert.strictEqual(m.myString, '123');
    });

    it('works for booleans', function() {
        var m = new M();

        m.myBool = true;
        assert.strictEqual(m.myBool, true);

        m.myBool = undefined;
        assert.strictEqual(m.myBool, false);

        m.myBool = 123;
        assert.strictEqual(m.myBool, true);
        m.myBool = 0;
        assert.strictEqual(m.myBool, false);

        m.myBool = 'false';
        assert.strictEqual(m.myBool, true);     // As expected when calling Boolean('false');
    });
});