'use strict';

const mercadopago = require("mercadopago")
/**
 * purchase service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::purchase.purchase', ({ strapi }) => ({
  async create(params) {
    
    const preference = await strapi.service('api::purchase.purchase').createPreference(params)

    const result = await super.create({
      data: {
        ...params.data,
        preference,
        preferenceId: preference.id
      }
    });
  
    return result;
  },

  async createPreference(params) {
    const { total } = params.data

    let preference = {
      items: [
        {
          title: 'description',
          unit_price: Number(total/100),
          quantity: Number(1),
        }
      ],
      back_urls: {
        "success": `${process.env.FRONT_END_APP_URL}/feedback-payment`,
        "failure": `${process.env.FRONT_END_APP_URL}/feedback-payment`,
        "pending": `${process.env.FRONT_END_APP_URL}/feedback-payment`
      },
      auto_return: "approved",
    };

    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN
    });

    const responsePreference = await mercadopago.preferences.create(preference)
      .then((response)  => {
        return response.body
      }).catch(function (error) {
        console.log(error);
		});

    return responsePreference
  },

  async findByPreference(preferenceId) {  
    const result = await strapi.db.query('api::purchase.purchase')
      .findOne({
        where: {
          preferenceId: preferenceId
        },
        populate: ['attendees']
      });

    return result
  },

  async feedback({ preferenceId, status }) {
    console.log({ preferenceId, status })

    const purchase = await strapi.query('api::purchase.purchase')
      .update({
        where: {
          preferenceId,
        }, 
        data: { status },
      })

    return purchase;
  },
}));
