import React from 'react'
import "../styles/Landing.css";
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='landing-main'>
    <h1>Customer Loyaty</h1>
    <p>Hello and welcome!</p>
    <Link to="/customerLogin" className="landing-login-button">Customer Login</Link>
    <Link to="/BusinessLogin" className="landing-register-button">Business Login</Link>
  </div>
  )
}

export default Landing