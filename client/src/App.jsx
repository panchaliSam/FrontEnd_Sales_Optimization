// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {MultiLevelSidebar} from './components/sideNavBar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MultiLevelSidebar/>
      </BrowserRouter>
    </div>
  );
}

export default App;
