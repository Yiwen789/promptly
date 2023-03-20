import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API_URL from '../services/api';
const FORM_LENGTH = 10;
const GENERATE_RANDOM_SIGNAL = "You fill out this with imagination"


function AskForm() {
  const [request, setRequest] = useState('');
  const [requiredFields, setRequiredFields] = useState([]);
  const [newField, setNewField] = useState(''); // added new state variable
  const [responses, setResponses] = useState([]);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [checkedStatus, setCheckedStatus] = useState(() =>
    Array.from({ length: FORM_LENGTH }, () => true)
  );
  const [checked, setChecked] = useState(true);
  const [text, setText] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.trim()) {
      setError('Please provide a valid request');
      return;
    }
    setIsLoading(true);
    // Reformat the original request from user to a prefixed message.
    // TODO: #1 This is a temporary solution. We should use a better way to parse the request.
    const prefixedMessage = `Return a shortest list of short unique questions you need to ask for helping me ${request}. Display the questions with numbers.`;

    try {
      const response = await axios.post(`${API_URL}/ask`, { prefixedMessage });
      // Split the response from chatGPT by new line and trim the whitespace.
      // TODO: #2 This is a temporary solution. We may need to adjust the parsing method later. 
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

  const handleSubmitFields = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAnswer('');//clear previous answer
    const userInputJson = compileToJson(requiredFields, responses, checkedStatus);
    console.log(userInputJson);
    const requestMessageJson = Object.assign({ "request": request }, userInputJson);

    const prefixedMessage = `Complete this request: ${request}, 
    with these user-defined parameters ${userInputJson}.
    If the question does not have answer, come up with a
    reasonable answer to it.`;
    console.log(prefixedMessage);

    try {
      const response = await axios.post(`${API_URL}/ask`, { prefixedMessage });
      setAnswer(response.data?.answer);
    } catch (error) {
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }

  }

  const compileToJson = (keys, values, isRandomArr) => {
    const obj = {};
    keys.reduce((acc, key, index) => {
      // Add the current key-value pair to the object
      if (isRandomArr[index]) {
        obj[key] = "";
      } else {
        obj[key] = values[index];
      }
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
                    <label>
                      Generate Random Info:
                      <input
                        name="checkbox"
                        type="checkbox"
                        checked={checkedStatus[index]}
                        onChange={() => {
                          const updatedCheckedStatus = [...checkedStatus]; // create a copy of the original array
                          updatedCheckedStatus[index] = !updatedCheckedStatus[index];
                          setCheckedStatus(updatedCheckedStatus);

                        }
                        }
                      />
                    </label>
                    <textarea
                      value={responses[index] || ''}
                      disabled={checkedStatus[index]}
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
    <div className="container">
      <div className="column">
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block' }}>Ask a question</label>
          <textarea rows="5" placeholder="Type your request here starting with a verb" value={request} onChange={e => setRequest(e.target.value)} />
          <br />
          <button type="submit">Ask</button>
        </form>
      </div>

      <div className="vertical-line"></div>

      <div className="column">
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {renderRequiredFields()}
      </div>

      <div className="vertical-line"></div>

      <div className="answer-section">
        <div className="answer-text">{answer}</div>
      </div>
    </div>
  );
}

AskForm.propTypes = {
  API_URL: PropTypes.string.isRequired,
};

export default AskForm;