module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    next();
  } else {
    const { headers } = req;
    const referer = headers['referer'];
    return referer === process.env.VALID_URL
      ? next()
      : res.json({ message: 'Not Accessible' });
  }
};
