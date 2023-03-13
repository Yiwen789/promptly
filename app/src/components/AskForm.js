import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API_URL from '../services/api';

function AskForm() {
  const [request, setRequest] = useState('');
  const [requiredFields, setRequiredFields] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.trim()) {
      setError('Please provide a valid request');
      return;
    }
    setIsLoading(true);
    // Reformat the original request from user to a prefixed message.
    // TODO: #1 This is a temporary solution. We should use a better way to parse the request.
    const prefixedMessage = `Return a shortest list of question you need to ask for helping me ${request}`;

    try {
      const response = await axios.post(`${API_URL}/ask-params-list`, { prefixedMessage });
      // Split the response from chatGPT by new line and trim the whitespace.
      // TODO: #2 This is a temporary solution. We should use a better way to parse the response.
      const params = response.data?.answer.trim().split('\n') || [];
      setRequiredFields(params);
      setResponses(Array(params.length).fill(''));
      setError('');
    } catch (error) {
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the change of the response input.
  const handleResponseInputChange = (event, index) => {
    const newResponses = [...responses];
    newResponses[index] = event.target.value;
    setResponses(newResponses);
  };

  // Render the required fields and the response input for each field.
  const renderRequiredFields = () => {
    if (requiredFields.length > 0) {
      return (
        <div>
          {requiredFields.map((param, index) => {
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
      {/* TODO: #3 Add a button to submit the responses and reformat the prompt. */}
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {renderRequiredFields()}
    </div>
  );
}

AskForm.propTypes = {
  apiUrl: PropTypes.string.isRequired,
};

export default AskForm;