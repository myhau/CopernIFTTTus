import React from 'react';
import { Link } from 'react-router';
import ClickMapChooser from "./ClickMapChooser";

const App = ({ children }) => (
  <div>
    <header>
      <h1>Copernicus IFTTT</h1>
    </header>
    <ClickMapChooser />
  </div>
);

App.propTypes = { children: React.PropTypes.object };

export default App;
