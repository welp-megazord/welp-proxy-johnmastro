const path = require('path');
const express = require('express');
const parser = require('body-parser');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 2000;

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

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

Object.values(serviceConfig).forEach(service => {
  service.routes.forEach(route => {
    app.use(route, (req, res) => {
      const target = service.server + req.originalUrl;
      console.log('Proxy', req.originalUrl, '=>', target);
      fetch(target)
        .then(proxied => { proxied.body.pipe(res); })
        .catch(err => {
          console.error(`Error getting ${target}:`, err);
          res.status(500).send('Internal server error');
        });
    });
  });
});

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    const component = React.createElement(components[item], props);
    return ReactDOM.renderToString(component);
  });
};

const renderSSR = (_req, res) => {
  const props = { apiHost: `http://localhost:${PORT}` };
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
    console.error('Error starting server:', err);
  } else {
    console.log('Listening on port', PORT);
  }
});
