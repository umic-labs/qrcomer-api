
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('SENDGRID_API_KEY'),
      },
      settings: {
        defaultFrom: env('FROM_EMAIL'),
        defaultReplyTo: env('FROM_EMAIL'),
        testAddress: env('FROM_EMAIL'),
        fromname: env('FROM_NAME'),
      },
    },
  },
});