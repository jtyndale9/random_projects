import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';

export default function ViewPowerGeneration() {
  const queryParams = new URLSearchParams(window.location.search)
  const email = queryParams.get("email");

  const [errorMessage, setErrorMessage] = React.useState("");
  const [powerGenerations, setPowerGenerations] = React.useState([]);

  const navigate = useNavigate();
  const finish = () => {
    axios.get(`http://localhost:8888/api/off_the_grid/${email}`)
    .then(json => {
      console.log(json);
      if (json.data.isOffTheGrid && powerGenerations.length === 0) {
          setErrorMessage('Off-the-grid houses must have at least one power generation method.');
      } else {
          navigate('/submissionComplete');
      }
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err.message);
    });
  };

  const [refresh, setRefresh] = React.useState(true);
  const deletePowerGen = (email, orderNo) => {
    axios.delete(`http://localhost:8888/api/power_generation/${email}/${orderNo}`)
    .then(response => {
      console.log(response);
      setRefresh(true);
    })
    .catch(err => {
      console.log(err);
    });
  };

  if (refresh) {
    axios.get(`http://localhost:8888/api/power_generation/${email}`)
    .then(response => {
      setRefresh(false);
      setPowerGenerations(response?.data?.powerGenerations.map(p => {
        return { orderNo: p[0], type: p[1], monthlyKWH: p[2], batteryKWH: p[3] };
      }));
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err?.message);
    })
  }


  return (
    <>
      <h1>Power Generation</h1>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {powerGenerations.length == 0 && <p>No power generation methods have been added</p>}
      {powerGenerations.length > 0 &&
      <p>You have added these to your household:</p> &&
        <table style={{margin: 'auto'}}>
          <thead>
              <tr>
                  <th>Num</th>
                  <th>Type</th>
                  <th>Monthly kWh</th>
                  <th>Battery kWh</th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
              {powerGenerations.map(({ orderNo, type, monthlyKWH, batteryKWH }) => {
                  return <tr key={orderNo}>
                    <td style={{ padding: '10px', border: '1px solid black' }}>{orderNo}</td>
                    <td style={{ padding: '10px', border: '1px solid black' }}>{type}</td>
                    <td style={{ padding: '10px', border: '1px solid black' }}>{monthlyKWH}</td>
                    <td style={{ padding: '10px', border: '1px solid black' }}>{batteryKWH}</td>
                    <td style={{ padding: '10px', border: '1px solid black' }}><button onClick={() => {deletePowerGen(email, orderNo)}}>Delete</button></td>
                  </tr>
                })}
          </tbody>
      </table>}
      <Link to={`../addPowerGeneration?email=${email}`}>+ Add a power generation method</Link>
      <br></br>
      <br></br>
      <button onClick={() => {finish()}}>Finish</button>
    </>
  );
}
