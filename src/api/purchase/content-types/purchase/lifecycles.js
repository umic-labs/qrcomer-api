'use strict';

module.exports = {
  async beforeUpdate(data, model) {
    const { id } = data.params.where;

    const APPROVED = 'approved'
    const WAITING = 'waiting'
    const GENERATED = 'generated'
    
    const prevPurchase = await strapi.query('api::purchase.purchase').findOne({ where: { id } })
    const nextPurchase = data.params.data
    console.log({ prevPurchase, nextPurchase })

    const isApproving = prevPurchase.status !== APPROVED
      && nextPurchase.status === APPROVED

    const isWaiting = prevPurchase.status !== WAITING
      && nextPurchase.status === WAITING

    const isGenerating = prevPurchase.status !== GENERATED
      && nextPurchase.status === GENERATED

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

    if(isGenerating) {
      await strapi.service('api::purchase.purchase')
        .generageAttendees({
          purchase: prevPurchase,
        });
      
      delete data.params.data.attendees
    }
  },
};
