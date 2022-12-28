'use strict';


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

  async findByPreference(ctx) {
    const { preferenceId } = ctx.params;

    const purchase = await strapi.service('api::purchase.purchase')
      .findByPreference(preferenceId);

    return this.transformResponse(purchase);
  },

  async feedback(ctx) {
    const { preferenceId } = ctx.params;
    const { status } = ctx.query

    const nextPurchase = await strapi.service('api::purchase.purchase')
      .feedback({ preferenceId, status });

    return this.transformResponse(nextPurchase);
  },

  async confirmation(ctx) {
    await strapi.plugins['email'].services.email.send({
      to: 'leandrosustenido@mailinator.com',
      from: 'leandro@umic.com.br',
      replyTo: 'leandro@umic.com.br',
      subject: 'Teste de envio 1, subject',
      text: 'Teste de envio 1, text'
    })

    ctx.send("Email sent");
  },
}));
