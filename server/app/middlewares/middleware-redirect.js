module.exports.forceSSL = () =>  {
  return function (req, res, next) {
    if (env !== 'production' && env !== 'staging') {
      return next();
    }
    const proto = req.get('x-forwarded-proto')

    if (!proto || proto === 'https') {
      return next()
    }
    res.redirect(301, 'https://' + config['afrostream-admin'].host + req.originalUrl)
  }
}
