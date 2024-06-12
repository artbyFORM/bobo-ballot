import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/base';

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <Button color="primary">
        Test MUI Button
      </Button>
    </div>
  );
}

export default App;