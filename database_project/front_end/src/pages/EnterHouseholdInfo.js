import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import axios from 'axios';
import Alert from '@mui/material/Alert';

export default function EnterHouseholdInfo() {
  const [householdTypes, setHouseholdTypes] = React.useState([]);
  const [publicUtilitiesList, setPublicUtilities] = React.useState([]);
  if (householdTypes.length === 0) {
    axios.get(`http://localhost:8888/api/populate_household_dropdowns`)
      .then(response => {
        setHouseholdTypes(response.data.household_type.map(type => type[0]));
        setPublicUtilities(response.data.utility.map(type => type[0]));
      })
      .catch(err => {
        console.log(err);
        // setErrorMessage(err?.message);
      })
  }

  const [checkedNoHeat, setCheckedNoHeat] = React.useState(false);
  const [checkedNoCooling, setCheckedNoCooling] = React.useState(false);
  const [checkedElectric, setCheckedElectric] = React.useState(false);
  const [checkedGas, setCheckedGas] = React.useState(false);
  const [checkedSteam, setCheckedSteam] = React.useState(false);
  const [checkedLiquidFuel, setCheckedLiqidFuel] = React.useState(false);

  const handleChangeNoHeat = () => {
    setCheckedNoHeat(!checkedNoHeat);
  };

  const handleChangeNoCooling = () => {
    setCheckedNoCooling(!checkedNoCooling);
  };

  const handleChangeElectric = () => {
    setCheckedElectric(!checkedElectric);
  };

  const handleChangeGas = () => {
    setCheckedGas(!checkedGas);
  };

  const handleChangeSteam = () => {
    setCheckedSteam(!checkedSteam);
  };

  const handleChangeLiquidFuel = () => {
    setCheckedLiqidFuel(!checkedLiquidFuel);
  };

  const [homeType, setHomeType] = React.useState("house");

  const handleChangeHomeType = (newHomeType) => {
    setHomeType(newHomeType);
  };

  const [email, setEmail] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [squareFootage, setSquareFootage] = React.useState("");
  const [tHeating, setHeating] = React.useState(0);
  const [tCooling, setCooling] = React.useState(0);

  const [errorMessage, setErrorMessage] = React.useState("");

  const navigate = useNavigate();
  const next = () => {
    setErrorMessage('');

    if(!email) {
      return setErrorMessage('Please provide an email address.');
    }

    if(!postalCode) {
      return setErrorMessage('Please provide a postal code.');
    }

    const publicUtilities = [];
    if (checkedElectric) {
	     publicUtilities.push('electric');
    }

    if (checkedGas) {
        publicUtilities.push('gas');
    }

    if (checkedSteam) {
        publicUtilities.push('steam');
    }

    if (checkedLiquidFuel) {
        publicUtilities.push('liquid_fuel');
    }

    if(!squareFootage || (Math.floor(squareFootage) !== Number(squareFootage) || squareFootage < 0)) {
        return setErrorMessage('Please enter Square Footage as a whole number.');
    }

    if(tHeating && (Math.floor(tHeating) !== Number(tHeating) || tHeating < 0)) {
        return setErrorMessage('Please enter the regular thermostate setting for heating as a whole number.');
    }

    if(tCooling && (Math.floor(tCooling) !== Number(tCooling) || tCooling < 0)) {
        return setErrorMessage('Please enter the regular thermostate setting for cooling as a whole number.');
    }

    if(!checkedNoHeat && tHeating == 0) {
      return setErrorMessage('Please provide a regular thermostat setting for heating or choose no heat.')
    }

    if(!checkedNoCooling && tCooling == 0) {
      return setErrorMessage('Please provide a regular thermostat setting for cooling or choose no cooling.')
    }

    const data = {
      email: email,
      square_footage: squareFootage,
      household_type: homeType,
      thermostat_setting_heating: checkedNoHeat ? 0 : tHeating,
      thermostat_setting_cooling: checkedNoCooling ? 0 : tCooling,
      fk_postal_code: postalCode,
      public_utilities: publicUtilities
    };

    axios.post(`http://localhost:8888/api/householdInfo`, data)
    .then(response => {
      navigate(`/addAppliance?email=${email}`);
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err.response.data.message || 'Internal Server Error Occurred');
    });
  };

  return (
    <>
      <h1>Enter Household Info</h1>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <h3>Household Details:</h3>
      <p>Please enter your email address:</p><input value={email} onChange={(event) => setEmail(event.target.value)}/>
      <p>Please enter your five digit postal code:</p><input value={postalCode} onChange={(event) => setPostalCode(event.target.value)}/>
      <br></br>
      <br></br>
      <label>
        Home Type:
        <select value={homeType} onChange={(event) => handleChangeHomeType(event.target.value)}>
        {householdTypes.map(type => {
          return <option key={type} value={type}>{type.replace("_", " ")}</option>;
        })}
        </select>
      </label>
      <br></br>
      <br></br>
      <label>Square footage:<input type="number" min="0" step="1" value={squareFootage} onChange={(event) => setSquareFootage(event.target.value)}/></label>
      <br></br>
      <br></br>
      <h3>Regular Thermostat Setting for:</h3>
      <label>Heating (F):&nbsp;<input type="number" min="0" step="1" value={tHeating} onChange={(event) => setHeating(event.target.value)} disabled={checkedNoHeat}/></label>&nbsp;<Checkbox label=" No heat" value={checkedNoHeat} onChange={handleChangeNoHeat}/>
      <br></br>
      <br></br>
      <label>Cooling (F):&nbsp;<input type="number" min="0" step="1" value={tCooling} onChange={(event) => setCooling(event.target.value)} disabled={checkedNoCooling}/></label>&nbsp;<Checkbox label=" No cooling" value={checkedNoCooling} onChange={handleChangeNoCooling}/>
      <br></br>
      <br></br>
      <h3>Public Utilities:</h3>
      <Checkbox label=" Electric" value={checkedElectric} onChange={handleChangeElectric}/>&nbsp;
      <Checkbox label=" Gas" value={checkedGas} onChange={handleChangeGas}/>&nbsp;
      <Checkbox label=" Steam" value={checkedSteam} onChange={handleChangeSteam}/>&nbsp;
      <Checkbox label=" Liquid fuel" value={checkedLiquidFuel} onChange={handleChangeLiquidFuel}/>
      <br></br>
      <br></br>
      <button onClick={next}>Next</button>
    </>
  );
}
