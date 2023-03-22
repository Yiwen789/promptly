import './App.css';
import React, { useEffect } from 'react';
import AskForm from './components/AskForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

function App() {
  useEffect(() => {
    document.title = "Promptly"; // set the title
  }, []);
  return (
    <div>
      <br/>
      <h1>Promptly</h1>
      <h3>Best tool to help organize your chatGPT prompt </h3>
      <hr className="hr-style"/>
      <AskForm/>
    </div>
  )
}

export default App;
