
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid', // For community providers pass the full package name (e.g. provider: 'strapi-provider-email-mandrill')
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: 'leandro@umic.com.br',
        defaultReplyTo: 'leandro@umic.com.br',
        testAddress: 'leandro@umic.com.br',
        fromname: 'Leandro da UMIC'
      },
    },
  },
});