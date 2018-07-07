module.exports = (items) => {
  const sources = items.map(item => (
    `<script src="/services/${item}.js"></script>`
  ));

  const hydrates = items.map(item => `
    ReactDOM.hydrate(
      React.createElement(${item}),
      document.getElementById('${item.toLowerCase()}')
    );
  `);

  return `
    <script src="/lib/react.development.js"></script>
    <script src="/lib/react-dom.development.js"></script>
    ${sources.join('\n')}
    <script>
      ${hydrates.join('\n')}
    </script>
  `;
};
