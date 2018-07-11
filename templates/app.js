module.exports = ({ Header, Sidebar, Questions, Reviews }) => `
  <div id="header">${Header}</div>
  <div class="container">
    <!-- <div id="sidebar">${Sidebar}</div> -->
    <div id="questions">${Questions}</div>
    <div id="reviews">${Reviews}</div>
  </div>
`;
