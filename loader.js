#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const Promise = require('bluebird');

const download = (url, destination) => {
  return new Promise((resolve, reject) => {
    console.log('Fetching:', url);
    fetch(url)
      .then(res => {
        const stream = fs.createWriteStream(destination);
        res.body.pipe(stream);
        res.body.on('end', () => {
          console.log('Download finished:', destination);
          resolve();
        });
      })
      .catch(err => reject(err));
  });
};

const loadBundle = (cache, item, file) => {
  process.nextTick(() => {
    console.log('Loading:', file);
    cache[item] = require(file).default;
  });
};

const fetchBundles = (path, services, suffix = '', load = false) => {
  Object.keys(services).forEach(item => {
    const file = `${path}/${item}${suffix}.js`;
    console.log('File:', file);
    fs.access(file, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const { server, bundle } = services[item];
          const url = `${server}/${bundle}${suffix}.js`;
          download(url, file)
            .then(() => {
              if (load) {
                loadBundle(services, item, file);
              }
            })
            .catch(err => {
              console.error('Error fetching file:', err);
            });
        } else {
          console.error('Unknown FS error:', err);
        }
      } else {
        if (load) {
          loadBundle(services, item, file);
        }
      }
    });
  });
};

if (require.main === module) {
  const clientBundles = './client/dist/services';
  const serverBundles = './templates/services';
  const serviceConfig = require('./services.json');
  fetchBundles(clientBundles, serviceConfig);
  fetchBundles(serverBundles, serviceConfig, '-server');
}

module.exports = (clientPath, serverPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(serverPath, services, '-server', true);
  return services;
};
