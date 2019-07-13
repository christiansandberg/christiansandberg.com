import React from 'react';
import Rellax from 'rellax';
import Header from './Header';
import About from './About';
import Music from './Music';
import './App.css';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header/>
        <About/>
        <Music/>
      </div>
    );
  }

  componentDidMount() {
    this.rellax = new Rellax('.rellax');
  }
}

export default App;
