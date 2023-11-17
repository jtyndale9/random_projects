import * as React from 'react';
import { Link } from 'react-router-dom';

export default function SubmissionComplete() {

  return (
    <>
      <h1>Submission Complete!</h1>
      <p>Thank you for providing your information to Alternakraft!</p>
      <br></br>
      <br></br>
      <Link to="/">Return to the main menu</Link>
    </>
  );
}
