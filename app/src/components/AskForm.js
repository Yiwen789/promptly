import React, { useState } from 'react';
import axios from 'axios';


function AskForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3001/ask', { question});
    console.log(response.data);
    setAnswer(response.data?.answer || '');
    setQuestion(question);
  }; 
  const handleChange = (e) => {
    setQuestion(e.target.value);
  };
  
  return (
    <div>
      <h1>Ask a question</h1>
      <form onSubmit={handleSubmit}>
      <textarea rows="5" value={question} onChange={handleChange} />
      <br />
      <button type="submit">Ask</button>
      </form>
      {answer && <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}> {answer}</div>}
    </div>
  );
}

export default AskForm;