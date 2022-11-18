'use strict';

const { SHA3 } = require('crypto-js')

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    const code = composeQRCode()

    data.code = code
    data.qrCodeUrl = composeQRCodeUrl({ code })
  },

  async afterCreate(event) {
    const { result } = event;

    strapi.service('api::service.service').generateServicesByAppointment({ attendee: result })
  }
};

function composeQRCode() {
  const PREFIX = 'COMIC2023'
  const randomize = Date.now().toString()
  const encryptedCode = SHA3(randomize, { outputLength: 16 })
  return `${PREFIX}-${encryptedCode}`
}

function composeQRCodeUrl({ code }){
  const QRCODE_API = 'https://api.qrserver.com/v1/create-qr-code/?size=750x750&data='
  return `${QRCODE_API}${code}`
}
