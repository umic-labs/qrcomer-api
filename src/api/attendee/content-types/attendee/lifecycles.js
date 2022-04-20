'use strict';

const { SHA3 } = require('crypto-js')

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

    strapi.service('api::service.service').generateServicesByAppointment({ attendee: result })
  }
};

function composeQRCode({ registrationCode }) {
  const PREFIX = 'COMIC2022'
  const encryptedCode = SHA3(registrationCode, { outputLength: 32 })
  return `${PREFIX}-${encryptedCode}`
}

function composeQRCodeUrl({ code }){
  const QRCODE_API = 'https://api.qrserver.com/v1/create-qr-code/?size=750x750&data='
  return `${QRCODE_API}${code}`
}