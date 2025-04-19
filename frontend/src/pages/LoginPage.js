import React from 'react';
import LoginForm from '../components/LoginForm';


const LoginPage = () => {
  const handleLogin = (data) => {
    console.log('User Logged In:', data);
  };

  return (
    <div>
     
      
      <LoginForm onLogin={handleLogin} />
     
    </div>
  );
};

export default LoginPage;
