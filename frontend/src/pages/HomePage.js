import React from 'react';
import Navbar from '../components/Navbar'; // Import the Navbar component
import backgroundImage from '../assets/images/homee.webp';

export default function HomePage() {
  return (
    <div style={{
      background: `linear-gradient(to right, rgba(3, 3, 72, 0.5), rgba(0, 0, 10, 0.3)), url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column', /* Stack elements vertically */
    }}>
      {/* Navbar */}
      <Navbar />
    </div>
  );
}