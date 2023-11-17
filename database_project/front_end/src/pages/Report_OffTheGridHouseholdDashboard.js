import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RenderHouseholds(house_perc) {
  return house_perc.map((
    {
	home_type,
	percent,
    }) => {
	return <tr>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{home_type}</td>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{percent}%</td>
	       </tr>
    })
}

function RenderBtus(btu_data) {
  return btu_data.map((
    {
	appliance_type,
	min_btu,
	avg_btu,
	max_btu,
    }) => {
	return <tr>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{appliance_type}</td>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{min_btu}</td>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{avg_btu}</td>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{max_btu}</td>
	       </tr>
    })
}

function RenderTanks(tank_avgs) {
  return tank_avgs.map((
    {
	off_grid_sz,
	on_grid_sz,
    }) => {
	return <tr>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{off_grid_sz}</td>
		   <td style={{ padding: '10px', border: '1px solid black' }}>{on_grid_sz}</td>
	       </tr>
    })
}

export default function OffTheGridHouseholdDashboard() {
    // TODO: Enter code here
    const [errorMessage, setErrorMessage] = React.useState('');
    const [refresh, setRefresh] = React.useState(true);
    //Query #1
    const [top_state, setTopState] = React.useState('');
    //Query #2
    const [state_cnt, setStateCnt] = React.useState('');
    const [avg_batt, setAvgBatt] = React.useState('');
    //Query #3
    const [pwrgen_solar, setPwrgenSolar] = React.useState('');
    const [pwrgen_wind, setPwrgenWind] = React.useState('');
    const [pwrgen_mix, setPwrgenMix] = React.useState('');
    //Query #4
    const [house_perc, setHousePerc] = React.useState([]);
    // Query #5
    const [tank_avgs, setTankAvgs] = React.useState([]);
    //Query #6
    const [btu_data, setBtuData] = React.useState([]);

    //const offGridState = () => {
    if (refresh){
	//	setErrorMessage('');
	
	axios.get(`http://localhost:8888/api/off_the_grid_dashboard`)
	    .then(response => {
		console.log(response.data);
		//Query #1
		setTopState(response.data[0][0][0]);
		setStateCnt(response.data[0][0][1]);
		//Query #2
		setAvgBatt(response.data[1][0][0]);
		//Query #3
		const pSolar = response.data[2][0][1];
		const pWind = response.data[2][1][1]
		setPwrgenSolar(pSolar);
		setPwrgenWind(pWind);
		setPwrgenMix(Math.round((100 - pSolar - pWind) * 10) / 10);
		//Query #4
		const dHouse = response.data[3].map((row) => {
		    return {
			home_type: row[0],
			percent: row[1],
		    }
		});
		console.log(dHouse)
		setHousePerc(dHouse);
		//Query #5
		const dTank = response.data[4].map((row) => {
		    return {
			off_grid_sz: row[0],
			on_grid_sz: row[1],
		    }
		});
		console.log(dTank);
		setTankAvgs(dTank);
		//Query #6
		const dBtu = response.data[5].map((row) => {
		    return {
			appliance_type: row[0],
			min_btu: row[1],
			avg_btu: row[2],
			max_btu: row[3],
		    }
		});
		console.log(dBtu)
		setBtuData(dBtu);
	    })
	    .catch(err => {
		console.log(err);
		setErrorMessage(err?.response?.data || 'Internal Server Error Occured');
	    })
	setRefresh(false);
    };

    return (
    <>
	<Link to="/reports">View reports/query data</Link>
	<br></br>
	<h1>Off-the-grid Household Dashboard</h1>
	<h4>State with the Most amount of Off-Grid Households: <span>{top_state}</span></h4>
	<h4>Number of Off-Grid Households in <span>{top_state}</span>: <span>{state_cnt}</span></h4>
	<br></br>
	<h4>Average Battery Capacity per Battery of Off-Grid Households: <span>{avg_batt}</span> kWh</h4>
	<br></br>
	<h4>Off the Grid Houshold Power Generation Distribution Breakdown</h4>
	<table style={{margin: 'auto', padding: '15px' }}>
	    <thead>
		<tr>
                    <th>Solar</th>
                    <th>Wind Turbine</th>
                    <th>Mixed (Solar and Wind Turbine)</th>
		</tr>
	    </thead>
	    <tbody>
		<tr>
                    <td>{pwrgen_solar}%</td>
                    <td>{pwrgen_wind}%</td>
                    <td>{pwrgen_mix}%</td>
		</tr>
	    </tbody>
	</table>
	<br></br>
	<h4>Off the Grid Houshold Household Types breakdown</h4>
	<table style={{margin: 'auto', padding: '15px' }}>
	    <thead>
		<tr>
                    <th>Home Type</th>
                    <th>Percent</th>
		</tr>
	    </thead>
	    <tbody>
		{RenderHouseholds(house_perc)}
	    </tbody>
	</table>
	<br></br>
	<h4>Water Tank Size Averages</h4>
	<table style={{margin: 'auto', padding: '15px' }}>
	    <thead>
		<tr>
                    <th>Average Tank Size (Off-Grid)</th>
                    <th>Average Tank Size (On-Grid)</th>
		</tr>
	    </thead>
	    <tbody>
		{RenderTanks(tank_avgs)}
	    </tbody>
	</table>
	<br></br>
	<h4>Appliance BTU Data</h4>
	<table style={{margin: 'auto', padding: '15px' }}>
	    <thead>
		<tr>
                    <th>Appliance Type</th>
                    <th>Min BTU</th>
		    <th>Avg BTU</th>
		    <th>Max BTU</th>
		</tr>
	    </thead>
	    <tbody>
		{RenderBtus(btu_data)}
	    </tbody>
	</table>
    </>
    );
}
