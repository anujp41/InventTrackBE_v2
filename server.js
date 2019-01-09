const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8000;
const app = express();
const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/data', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});
