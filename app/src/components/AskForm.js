import React, { useState } from 'react';
import axios from 'axios';


function AskForm() {
  const [request, setRequest] = useState('');
  const [paramsList, setParamsList] = useState([]);
  const [responses, setResponses] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const prefixedMessage = `Return a list of information you need to ${request}`;
    try {
      if (request == null) {
        throw new Error("Uh oh, no prompt was provided");
      }
      else {
        setRequest(request);
        const response = await axios.post('http://localhost:3001/ask-params-list', { prefixedMessage });
        let params = response.data?.answer.trim().split('\n') || [];
        if (params.length === 0) {
          setParamsList([]);
          setResponses([]);
          return;
        }
        setParamsList(params);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResponseInputChange = (event, index) => {
    const newResponses = [...responses];
    newResponses[index] = event.target.value;
    setResponses(newResponses);
  };

  const renderParamsList = () => {
    if (paramsList.length > 0) {
      return (
        <div>
          {paramsList.map((param, index) => {
            return (
              <div key={index}>
                <h3>{param}</h3>
                <textarea
                  rows="3"
                  cols="50"
                  value={responses[index] || ''}
                  onChange={(event) => handleResponseInputChange(event, index)}
                />
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <h1>Ask a question</h1>
      <form onSubmit={handleSubmit}>
        <textarea rows="5" placeholder="Type your request here starting with a verb" value={request} onChange={e => setRequest(e.target.value)} />
        <br />
        <button type="submit">Ask</button>
      </form>
      {renderParamsList()}
    </div>
  );
}

export default AskForm;