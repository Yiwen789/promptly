import React, { useState } from 'react';
import { askQuestion } from '../services/api';

function Answer({ question }) {
  const [data, setData] = useState([]);
  const answer = askQuestion(question);
  //console.log(question);
  setData(data);
  return (
    <div>
      <p>Test answer to question {question} is {answer}</p>
    </div>
  )
}

export default Answer;