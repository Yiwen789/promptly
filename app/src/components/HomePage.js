import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RequestColumn from './RequestColumn';
import QuestionColumn from './QuestionColumn';
import AnswerColumn from './AnswerColumn';

import { Resizable } from 'react-resizable';


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

  const [dimensions, setDimensions] = useState({ 
    width: 200, height: 200 
  });

  const handleResize = (event, { size }) => {
    setDimensions({ width: size.width, height: size.height });
  };

  return (
    <div className="d-flex">
      <Resizable width={200} height={200} onResize={handleResize}>
      <RequestColumn formState={formState} setFormState={setFormState}/>
      </Resizable>
      
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