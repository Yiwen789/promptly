import axios from 'axios';
import API_URL from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const compileToJson = (keys, values) => {
  const obj = {};
  keys.reduce((acc, key, index) => {
    // Add the current key-value pair to the object
    obj[key] = values[index];
    return acc;
  }, {});
  return JSON.stringify(obj);
}

function QuestionFields(props) {
  const { formState, setFormState } = props;

  const handleSubmitFields = async (e) => {
    e.preventDefault();
    setFormState({...formState, resIsLoading: true, answer: ''});//clear previous answer
    const userInputJson = compileToJson(formState.requiredFields, formState.responses);

    const prefixedMessage = `${formState.request},
    with the following information ${userInputJson}.`;

    try {
      const response = await axios.post(`${API_URL}/ask-res`, { prefixedMessage });
      setFormState({...formState, answer: response.data?.answer, resIsLoading: false});
    } catch (e) {
      setFormState({...formState, error: 'Oops! Something went wrong. Please try again.'});
    } 
  }

  const handleDeleteField = (index) => {
    const newFields = [...formState.requiredFields];
    const newResponses = [...formState.responses];
    newFields.splice(index, 1);
    newResponses.splice(index, 1);
    setFormState({...formState, requiredFields: newFields, responses: newResponses});
  };

  // Handle the change of the response input.
  const handleResponseInputChange = (event, index) => {
    const newResponses = [...formState.responses];
    newResponses[index] = event.target.value;
    setFormState({...formState, responses: newResponses});
  };

  const handleNewFieldInputChange = (event) => {
    setFormState({...formState, newField: event.target.value})// update the new field input value
  };

  // Add a new field to the requiredFields array.
  const handleAddField = () => {
    if (formState.newField.trim() !== '') { // only add a new field if the input is not empty
      setFormState({...formState, 
        requiredFields: [...formState.requiredFields, formState.newField], 
        responses: [...formState.responses, ''], 
        newField: '', 
        showNewField: false});
    }
  };

  if (formState.requiredFields.length > 0) {
    return (
      <div className="d-flex justify-content-center">
        <div style={{alignItems: ' center', width:'85%'}}>
          <form onSubmit={handleSubmitFields}>
            <div>
              {formState.requiredFields.map((param, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', alignItems: ' center', flexDirection: 'row'}}>
                    {(index !== formState.requiredFields.length - 1)? 
                      <FontAwesomeIcon
                      icon={faTimesCircle}
                      onClick={() => handleDeleteField(index)}
                      className="delete-button"
                    />
                    : null}
                    <label className="form-label">{param}</label>
                  </div>
                  <textarea
                    className="form-control"
                    value={formState.responses[index] || ''}
                    onChange={(event) => handleResponseInputChange(event, index)}
                    style={{ marginBottom: '10px', width: '85%' }}
                    />
                </div>
              ))}
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              <button className="btn btn-success" onClick={() =>setFormState({...formState, showNewField: true})}>Add a new question</button>
              {formState.showNewField && (
                <div className="mt-2">
                  <textarea
                    className="form-control mb-2"
                    cols="50"
                    value={formState.newField}
                    onChange={handleNewFieldInputChange}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button className="btn btn-primary" onClick={handleAddField}>Save & Add</button>
                  </div>
                  <br />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              <button className="btn btn-primary mt-2" type="submit">Submit Answers</button>

            </div>
          </form>
          <br />
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default QuestionFields;