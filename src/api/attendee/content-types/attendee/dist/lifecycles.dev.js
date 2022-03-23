"use strict";

var slugify = require('slugify');

module.exports = {
  beforeCreate: function beforeCreate(event) {
    var data = event.params.data;
    var SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>-]/g;
    var EMPTY_CHAR = '';

    if (data.registrationCode) {
      data.code = slugify(data.registrationCode, {
        remove: SPECIAL_CHARS,
        replacement: EMPTY_CHAR
      });
    }
  }
};