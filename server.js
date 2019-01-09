const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8000;
const app = express();
const routes = require('./routes');
const cors = require('cors');

const corsOptions = {
  origin: 'http://trackthiscount.s3-website-us-east-1.amazonaws.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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
