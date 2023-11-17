import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ViewAppliances() {
  const queryParams = new URLSearchParams(window.location.search)
  const email = queryParams.get("email");
  const order_no = queryParams.get("order_no");

  const navigate = useNavigate();
  const next = () => {
    navigate(`/addPowerGeneration?email=${email}`);
  };

  const [appliances, setAppliances] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [refresh, setRefresh] = React.useState(true);
  if (refresh) {
    axios.get(`http://localhost:8888/api/appliances/${email}`)
    .then(response => {
      const appliances = response?.data?.appliances.map((row) => {
          return {
            id: row[0],
            orderNo: row[1],
            type: row[2],
            manufacturer: row[3],
            model: row[4],
          }
      });
      setAppliances(appliances);
      setRefresh(false)
    })
    .catch(err => {
      console.log(err);
      setErrorMessage(err?.message);
    })
  }

  const deleteAppliance = (id) => {
    axios.delete(`http://localhost:8888/api/appliance/${id}`)
    .then(response => {
      console.log(response);
      setRefresh(true)
    })
    .catch(err => {
      console.log(err);
      // setErrorMessage(err?.message);
    })
  }

  const friendlyApplianceName = (name) => {
    if (name == 'air_handler') {
      return 'Air Handler'
    } else {
      return 'Water Heater'
    }
  }

  return (
    <>
      <h1>Appliances</h1>
      <p>You have added the following appliances to your houshold:</p>
      <table style={{margin: 'auto'}}>
          <thead>
              <tr>
                  <th>Appliance #</th>
                  <th>Type</th>
                  <th>Manufacturer</th>
                  <th>Model</th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
          {appliances.map(({ id, orderNo, type, manufacturer, model}) => {
              return <tr key={id} >
                <td style={{ padding: '10px', border: '1px solid black' }}>{orderNo}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{friendlyApplianceName(type)}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{manufacturer}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{model}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}><button onClick={() => {deleteAppliance(id)}}>Delete</button></td>
              </tr>
            })}
          </tbody>
      </table>
      <Link to={`../addAppliance?email=${email}`}>+ Add another appliance</Link>
      <br></br>
      <br></br>
      <button onClick={next}>Next</button>
    </>
  );
}
