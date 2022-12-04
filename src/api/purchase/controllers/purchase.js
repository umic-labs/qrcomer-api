'use strict';
const mercadopago = require("mercadopago")

/**
 *  purchase controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::purchase.purchase', ({ strapi }) => ({
  async create(ctx) {
    const { data } = await super.create(ctx);
    
    const result = await strapi.db.query('api::purchase.purchase').findOne({
      where: { id: data.id },
      populate: ['attendees']
    });

    return this.transformResponse(result);
  },

  async createPreference(ctx) {
    const { request, res } = ctx

    console.log()

    let preference = {
      items: [
        {
          title: request.body.description,
          unit_price: Number(request.body.price),
          quantity: Number(request.body.quantity),
        }
      ],
      back_urls: {
        "success": "http://localhost:8080/feedback",
        "failure": "http://localhost:8080/feedback",
        "pending": "http://localhost:8080/feedback"
      },
      auto_return: "approved",
    };

    mercadopago.configure({
      access_token: "TEST-226655839749533-100805-f2b10079d93c7e217307bbf06f10738f-203994861",
    });

    const responsePreference = await mercadopago.preferences.create(preference)
      .then((response)  => {
        
        return response.body

      }).catch(function (error) {
        console.log(error);
		});

    return responsePreference
  }
}));
