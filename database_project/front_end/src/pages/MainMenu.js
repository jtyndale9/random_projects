import * as React from 'react';
import { Link } from 'react-router-dom';

export default function MainMenu() {
  return (
    <>
      <h1>Welcome to Alternakraft</h1>
      <h2>Please choose what you would like to do:</h2>
      <Link to="/householdInfo">Enter my household info</Link>
      <br></br>
      <Link to="/reports">View reports/query data</Link>
    </>
  );
}
