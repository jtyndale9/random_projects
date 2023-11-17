import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from '@mui/material/Alert';

export default function HouseholdAveragesByRadius() {
  const [errorMessage, setErrorMessage] = React.useState("");
  // two inputs:
  // postal code to center the search on,
  const [postal_code, setPostalCode] = React.useState('');
  // search radius (whole number: 0, 5, 10, 25, 50, 100, and 250)
  const [search_radius, setSearchRadius] = React.useState(0);

  const [sent_postal_code, setSentPostalCode] = React.useState('');
  const [sent_search_radius, setSentSearchRadius] = React.useState(0);

  const [averages, setAverages] = React.useState([]);

  const [householdCount, setHouseholdCount] = React.useState(0);
  const [houseCount, setHouseCount] = React.useState(0);
  const [apartmentCount, setApartmentCount] = React.useState(0);
  const [townhomeCount, setTownhomeCount] = React.useState(0);
  const [condominiumCount, setCondominiumCount] = React.useState(0);
  const [modularHomeCount, setModularHomeCount] = React.useState(0);
  const [tinyHomeCount, setTinyHomeCount] = React.useState(0);
  const [aveSqFt, setAveSqFt] = React.useState(0);
  const [aveHeatingTemp, setAveHeatingTemp] = React.useState(0);
  const [aveCoolingTemp, setAveCoolingTemp] = React.useState(0);
  const [publicUtilities, setPublicUtilities] = React.useState(0);
  const [offTheGridCount, setOffTheGridCount] = React.useState(0);
  const [commonGenerationMethod, setCommonGenerationMethod] = React.useState(0);
  const [aveMonthlyPowerGeneration, setAveMonthlyPowerGeneration] = React.useState(0);
  const [householdsWithBatteryStorage, setHouseholdsWithBatteryStorage] = React.useState(0);

  const search = () => {
    if (postal_code.length === 0) {
      return setErrorMessage('Please provide a postal code');
    }

    setSentPostalCode(postal_code);
    setSentSearchRadius(search_radius);
    // Step 2: Query DB for result
    // the postal code,
    // the search radius <- distance?,
    // for the households within that search radius:

    // the count of households,
    // the count of households for each household type (displaying 0 if there are none for that type),
    // the average square footage (as a whole number, rounded),
    // the average heating temperature (as a decimal number rounded to tenths),
    // the average cooling temperature (as a decimal number rounded to tenths),
    // which public utilities are used (displayed in a single cell, separated by commas),
    // the count of “off-the-grid” homes,
    // the count of homes with power generation,
    // the most common generation method for all households with power generation,
    // the average monthly power generation per household (as a whole number, rounded)
    // the count of households with battery storage.
    setErrorMessage('');
    axios.get(`http://localhost:8888/api/household_averages_by_radius/${postal_code}/${search_radius}`)
    .then(response => {
      const row = response?.data?.averages;

      const averages = {
        Household_Count: row[0],
        House_Count: row[1],
        Apartment_Count: row[2],
        Townhome_Count: row[3],
        Condominium_Count: row[4],
        Modular_Home_Count: row[5],
        Tiny_Home_Count: row[6],
        Ave_SqFt: row[7],
        Ave_Heating_Temp: row[8],
        Ave_Cooling_Temp: row[9],
        Public_Utilities: row[10],
        Off_The_Grid: row[11],
        Solar_Count: row[12],
        Wind_Turbine_Count: row[13],
        Ave_Monthly_Power_Generation: row[14],
        Households_With_Battery_Storage: row[15],
      };

      setAverages(row);
      setHouseholdCount(averages.Household_Count);
      setHouseCount(averages.House_Count);
      setApartmentCount(averages.Apartment_Count);
      setTownhomeCount(averages.Townhome_Count);
      setCondominiumCount(averages.Condominium_Count);
      setModularHomeCount(averages.Modular_Home_Count);
      setTinyHomeCount(averages.Tiny_Home_Count);
      setAveSqFt(averages.Ave_SqFt);
      setAveHeatingTemp(averages.Ave_Heating_Temp);
      setAveCoolingTemp(averages.Ave_Cooling_Temp);
      setPublicUtilities(averages.Public_Utilities);
      setOffTheGridCount(averages.Off_The_Grid);
      setCommonGenerationMethod(averages.Solar_Count > averages.Wind_Turbine_Count ? 'solar' : 'wind-turbine');
      setAveMonthlyPowerGeneration(averages.Ave_Monthly_Power_Generation);
      setHouseholdsWithBatteryStorage(averages.Households_With_Battery_Storage);
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err?.response?.data || 'Internal Server Error Occured');
    })
  };

  return (
    <>
      <Link to="/reports">View reports/query data</Link>
      <h1>Household Averages by Radius</h1>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <label>Post Code<input value={postal_code} onChange={(event) => setPostalCode(event.target.value)} /></label>
      <br></br>
      <br></br>
      <label>Radius
        <select value={search_radius} onChange={(event) => setSearchRadius(event.target.value)}>
          <option value="0">0 miles</option>
          <option value="5">5 miles</option>
          <option value="10">10 miles</option>
          <option value="25">25 miles</option>
          <option value="50">50 miles</option>
          <option value="100">100 miles</option>
          <option value="250">250 miles</option>
        </select>
      </label>
      <br></br>
      <br></br>
      <button onClick={(event) => search(event.target.value)}>Search</button>
      <br></br>
      <br></br>
      {sent_postal_code.length > 0 && <h3> Households within {sent_search_radius} miles of {sent_postal_code}</h3>}
      {errorMessage.length === 0 && averages.length === 0 && <h3>No results</h3>}
      {averages.length > 0 && <p>Household Count: {householdCount}</p>}
      {averages.length > 0 && <p>House Count: {houseCount}</p>}
      {averages.length > 0 && <p>Apartment Count: {apartmentCount}</p>}
      {averages.length > 0 && <p>Townhome Count: {townhomeCount}</p>}
      {averages.length > 0 && <p>Condominium Count: {condominiumCount}</p>}
      {averages.length > 0 && <p>Modular Home Count: {modularHomeCount}</p>}
      {averages.length > 0 && <p>Tiny Home Count: {tinyHomeCount}</p>}
      {averages.length > 0 && aveSqFt != null && <p>Ave SqFt: {aveSqFt}</p>}
      {averages.length > 0 && aveHeatingTemp != null && <p>Ave Heating Temp: {aveHeatingTemp}</p>}
      {averages.length > 0 && aveCoolingTemp != null && <p>Ave Cooling Temp: {aveCoolingTemp}</p>}
      {averages.length > 0 && publicUtilities != null && <p>Public Utilities: {publicUtilities}</p>}
      {averages.length > 0 && <p>Off-the-Grid: {offTheGridCount}</p>}
      {averages.length > 0 && !(averages[12] == 0 && averages[13] == 0) && <p>Common Generation Method: {commonGenerationMethod}</p>}
      {averages.length > 0 && aveMonthlyPowerGeneration != null && <p>Ave Monthly Power Generation: {aveMonthlyPowerGeneration}</p>}
      {averages.length > 0 && <p>Households With Battery Storage: {householdsWithBatteryStorage}</p>}
    </>
  );
}
