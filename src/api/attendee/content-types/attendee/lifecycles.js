'use strict';
const uuid = require('uuid');

const { SHA3 } = require('crypto-js')

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    const code = composeQRCode()

    data.code = code
    data.qrCodeUrl = composeQRCodeUrl({ code })
  },
};

function composeQRCode() {
  const PREFIX = 'COMIC2023'
  const randomize = uuid.v4()
  return `${PREFIX}-${randomize}`
}

function composeQRCodeUrl({ code }){
  const QRCODE_API = 'https://api.qrserver.com/v1/create-qr-code/?size=750x750&data='
  return `${QRCODE_API}${code}`
}
