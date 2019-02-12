module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    next();
  } else {
    const { headers } = req;
    const referer = headers['referer'];
    console.log('referer is ', referer);
    console.log('valid url is ', process.env.VALID_URL);
    return referer === process.env.VALID_URL
      ? next()
      : res.json({ message: 'Not Accessible' });
  }
};
