'use strict';
/**
 * attendee service.
 */

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var createCoreService = require('@strapi/strapi').factories.createCoreService;

module.exports = createCoreService('api::attendee.attendee', function (_ref) {
  var _obj;

  var strapi = _ref.strapi;
  return _obj = {
    create: function create(params) {
      var result, lectures;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(_get(_getPrototypeOf(_obj), "create", this).call(this, params));

            case 2:
              result = _context.sent;
              _context.next = 5;
              return regeneratorRuntime.awrap(strapi.db.query('api::lecture.lecture').findMany());

            case 5:
              lectures = _context.sent;
              lectures.map(function (lecture) {
                strapi.db.query('api::service.service').create({
                  data: {
                    present: false,
                    lecture: lecture.id,
                    attendee: result.id
                  }
                });
              });
              return _context.abrupt("return", result);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  };
});