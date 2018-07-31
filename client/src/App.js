import React, { Component } from 'react';
import Navbar from '../src/components/layout/Navbar';
import Footer from '../src/components/layout/Footer';
import Landing from '../src/components/layout/Landing';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
        <Footer />
      </div>
    );
  }
}

export default App;
