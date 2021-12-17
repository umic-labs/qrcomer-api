'use strict';

const slugify = require('slugify');

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>-]/g
    const EMPTY_CHAR = ''
    
    if (data.phone) {
      data.code = slugify(data.phone, {
        remove: SPECIAL_CHARS,
        replacement: EMPTY_CHAR
      });
    }
  },

  async afterCreate(event) {
    const { result } = event;

    strapi.service('api::service.service').generateServicesByLectures({ result })
  }
};