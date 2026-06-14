import React from 'react';
import '.././Home.css'; // This brings in your quirky grid and colors
import Button from '@mui/material/Button';

const About = () => {
  return (
    <div className="quirky-bg">
      <div className="home-container" style={{ textAlign: 'center' }}>
        <section className="hero">
          <h1>Our <span className="highlight">Fruity Story</span></h1>
          <p style={{ fontSize: '1.2rem', marginTop: '20px' , color: '#c61515c7', fontWeight: 'bold'}}>
            We started in Karachi with one goal: to bring the freshest, 
            tastiest juices to your doorstep. Every bottle is a 
            treat for your health!
          </p>
        </section>
        <Button 
            variant="outlined" 
            sx={{ backgroundColor: 'yellow', borderRadius: '3px' }}
            >
              REGISTER NOW - MUI
            </Button>
        <button className="cta-btn">CONTACT US</button>
      </div>
    </div>
  );
};
export default About;