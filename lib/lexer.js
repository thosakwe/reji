var RejiToken = require('./token');

function RejiLexer() {
    this.tokenTypes = {};
    this.toSkip = [];
}

/**
 *
 * @param type {String}
 * @param rgx {RegExp}
 * @returns {RejiLexer}
 */
RejiLexer.prototype.lex = function (type, rgx) {
    this.tokenTypes[type] = rgx;
    return this;
};

/**
 * Ignores the given sequence or evaluator when encountered in text.
 * @param skipper {RegExp|Function<String, Boolean>}
 * @returns {RejiLexer}
 */
RejiLexer.prototype.skip = function (skipper) {
    this.toSkip.push(skipper);
    return this;
};

RejiLexer.prototype._isMatch = function (currentToken, keys) {
    for (var i = 0; i < keys.length; i++) {
        if (this.tokenTypes[keys[i]].test(currentToken)) {
            return keys[i];
        }
    }

    return false;
};

RejiLexer.prototype._shouldSkip = function (currentToken) {
    for (var j = 0; j < this.toSkip.length; j++) {
        if (this.toSkip[j] instanceof RegExp) {
            if (this.toSkip[j].test(currentToken)) {
                return true;
            }
        } else if (typeof this.toSkip[j] === 'function') {
            if (this.toSkip[j](currentToken)) {
                return true;
            }
        } else if (this.toSkip[j] === currentToken) {
            return true;
        }
    }

    return false;
};

/**
 *
 * @param inputText {String}
 * @returns {Array<RejiToken>}
 */
RejiLexer.prototype.scan = function (inputText) {
    var tokens = [];
    var currentToken = "";
    var line = 1, index = 0;
    var keys = Object.keys(this.tokenTypes);

    for (var i = 0; i < inputText.length; i++) {
        currentToken += inputText[i];
        index++;

        if (inputText[i] === '\n') {
            line++;
            index = 0;
        }


        if (this._shouldSkip(currentToken)) {
            currentToken = "";
            continue;
        }

        // Get greedy
        var matched = this._isMatch(currentToken, keys);
        var originalIndex = 0;

        while ((matched = this._isMatch(currentToken, keys))) {
            i++;
            if (i >= inputText.length) {
                break;
            }
            currentToken += inputText[i];

            if (this._shouldSkip(currentToken)) {
                i--;
                currentToken = currentToken.substring(0, currentToken.length - 1);
                break;
            }
        }

        var token = new RejiToken(line, index - 1, {type: matched, text: currentToken.trim()});
        tokens.push(token);
        index += i - originalIndex;
        currentToken = "";
    }

    return tokens;
};

module.exports = RejiLexer;