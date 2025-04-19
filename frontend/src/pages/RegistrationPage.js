import React from 'react';
import RegistrationForm from '../components/RegistrationForm';

const RegistrationPage = () => {
  const handleRegister = (data) => {
    console.log('User Registered:', data);
  };

  return (
    <div>
     
      
      <RegistrationForm onSubmit={handleRegister} />
    
    </div>
  );
};

export default RegistrationPage;
