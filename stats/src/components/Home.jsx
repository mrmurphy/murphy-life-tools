import React from 'react';
import { Link } from 'wouter';

const Home = () => {
  return (
    <div className="home">
      <h2>Welcome to Stats Tracker</h2>
      <p>Your personal stats tracking application</p>
      <nav>
        <Link to="/stats">View Stats</Link>
        <br />
        <Link to="/add-stat">Add New Stat</Link>
      </nav>
    </div>
  );
};

export default Home;