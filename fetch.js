#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');

const clientPath = './client/dist/services';
const serverPath = './templates/services';
const serviceConfig = './services.json';

const fetchBundles = (path, services, suffix = '') => {
  Object.keys(services).forEach(item => {
    const { server, bundle } = services[item];
    const url = `${server}/${bundle}${suffix}.js`;
    fetch(url)
      .then(res => {
        const file = `${path}/${item}${suffix}.js`;
        fs.open(file, 'w', (err, fd) => {
          if (err) {
            console.error('File system error:', err);
          } else {
            const stream = fs.createWriteStream(null, { fd });
            console.log('File:', file);
            res.body.pipe(stream);
            res.body.on('end', () => {
              console.log('Download finished:', file);
            });
          }
        });
      })
      .catch(err => {
        console.error(`Error downloading ${url}:`, err);
      });
  });
};

const run = (clientPath, serverPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(serverPath, services, '-server');
  return services;
};

if (require.main === module) {
  const services = require(serviceConfig);
  run(clientPath, serverPath, services);
}

module.exports = { run };
