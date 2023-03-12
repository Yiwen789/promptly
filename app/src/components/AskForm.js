import React, { useState } from 'react';
import axios from 'axios';


function AskForm() {
  const [message, setMessage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('http://localhost:3001/ask', { message });
    console.log(response.data)
    setAnswer(response.data?.answer || '');
    setQuestion(message);
    setMessage('');
  }; 
  
  return (
    <div>
      <h1>Ask a question</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit">Ask</button>
      </form>
      {question && <p>You asked: {question}</p>}
      {answer && <p>{answer}</p>}
    </div>
  );
}

export default AskForm;