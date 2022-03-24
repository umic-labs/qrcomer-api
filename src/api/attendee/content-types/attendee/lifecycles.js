'use strict';

const { SHA1 } = require('crypto-js')
const PREFIX = 'COMIC2022'

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    if (data.registrationCode) {
      data.code = `${PREFIX}${SHA1(data.registrationCode)}`;
    }
  },

  async afterCreate(event) {
    const { result } = event;

    strapi.service('api::service.service').generateServicesByLectures({ result })
    strapi.service('api::service.service').generateServicesByMeals({ result })
  }
};