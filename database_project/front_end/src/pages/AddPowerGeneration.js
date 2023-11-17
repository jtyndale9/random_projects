import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';

export default function AddPowerGeneration() {
  const queryParams = new URLSearchParams(window.location.search)
  const fk_email = queryParams.get("email");

  const [powerGenerationType, setPowerGenerationType] = React.useState("solar")

  const [errorMessage, setErrorMessage] = React.useState("");

  // Power generation Data
  const [battery_storage_capacity, setBatteryStorageCapacity] = React.useState("");
  const [avg_month_kwh, setAvgMonthKWH] = React.useState("");

  const navigate = useNavigate();
  const next = () => {
    setErrorMessage('');

    if(!avg_month_kwh || (Math.floor(avg_month_kwh) !== Number(avg_month_kwh) || avg_month_kwh < 0)) {
        return setErrorMessage('Please enter Average Generated Monthly Kilowatt Hours as a whole number.');
    }

    if(battery_storage_capacity && (Math.floor(battery_storage_capacity) !== Number(battery_storage_capacity) || battery_storage_capacity < 0)) {
        return setErrorMessage('Please enter Battery Storage Capacity in kilowatt hours as a whole number.');
    }

    const data = {
      fk_email: fk_email,
      battery_storage_capacity: battery_storage_capacity || 0,
      avg_month_kwh: avg_month_kwh,
      generation_type: powerGenerationType
    }
    
    axios.post(`http://localhost:8888/api/power_generation`, data)
    .then(json => {
      console.log(json);
      navigate(`/viewPowerGeneration?email=${fk_email}`);
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err.message);
    });
  };

  const [isOffTheGrid, setIsOffTheGrid] = React.useState(false)
  const [refresh, setRefresh] = React.useState(true)
  if (refresh) {
    axios.get(`http://localhost:8888/api/off_the_grid/${fk_email}`)
    .then(json => {
      console.log(json);
      setIsOffTheGrid(json.data.isOffTheGrid)
      setRefresh(false);
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err.message);
    });
  }

  const skip = () => {
    navigate(`/viewPowerGeneration?email=${fk_email}`);
  };


  return (
    <>
      <h1>Add Power Generation</h1>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <p>Please provide power generation details:</p>
      <label>
        Type:
        <select value={powerGenerationType} onChange={(event) => setPowerGenerationType(event.target.value)}>
          <option value="solar">Solar</option>
          <option value="wind-turbine">Wind Turbine</option>
        </select>
      </label>
      <br></br>
      <br></br>
      <label>Average Monthly Generation (kWh): <input type="number" min="0" step="1" value={avg_month_kwh} onChange={(event) => setAvgMonthKWH(event.target.value)}/></label>
      <br></br>
      <br></br>
      <label>(Optional) Battery Storage (kWh): <input type="number" min="0" step="1" value={battery_storage_capacity} onChange={(event) => setBatteryStorageCapacity(event.target.value)}/></label>
      <br></br>
      <br></br>
      {!isOffTheGrid && <button onClick={(event) => {skip()}}>Skip</button>}&nbsp;&nbsp;
      <button onClick={next}>Next</button>
    </>
  );
}
