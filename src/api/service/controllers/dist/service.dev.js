'use strict';
/**
 *  service controller
 */

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createCoreController = require('@strapi/strapi').factories.createCoreController;

module.exports = createCoreController('api::service.service', function (_ref) {
  var strapi = _ref.strapi;
  return {
    findOne: function findOne(ctx) {
      var id, query, service;
      return regeneratorRuntime.async(function findOne$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              id = ctx.params.id;
              query = _objectSpread({}, ctx.query, {
                populate: ['lecture']
              });
              _context.next = 4;
              return regeneratorRuntime.awrap(strapi.service('api::service.service').findOne(id, query));

            case 4:
              service = _context.sent;
              return _context.abrupt("return", service);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    findByAttendee: function findByAttendee(ctx) {
      var query, attendeeId, services;
      return regeneratorRuntime.async(function findByAttendee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              query = _objectSpread({}, ctx.query, {
                populate: ['lecture']
              });
              attendeeId = ctx.params.attendeeId;
              _context2.next = 4;
              return regeneratorRuntime.awrap(strapi.service('api::service.service').findServicesByAttendee({
                attendeeId: attendeeId,
                query: query
              }));

            case 4:
              services = _context2.sent;
              return _context2.abrupt("return", services);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    updatePresence: function updatePresence(ctx) {
      var query, response;
      return regeneratorRuntime.async(function updatePresence$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              query = _objectSpread({}, ctx.query, {
                populate: ['lecture']
              });
              _context3.next = 3;
              return regeneratorRuntime.awrap(strapi.service('api::service.service').updatePresence(ctx.params.id, {
                query: query
              }));

            case 3:
              response = _context3.sent;
              return _context3.abrupt("return", response);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  };
});