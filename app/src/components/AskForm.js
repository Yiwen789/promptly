import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API_URL from '../services/api';
const FORM_LENGTH = 10;

function AskForm() {
  const [request, setRequest] = useState('');
  const [requiredFields, setRequiredFields] = useState([]);
  const [newField, setNewField] = useState(''); // added new state variable
  const [responses, setResponses] = useState([]);
  const [answer, setAnswer] = useState('');
  const [questionsIsLoading, setQuestionsIsLoading] = useState(false);
  const [resIsLoading, setResIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNewField, setShowNewField] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const [checkedStatus, setCheckedStatus] = useState(() =>
    Array.from({ length: FORM_LENGTH }, () => true)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.trim()) {
      setError('Please provide a valid request');
      return;
    }
    setQuestionsIsLoading(true);
    // Reformat the original request from user to a prefixed message.
    // TODO: #1 This is a temporary solution. We should use a better way to parse the request.
    const prefixedMessage = `Return a shortest list of 5 short questions you need to ask for helping me ${request}. Display the questions with numbers.`;

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
      setQuestionsIsLoading(false);
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
      setShowNewField(false);
    }
  };

  const handleNewFieldInputChange = (event) => {
    setNewField(event.target.value); // update the new field input value
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCheckboxChange = (index) => {
    const updatedSelectedFields = [...selectedFields];
    updatedSelectedFields[index] = !updatedSelectedFields[index];
    setSelectedFields(updatedSelectedFields);
  };

  const handleDeleteSelectedFields = () => {
    const updatedRequiredFields = requiredFields.filter((_, index) => !selectedFields[index]);
    const updatedCheckedStatus = checkedStatus.filter((_, index) => !selectedFields[index]);
    const updatedResponses = responses.filter((_, index) => !selectedFields[index]);
    setSelectedFields([]);
    setRequiredFields(updatedRequiredFields);
    setCheckedStatus(updatedCheckedStatus);
    setResponses(updatedResponses);
  };

  // const handleDeleteField = (index) => {
  //   const newFields = [...requiredFields];
  //   const newResponses = [...responses];
  //   newFields.splice(index, 1);
  //   newResponses.splice(index, 1);
  //   setRequiredFields(newFields);
  //   setResponses(newResponses);
  // };

  const handleSubmitFields = async (e) => {
    e.preventDefault();
    setResIsLoading(true);
    setAnswer('');//clear previous answer
    const userInputJson = compileToJson(requiredFields, responses);
    console.log(userInputJson);

    const prefixedMessage = `Complete this request: ${request},
    with these user-defined parameters ${userInputJson}.
    If the question does not have answer, come up with a
    reasonable answer to it.`;
    console.log(prefixedMessage);

    try {
      const response = await axios.post(`${API_URL}/ask-res`, { prefixedMessage });
      setAnswer(response.data?.answer);
    } catch (error) {
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setResIsLoading(false);
    }

  }

  const compileToJson = (keys, values, isRandomArr) => {
    const obj = {};
    keys.reduce((acc, key, index) => {
      // Add the current key-value pair to the object
      obj[key] = values[index];
      return acc;
    }, {});

    return JSON.stringify(obj);
  }

  const renderRequiredFields = () => {
    if (requiredFields.length > 0) {
      return (
        <div className="d-flex justify-content-center">
          {isEditing ? (
            <div>
              {requiredFields.map((param, index) => (
                <div key={index} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedFields[index] || false}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <label className="form-check-label">
                    {param}
                  </label>
                </div>
              ))}
              <br />

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <button className="btn btn-success" onClick={() => setShowNewField(true)}>Add a new question</button>
                {showNewField && (
                  <div className="mt-2">
                    <textarea
                      className="form-control mb-2"
                      cols="50"
                      value={newField}
                      onChange={handleNewFieldInputChange}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button className="btn btn-primary" onClick={handleAddField}>Save & Add</button>
                    </div>
                    <br />
                  </div>
                )}
                <br />

                <button className="btn btn-danger ml-2" onClick={handleDeleteSelectedFields}>Delete Selected Questions</button>
                <br />
                <button className="btn btn-primary" onClick={() => setIsEditing(false)}> Return</button>

              </div>


            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <button className="btn btn-primary mb-2" onClick={handleEditClick}>Edit Questions</button>
              </div>
              <form onSubmit={handleSubmitFields}>
                <div>
                  {requiredFields.map((param, index) => (
                    <div key={index}>
                      <label className="form-label">{param}</label>
                      <textarea
                        className="form-control"
                        value={responses[index] || ''}
                        onChange={(event) => handleResponseInputChange(event, index)}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button className="btn btn-primary mt-2" type="submit">Submit Answers</button>
                </div>
              </form>
              <br />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  };


  return (
    <div className="d-flex">
      <div className="column">
        <div className="column-header">
          <h3>Write your one-sentence request</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <textarea className="form-control" placeholder="Type your request here starting with a verb" value={request} onChange={e => setRequest(e.target.value)} />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="btn btn-primary mb-2" type="submit">Send Request</button>
            </div>
          </form>
        </div>
      </div>

      <div className="vertical-line"></div>

      <div className="column">
        <div className="column-header">
          <h3>Answer the following questions</h3>
        </div>
        {questionsIsLoading && <p>Loading Questions...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {renderRequiredFields()}
      </div>

      <div className="vertical-line"></div>

      <div className="column">
        <div className="column-header">
          <h3>Result</h3>
        </div>
        <div className="answer-section">
          {resIsLoading && <p>Loading Result...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="answer-text">{answer}</div>
        </div>
      </div>
    </div>
  );
}

AskForm.propTypes = {
  API_URL: PropTypes.string.isRequired,
};

export default AskForm;