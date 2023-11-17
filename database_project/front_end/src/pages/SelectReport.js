import * as React from "react";
import { Link } from "react-router-dom";

export default function SelectReport() {
  return (
    <>
      <h1>Reports</h1>
      <h2>Please choose which report you would like to view:</h2>
      <Link to="/top25Manufacturers">Top 25 Popular Manufacturers</Link>
      <br></br>
      <br></br>
      <Link to="/manufacturerModelSearch">Manufacturer Model Search</Link>
      <br></br>
      <br></br>
      <Link to="/heatingCoolingMethodDetails">Heating / Cooling Method Details</Link>
      <br></br>
      <br></br>
      <Link to="/waterHeaterStatisticsByState">Water Heater Statistics by State</Link>
      <br></br>
      <br></br>
      <Link to="/offTheGridHouseholdDashboard">Off-the-grid Household Dashboard</Link>
      <br></br>
      <br></br>
      <Link to="/householdAveByRadius">Household Averages by Radius</Link>
    </>
  );
}
