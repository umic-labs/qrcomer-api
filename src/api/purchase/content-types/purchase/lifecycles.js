'use strict';

module.exports = {
  async beforeUpdate(data, model) {
    const { id } = data;

    const PENDING = 'pending'
    const APPROVED = 'approved'

    const prevPurchase = await strapi.query('api::purchase.purchase').findOne({ id })
    const nextPurchase = data.params.data

    const isApproving = prevPurchase.status === PENDING
      && nextPurchase.status === APPROVED

    if(isApproving) {
      await strapi.service('api::purchase.purchase')
        .sendConfirmationEmail({
          to: nextPurchase.email,
          preferenceId: nextPurchase.preferenceId,
        });
    }
  },
};
