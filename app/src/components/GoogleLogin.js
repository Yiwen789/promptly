import React from 'react';
import GoogleLogin from 'react-google-login';

function GoogleLoginComponent({ clientId, onLoginSuccess, onLoginFailure }) {
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
      .then((data) => onLoginSuccess(data))
      .catch((error) => console.log(error));
  };

  const handleGoogleLoginFailure = (error) => {
    console.log(error);
    onLoginFailure(error);
  };

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={handleGoogleLoginSuccess}
      onFailure={handleGoogleLoginFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
}

export default GoogleLoginComponent;