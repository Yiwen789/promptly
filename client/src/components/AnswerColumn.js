function AnswerColumn(props) {
  const { formState, setFormState } = props;
  
  const handleCopyClick = () => {
    navigator.clipboard.writeText(formState.answer);
    setFormState({...formState, copied:true});
  }

 return (
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
 )
}

export default AnswerColumn;