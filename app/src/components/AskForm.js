import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import API_URL from '../services/api';
import QuestionFields from './QuestionFields';


function AskForm() {
  const [formState, setFormState] = useState({
    request: '',
    requiredFields: [],
    newField: '',
    responses: [],
    answer: '',
    questionsIsLoading: false,
    resIsLoading:false,
    error: '',
    showNewField: false,
    copied: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.request.trim()) {
      setFormState({...formState, error: 'Please provide a valid request'});
      return;
    }
    // Reformat the original request from user to a prefixed message.
    // TODO: #1 This is a temporary solution. We should use a better way to parse the request.
    const prefixedMessage = `Return a shortest list of 5 short questions  you need to ask for helping me ${formState.request}. 
    In the output, put a number in front of each question. `;

    try {
      setFormState({...formState, questionsIsLoading: true});
      const response = await axios.post(`${API_URL}/ask`, { prefixedMessage });
      // Split the response from chatGPT by new line and trim the whitespace.
      // TODO: #2 This is a temporary solution. We may need to adjust the parsing method later. 
      const params = response.data?.answer.trim().split('\n') || [];
      const splitParams = params.map(str => str.split(/^\d+\.\s+/)[1]);
      const additionalInformation = "Additional Information"
      splitParams.push(additionalInformation);
      setFormState({...formState, requiredFields: splitParams, responses: Array(splitParams.length).fill(''), error: '', questionsIsLoading:false});
    } catch (e) {
      setFormState({...formState, error: 'Oops! Something went wrong. Please try again.'});
    } 
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(formState.answer);
    setFormState({...formState, copied:true});
  }

  return (
    <div className="d-flex">
      <div className="column">
        <div className="column-header">
            <h3>Write Request</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <form onSubmit={handleSubmit} style={{ width: '85%' }}>
            <textarea className="form-control" placeholder="Type your request here starting with a verb" value={formState.request} onChange={e => setFormState({...formState, request: (e.target.value)})} />
            <br />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button className="btn btn-primary mb-2" type="submit">Send Request</button>
            </div>
          </form>
        </div>
      </div>

      <div className="vertical-line"></div>

      <div className="column">
        <div className="column-header">
          <h3>Answer Questions</h3>
        </div>
        {formState.error && <p style={{ color: 'red' }}>{formState.error}</p>}
        <div class="d-flex justify-content-center my-3">
          {formState.questionsIsLoading && <div class="spinner-border spinner-border-md text-primary"></div>}
        </div>
        <QuestionFields formState={formState} setFormState={setFormState} />
      </div>

      <div className="vertical-line"></div>


      <div className="column">
        <div className="column-header">
          <h3>Get Result</h3>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-center my-3">
            {formState.resIsLoading && <div class="spinner-border text-primary"></div>}
          </div>
          <div class="answer-section">
            {formState.error && <p class="text-danger">{formState.error}</p>}
            <div class="answer-text">
              {formState.answer || ""}
            </div>
          </div>
          <div class="d-flex justify-content-center my-3">
            <button class="btn btn-success" onClick={handleCopyClick}>{formState.copied ? 'Copied!' : 'Copy'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

AskForm.propTypes = {
  API_URL: PropTypes.string.isRequired,
};

export default AskForm;