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
    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
    <!-- <script src="/lib/react.development.js"></script> -->
    <!-- <script src="/lib/react-dom.development.js"></script> -->
    ${sources.join('\n')}
    <script>
      ${hydrates.join('\n')}
    </script>
  `;
};
