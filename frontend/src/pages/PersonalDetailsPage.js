import React from 'react';
import PersonalDetailsForm from '../components/PersonalDetailsForm';


const PersonalDetailsPage = () => {
  const handleSubmit = (data) => {
    console.log('Personal Details Submitted:', data);
  };

  return (
    <div>
     
      
      <PersonalDetailsForm onSubmit={handleSubmit} />
      
    </div>
  );
};

export default PersonalDetailsPage;
