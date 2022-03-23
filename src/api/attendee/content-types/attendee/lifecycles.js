'use strict';

const { SHA1 } = require('crypto-js')

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    if (data.registrationCode) {
      data.code = SHA1("Message");
    }
  },

  async afterCreate(event) {
    const { result } = event;

    strapi.service('api::service.service').generateServicesByLectures({ result })
    strapi.service('api::service.service').generateServicesByMeals({ result })
  }
};