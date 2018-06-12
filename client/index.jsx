import React from 'react';
import ReactDom from 'react-dom';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div>
        Hello
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById('header'));
// ReactDom.render(<App />, document.getElementById('root'));
