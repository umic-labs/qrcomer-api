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
}));
