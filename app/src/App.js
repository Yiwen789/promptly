import './App.css';
import React, { useEffect } from 'react';
import AskForm from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';


function App() {
  useEffect(() => {
    document.title = "Promptly"; // set the title
  }, []);
  return (
    <div>
      <header style={{ backgroundColor: 'lightblue', padding: '20px' }}></header>
      <section className='title-container'>
        <h1>Promptly</h1>
        <br></br>
        <h3>The best tool to organize your prompts</h3>
      </section>
      <hr className="hr-style" />
      <AskForm />
      <footer style={{ backgroundColor: 'lightblue', padding: '20px' }}></footer>
    </div>
  )
}

export default App;
