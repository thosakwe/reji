/**
 *
 * @param line {Number}
 * @param index {Number}
 * @param opts {Object}
 * @constructor
 */
module.exports = function (line, index, opts) {
    this.line = {number: line, index: index};
    this.text = opts.text;
    this.type = opts.type;
};