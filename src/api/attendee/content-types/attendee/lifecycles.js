'use strict';

const { SHA1 } = require('crypto-js')

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    const { registrationCode } = data
    const code = composeQRCode({ registrationCode })

    if (registrationCode) {
      data.code = code
      data.qrCodeUrl = composeQRCodeUrl({ code })
    }
  },

  async afterCreate(event) {
    const { result } = event;

    strapi.service('api::service.service').generateServicesByAppointment({ result })
  }
};

function composeQRCode({ registrationCode }) {
  const PREFIX = 'COMIC2022'
  return `${PREFIX}${SHA1(registrationCode)}`;
}

function composeQRCodeUrl({ code }){
  const QRCODE_API = 'https://api.qrserver.com/v1/create-qr-code/?size=750x750&data='
  return `${QRCODE_API}${code}`
}