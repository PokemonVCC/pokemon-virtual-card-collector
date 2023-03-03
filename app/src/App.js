import React, { Component } from 'react';
import './App.css';

import 'rsuite/dist/rsuite.min.css';
import { Button } from 'rsuite';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Button appearance='primary'>Hello world</Button>
      </div>
    );
  }
}

export default App;