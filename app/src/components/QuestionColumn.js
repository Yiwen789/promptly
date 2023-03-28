import QuestionFields from './QuestionFields';

function QuestionColumn(props) {
  const { formState, setFormState } = props;

  return (
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

  )
}

export default QuestionColumn;