import './App.css';
import React, { useEffect, useState } from 'react';
import AskForm from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import GoogleLogin from 'react-google-login';

function App() {
  const [user, setUser] = useState(null);

  const handleGoogleLoginSuccess = (response) => {
    console.log(response);
    // Make a POST request to the server to authenticate the user
    fetch('/auth/google/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.tokenId }),
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.log(error));
  };

  const handleGoogleLoginFailure = (error) => {
    console.log(error);
  };

  useEffect(() => {
    document.title = "Promptly"; // set the title
  }, []);
  return (
    <div>
      <br />
      <h1>Promptly</h1>
      <div>
      {user ? (
        <p>Welcome, {user.displayName}!</p>
      ) : (
        <GoogleLogin
          clientId="106869594984-i0da5e91783kpt3nmmnkbkf72dbnujul.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
          cookiePolicy={'single_host_origin'}
        />
      )}
    </div>
      <hr className="hr-style" />
      <AskForm />
    </div>
  )
}

export default App;
