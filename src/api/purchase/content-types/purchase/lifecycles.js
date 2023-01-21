'use strict';

module.exports = {
  async beforeUpdate(data, model) {
    const { id } = data;

    const APPROVED = 'approved'
    const WAITING = 'waiting'

    const prevPurchase = await strapi.query('api::purchase.purchase').findOne({ id })
    const nextPurchase = data.params.data

    const isApproving = prevPurchase.status !== APPROVED
      && nextPurchase.status === APPROVED

    const isWaiting = prevPurchase.status !== WAITING
      && nextPurchase.status === WAITING

    if(isApproving) {
      await strapi.service('api::purchase.purchase')
        .sendConfirmationEmail({
          to: prevPurchase.email,
          preferenceId: prevPurchase.preferenceId,
        });
    }

    if(isWaiting) {
      await strapi.service('api::purchase.purchase')
        .sendNotificationEmail({
          to: prevPurchase.email,
          preference: prevPurchase.preference,
        });
    }
  },
};
