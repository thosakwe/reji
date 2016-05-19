var assert = require('assert');
var Reji = require('../index');
var WHITESPACE = /( |\n|\r|\r\n)/;
var SEMI = /;$/;

describe('lexer', function () {
    it('lex a single int', function () {
        var tokens = new Reji.Lexer()
            .lex('INT', /[0-9]+/)
            .scan("1337");

        console.log(tokens);
        assert.equal(tokens.length, 1, "Invalid number of tokens");
        assert.equal(tokens[0].type, 'INT', "Invalid token type");
        assert.equal(tokens[0].text, '1337', "Wrong token text");
    });

    it('lex a variable declaration', function () {
        var tokens = new Reji.Lexer()
            .skip(WHITESPACE)
            .skip(SEMI)
            .lex('KW_VAR', /var/)
            .lex('ID', /[a-zA-Z_][a-zA-Z0-9_]*/)
            .scan("var foo;");

        console.log(tokens);
        assert.equal(tokens.length, 2, "Invalid number of tokens");
        assert.equal(tokens[0].type, 'KW_VAR', "'var' not recognized");
        assert.equal(tokens[0].text, 'var', "'var' token text is wrong");
        assert.equal(tokens[1].type, 'ID', "'foo' not recognized");
        assert.equal(tokens[1].text, 'foo', "'foo' token text is wrong");
    });

    it('skip by function', function () {
        var tokens = new Reji.Lexer()
            .skip(WHITESPACE)
            .skip(function (token) {
                return token.trim().toLocaleLowerCase() === 'boy';
            })
            .lex('NOUNt', /[a-z]+/)
            .scan("man girl boy woman");
        console.log(tokens);

        assert.equal(tokens.length, 3, "Invalid number of tokens");
        assert.equal(tokens[3].text, "woman", "'woman' not recognized");
    });

    it('correct token indices', function () {
    });

    it('dart', function () {
        var tokens = new Reji.Lexer()
            .skip(WHITESPACE)
            .lex('CURLY_L', /\{/)
            .lex('CURLY_R', /}/)
            .lex('PAREN_L', /\(/)
            .lex('PAREN_R', /\)/)
            .lex('KW_ASYNC', /async/)
            .lex('ID', /[a-z]+/)
            .scan("main () async {}");
        console.log(tokens);
    });
});