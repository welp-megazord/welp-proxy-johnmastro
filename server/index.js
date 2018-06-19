const express = require('express');
const parser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 2000;

app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

// Static
app.use(express.static(path.join(__dirname, '../client/dist')));

app.listen(PORT, (err) => {
  if(err) console.log('Err connecting to server: ', err);
  else console.log('Successfully connected to server on port: ', PORT);
})