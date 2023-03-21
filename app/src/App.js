import './App.css';
import React, { useEffect } from 'react';
import AskForm from './components/AskForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  useEffect(() => {
    document.title = "Promptly"; // set the title
  }, []);
  return (
    <div>
      <h1>Promptly</h1>
      <AskForm/>
    </div>
  )
}

export default App;
