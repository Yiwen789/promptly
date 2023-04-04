import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RequestColumn from './RequestColumn';
import QuestionColumn from './QuestionColumn';
import AnswerColumn from './AnswerColumn';


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

  return (
    <div className="d-flex">
      <RequestColumn formState={formState} setFormState={setFormState}/>
      <div className="vertical-line"></div>

      <QuestionColumn formState={formState} setFormState={setFormState}/>
      <div className="vertical-line"></div>

      <AnswerColumn formState={formState} setFormState={setFormState}/>
    </div>
  );
}

AskForm.propTypes = {
  API_URL: PropTypes.string.isRequired,
};

export default AskForm;