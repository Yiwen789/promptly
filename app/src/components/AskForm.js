import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API_URL from '../services/api';

function AskForm() {
  const [request, setRequest] = useState('');
  const [requiredFields, setRequiredFields] = useState([]);
  const [newField, setNewField] = useState(''); // added new state variable
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

  // Add a new field to the requiredFields array.
  const handleAddField = () => {
    if (newField.trim() !== '') { // only add a new field if the input is not empty
      setRequiredFields([...requiredFields, newField]);
      setResponses([...responses, '']);
      setNewField('');
    }
  };

  const handleNewFieldInputChange = (event) => {
    setNewField(event.target.value); // update the new field input value
  };

  const handleDeleteField = (index) => {
    const newFields = [...requiredFields];
    const newResponses = [...responses];
    newFields.splice(index, 1);
    newResponses.splice(index, 1);
    setRequiredFields(newFields);
    setResponses(newResponses);
  };

  const handleSubmitFields = (event) => {
    event.preventDefault();
    console.log("submitting the fields");

    const userInputJson = compileToJson(requiredFields, responses);

    const requestMessageJson = Object.assign({"request": request}, userInputJson); 

    const prefixedMessage = `Complete this request: ${request}, with these user-defined parameters ${userInputJson}`;
    console.log(prefixedMessage);
    
  }

  const compileToJson = (keys, values) => {
    const obj = {};
    keys.reduce((acc, key, index) => {
      // Add the current key-value pair to the object
      obj[key] = values[index];
      return acc;
    }, {});

    return JSON.stringify(obj);
  }

  // Render the required fields and the response input for each field.
  const renderRequiredFields = () => {
    if (requiredFields.length > 0) {
      return (
        <div>
        <form onSubmit={handleSubmitFields}>
          <div>
          {requiredFields.map((param, index) => {
            return (
              <div key={index}>
                <label style={{ display: 'block' }}>{param}</label>
                <textarea
                  value={responses[index] || ''}
                  onChange={(event) => handleResponseInputChange(event, index)}
                />
                <button onClick={() => handleDeleteField(index)}>Delete Field</button>
              </div>
            );
          })}
          </div>
          <button type="submit">Submit </button>
        </form>

        <div key={requiredFields.length}>
          <label style={{ display: 'block' }}>Add a new field</label>
          <textarea
            rows="3"
            cols="50"
            value={newField}
            onChange={handleNewFieldInputChange}
          />
          </div>
          <button onClick={handleAddField}>Add Field</button>
        </div>
        
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block'}}>Ask a question</label>
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