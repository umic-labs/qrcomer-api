"use strict";

var slugify = require('slugify');

module.exports = {
  beforeCreate: function beforeCreate(event) {
    var data = event.params.data;
    var SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>-]/g;
    var EMPTY_CHAR = '';

    if (data.phone) {
      data.code = slugify(data.phone, {
        remove: SPECIAL_CHARS,
        replacement: EMPTY_CHAR
      });
    }
  }
};