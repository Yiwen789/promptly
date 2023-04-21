import axios from 'axios';
import API_URL from '../services/api';
import { useState, useEffect } from 'react';

function RequestForm(props) {
  const { formState, setFormState } = props;
  const [isSignedIn, setIsSignedIn] = useState(false);

  // useEffect(() => {
  //   window.gapi.load('auth2', () => {
  //     window.gapi.auth2.init({
  //       client_id: process.env.GOOGLE_CLIENT_ID
  //     }).then(() => {
  //       const authInstance = window.gapi.auth2.getAuthInstance();
  //       setIsSignedIn(authInstance.isSignedIn.get());
  //       authInstance.isSignedIn.listen(setIsSignedIn);
  //     });
  //   });
  // }, []);

  const handleSignIn = () => {
    window.location.href = '/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.request.trim()) {
      setFormState({ ...formState, error: 'Please provide a valid request' });
      return;
    }
    // Reformat the original request from user to a prefixed message.
    // TODO: #1 This is a temporary solution. We should use a better way to parse the request.
    const prefixedMessage = `Return a shortest list of 5 short questions  you need to ask for helping me ${formState.request}. 
    In the output, put a number in front of each question. `;

    try {
      setFormState({ ...formState, questionsIsLoading: true });
      const response = await axios.post(`${API_URL}/ask`, { prefixedMessage });
      // Split the response from chatGPT by new line and trim the whitespace.
      // TODO: #2 This is a temporary solution. We may need to adjust the parsing method later. 
      const params = response.data?.answer.trim().split('\n') || [];
      const splitParams = params.map(str => str.split(/^\d+\.\s+/)[1]);
      const additionalInformation = "Additional Information"
      splitParams.push(additionalInformation);
      setFormState({ ...formState, requiredFields: splitParams, responses: Array(splitParams.length).fill(''), error: '', questionsIsLoading: false });
    } catch (e) {
      setFormState({ ...formState, error: 'Oops! Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <h3>Write Request</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form onSubmit={handleSubmit} style={{ width: '85%' }}>
          <textarea className="form-control" placeholder="Type your request here starting with a verb" value={formState.request} onChange={e => setFormState({ ...formState, request: (e.target.value) })} />
          <br />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <button className="btn btn-primary mb-2" type="submit">Send Request</button>
          </div>
        </form>

        <button className="btn btn-primary mb-2" onClick={handleSignIn}>Sign in with Google</button>

      </div>
    </div>
  );
}

export default RequestForm;
