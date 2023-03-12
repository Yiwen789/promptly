import React, { useState } from 'react';

useState = {}
function AskForm() {
  return (
    <div>
      <h1>Ask a question</h1>
      <form>
        <label>
          Question:
          <input type="text" name="name" />
        </label>
        <br />
        
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AskForm;