module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8bccd5c4c92d2ab646d94b3351f748ba'),
  },
});
