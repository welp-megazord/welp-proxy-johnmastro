const fs = require('fs');
const fetch = require('node-fetch');

const loadBundle = (cache, item, file) => {
  process.nextTick(() => {
    console.log('Loading:', file);
    cache[item] = require(file).default;
  });
};

const fetchBundles = (path, services, suffix = '', require = false) => {
  Object.keys(services).forEach(item => {
    const file = `${path}/${item}${suffix}.js`;
    console.log('File:', file);
    fs.access(file, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const url = `${services[item]}${suffix}.js`;
          console.log(`Fetching: ${url}`);
          fetch(url)
            .then(res => {
              const dst = fs.createWriteStream(file);
              res.body.pipe(dst);
              res.body.on('end', () => {
                require ? loadBundle(services, item, file) : null;
              });
            })
            .catch(err => {
              console.error('Error fetching file:', err);
            });
        } else {
          console.error('Unknown FS error:', err);
        }
      } else {
        require ? loadBundle(services, item, file) : null;
      }
    });
  });
};

module.exports = (clientPath, serverPath, services) => {
  fetchBundles(clientPath, services);
  fetchBundles(serverPath, services, '-server', true);
  return services;
};
