const path = require('path');
const express = require('express');
const parser = require('body-parser');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 2000;

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// Static
app.use(express.static(path.join(__dirname, './client/dist')));

const clientBundles = './client/dist/services';
const serverBundles = './templates/services';
const serviceConfig = require('./services.json');
const loader = require('./loader');
const services = loader(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDOM = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

// Proxy to the header component
app.get('/api/header/restaurant/:id', (req, res) => {
  const { id } = req.params;
  const url = `http://localhost:3000/api/header/restaurant/${id}`;
  fetch(url)
    .then(proxied => {
      proxied.body.pipe(res);
    })
    .catch(err => {
      console.error(`Error getting ${url}:`, err);
      res.status(500).send('Internal server error');
    });
});

// See https://medium.com/styled-components/the-simple-guide-to-server-side-rendering-react-with-styled-components-d31c6b2b8fbf
const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    const component = React.createElement(components[item], props);
    return ReactDOM.renderToString(component);
  });
};

const renderSSR = (req, res) => {
  const props = {};
  const components = renderComponents(services, props);
  res.end(Layout(
    'Welp',
    App(...components),
    Scripts(Object.keys(services))
  ));
};

app.get('/', renderSSR);
app.get('/index.html', renderSSR);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Error connecting to server: ', err);
  } else {
    console.log('Successfully connected to server on port: ', PORT);
  }
});
