import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import AskForm from './components/HomePage';
import GoogleLogin from './components/GoogleLogin';
import './App.css';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
function App() {
  const [user, setUser] = useState(null);

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
            clientId={clientId}
            onLoginSuccess={setUser} 
            onLoginFailure={console.log}
          />
        )}
      </div>
      <hr className="hr-style" />
      <AskForm />
    </div>
  )
}

export default App;
