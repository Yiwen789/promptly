import React, { useState } from 'react';
import Answer from './Answer';

function AskForm() {
  const [submitted, setIsSubmitted] = useState(false);
  const [question, setQuestion] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    const formData = new FormData(event.target);
    setQuestion(formData.get('question'));
  };

  return (
    <div>
      <h1>Ask a question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input type="text" name="question" placeholder="Ask a question" />
        </label>
        <br />
        
        <button type="submit">Submit</button>
      </form>
      {submitted && <Answer question={question}/>}
    </div>
  )
}

export default AskForm;