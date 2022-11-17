'use strict';
const { SHA3 } = require('crypto-js')

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    const number = data.id

    data.number = SHA3(number.toString(), { outputLength: 16 }).toString()
  },

  async afterCreate(event) {
    const result = await event.params.data.Attendees.data.map(attenddee => {
      strapi.db.query('api::attendee.attendee').create({ 
        data: {
          ...attenddee,
          "purchase": event.result.id
        }
      })
    })

    return result
  },
};
