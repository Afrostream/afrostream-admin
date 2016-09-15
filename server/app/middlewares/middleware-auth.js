'use strict';

module.exports = function () {
  return function (req, res, next) {
    req.userAccessToken = req.get('Access-Token');
    next();
  };
};
