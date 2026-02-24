'use strict';

/**
 * Middleware CORS — mengizinkan frontend React (port 5173) 
 * untuk mengakses API Strapi.
 */
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
  };
};
