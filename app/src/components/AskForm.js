import React, { useState } from 'react';
import Answer from './Answer';

function AskForm() {
  const [submitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsSubmitted("User asked a question");
    console.log("submit button clicked");
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
      {submitted && <Answer/>}
    </div>
  )
}

export default AskForm;