import React, { Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import axios from 'axios';
import Alert from '@mui/material/Alert';

function GetQueryParams() {
  const queryParams = new URLSearchParams(window.location.search)
  return {
    fk_email: queryParams.get("email"),
    order_no: parseInt(queryParams.get("order_no")) + 1
  }
}

class AddAppliance extends Component {
  constructor(props) {
    super(props);
    const { fk_email, order_no } = GetQueryParams()
    this.state = {
    	errorMessage: "",
    	manufacturerList: [],
    	// Appliance Data
    	email: fk_email,
    	order_no: order_no || 1,
    	btu_rating: "",
    	model: "",
    	manufacturer: "Amana Banana",
    	applianceType: "air_handler",
    	// Air Handler Data
    	rpm: "",
    	checkedAirConditioner: false,
      checkedHeater: false,
      checkedHeatPump: false,
    	// Air Conditioner Data
    	eer: "",
    	// Heater Data
    	h_energy_source: "electric",
    	// Heat Pump Data
    	seer: "",
    	hspf: "",
    	// Water Heater Data
    	tank_size: "",
    	temperature: "",
    	wh_energy_source: "electric",
    };
  }

  ShowError(errorMessage) {
    return errorMessage !== '' && (
      <>
      <h1>{errorMessage}</h1>
      </>
    );
  }

  handleChangeApplianceType(newApplianceType) {
    this.state.applianceType = newApplianceType;
    this.setState(this.state);
  };

  setEmail(newEmail) {
    this.state.email = newEmail;
    this.setState(this.state);
  }

  setOrderNo(newOrderNo) {
    this.state.order_no = newOrderNo;
    this.setState(this.state);
  }

  setBtuRating(newBTU) {
    this.state.btu_rating = newBTU;
    this.setState(this.state);
  }

  setModel(newModel){
    this.state.model = newModel;
    this.setState(this.state);
  }

  setManufacturer(newManufacturer){
    this.state.manufacturer = newManufacturer;
    this.setState(this.state);
  }

  setApplianceType(newApplianceType){
    this.state.applianceType = newApplianceType;
    this.setState(this.state);
  }

  setRPM(newRPM){
    this.state.rpm = newRPM;
    this.setState(this.state);
  }

  setEER(newEER){
    this.state.eer = newEER;
    this.setState(this.state);
  }

  setHeaterEnergySource(newHeaterEnergySource){
    this.state.h_energy_source = newHeaterEnergySource;
    this.setState(this.state);
  }

  setSEER(newSEER){
    this.state.seer = newSEER;
    this.setState(this.state);
  }

  setHSPF(newHSPF){
    this.state.hspf = newHSPF;
    this.setState(this.state);
  }

  setTankSize(newTankSize){
    this.state.tank_size = newTankSize;
    this.setState(this.state);
  }

  setTemperature(newTemperature){
    this.state.temperature = newTemperature;
    this.setState(this.state);
  }

  setWaterHeaterEnergySource(newWaterHeaterEnergySource){
    this.state.wh_energy_source = newWaterHeaterEnergySource;
    this.setState(this.state);
  }

  setCheckedAirConditioner(newValue) {
    this.state.checkedAirConditioner = newValue;
    this.setState(this.state);
  }

  setCheckedHeater(newValue) {
    this.state.checkedHeater = newValue;
    this.setState(this.state);
  }

  setCheckedHeatPump(newValue) {
    this.state.checkedHeatPump = newValue;
    this.setState(this.state);
  }

  ShowAirHandler() {
    let { rpm , airHandlerType } = this.state;
    return (
      <>
        <label>Fan RPM: <input type="number" min="0" value={this.rpm} onChange={(event) => this.setRPM(event.target.value)}/></label>
        <br></br>
        <br></br>
        <label>
          Air Handler Type:&nbsp;
          <Checkbox label=" Air Conditioner" value={this.state.checkedAirConditioner} onChange={(event) => this.setCheckedAirConditioner(!this.state.checkedAirConditioner)}/>&nbsp;
          <Checkbox label=" Heater" value={this.state.checkedHeater} onChange={(event) => this.setCheckedHeater(!this.state.checkedHeater)}/>&nbsp;
          <Checkbox label=" Heat Pump" value={this.state.checkedHeatPump} onChange={(event) => this.setCheckedHeatPump(!this.state.checkedHeatPump)}/>&nbsp;
        </label>
        <br></br>
        <br></br>
        <div>
        {this.state.checkedAirConditioner && this.ShowAirConditioner()}
        </div>
        <div>
        {this.state.checkedHeater && this.ShowHeater()}
        </div>
        <div>
        {this.state.checkedHeatPump && this.ShowHeatPump()}
        </div>
      </>
    );
  }

  ShowAirConditioner() {
    let { eer } = this.state;
    return (
      <>
        <h4>Air Conditioner:</h4>
        <label>Energy Efficiency Ratio (EER): <input type="number" min="0.0" step="0.1" presicion={1} value={this.eer} onChange={(event) => this.setEER(event.target.value)}/></label>
      </>
    );
  }

  ShowHeater() {
    let { h_energy_source } = this.state;
    return (
      <>
        <h4>Heater:</h4>
        <label value={h_energy_source} onChange={(event) => this.setHeaterEnergySource(event.target.value)}>Energy Source:&nbsp;
          <label><input type="radio" name="heaterEnergySource" value="electric" id="regular" defaultChecked /> Electric </label>&nbsp;
          <label><input type="radio" name="heaterEnergySource" value="gas" id="regular" /> Gas </label>&nbsp;
          <label><input type="radio" name="heaterEnergySource" value="thermosolar" id="regular" /> Thermosolar </label>
        </label>
      </>
    );
  }

  ShowHeatPump() {
    let { seer, hspf } = this.state;
    return (
      <>
        <h4>Heat Pump:</h4>
        <label>Seasonal Energy Efficiency Rating (SEER): <input type="number" min="0.0" step="0.1" value={seer} onChange={(event) => this.setSEER(event.target.value)}/></label>
        <br></br>
        <br></br>
        <label>Heating Seasonal Performance Factor (HSPF): <input type="number" min="0.0" step="0.1" value={hspf} onChange={(event) => this.setHSPF(event.target.value)}/></label>
      </>
    );
  }

  ShowWaterHeater() {
    let { tank_size, temperature } = this.state;
    return (
      <>
        <label>Tank Size (gallons): <input type="number" min="0.0" step="0.1" value={tank_size} onChange={(event) => this.setTankSize(event.target.value)}/></label>
        <br></br>
        <br></br>
        <label>(Optional) Current Temperature Setting: <input type="number" min="0" step="1" value={temperature} onChange={(event) => this.setTemperature(event.target.value)}/></label>
        <br></br>
        <br></br>
        <label onChange={(event) => this.setWaterHeaterEnergySource(event.target.value)}>Energy Source:&nbsp;
          <label><input type="radio" name="waterHeaterEnergySource" value="electric" id="regular" defaultChecked /> Electric </label>&nbsp;
          <label><input type="radio" name="waterHeaterEnergySource" value="gas" id="regular" /> Gas </label>&nbsp;
          <label><input type="radio" name="waterHeaterEnergySource" value="fuel_oil" id="regular" /> Fuel Oil </label>&nbsp;
          <label><input type="radio" name="waterHeaterEnergySource" value="heat_pump" id="regular" /> Heat Pump </label>&nbsp;
        </label>
      </>
    );
  }

  validateInputs() {
    if(this.state.btu_rating && Math.floor(this.state.btu_rating) !== Number(this.state.btu_rating) || this.state.btu_rating <= 0) {
        this.state.errorMessage = 'Please enter BTU rating as a whole number.';
        this.setState(this.state);
        return false;
    }

    if (this.state.applianceType === 'water_heater') {
      if(!this.state.tank_size || Math.floor(this.state.tank_size * 10) / 10 !== Number(this.state.tank_size) || this.state.tank_size < 0) {
          this.state.errorMessage = 'Please enter Tank size (gallons) as a decimal to the tenth decial point.';
          this.setState(this.state);
          return false;
      }

      if(this.state.temperature && (Math.floor(this.state.temperature) !== Number(this.state.temperature) || this.state.temperature < 0)) {
          this.state.errorMessage = 'Please enter Current Tank Temperature as a whole number.';
          this.setState(this.state);
          return false;
      }
    } else {
      if (!this.state.rpm) {
        this.state.errorMessage = 'Please enter fan rotations per minute (RPM) as a whole number.';
        this.setState(this.state);
        return false;
      }

      if(Math.floor(this.state.rpm) !== Number(this.state.rpm) || this.state.rpm < 0) {
          this.state.errorMessage = 'Please enter fan rotations per minute (RPM) as a whole number.';
          this.setState(this.state);
          return false;
      }

      if (!(this.state.checkedAirConditioner || this.state.checkedHeatPump || this.state.checkedHeater)) {
        this.state.errorMessage = 'Please select at least one heating or cooling method.';
        this.setState(this.state);
        return false;
      }

      if (this.state.checkedAirConditioner) {
          if(!this.state.eer) {
              this.state.errorMessage = 'Please enter Energy Efficiency Ratio (EER) as a decimal to the tenth decial point.';
              this.setState(this.state);
              return false;
          }

          if(Math.floor(this.state.eer * 10) / 10 !== Number(this.state.eer) || this.state.eer < 0) {
              this.state.errorMessage = 'Please enter Energy Efficiency Ratio (EER) as a decimal to the tenth decial point.';
              this.setState(this.state);
              return false;
          }
      }

      if (this.state.checkedHeatPump) {
        if(!this.state.seer || Math.floor(this.state.seer * 10) / 10 !== Number(this.state.seer) || this.state.seer < 0) {
            this.state.errorMessage = 'Please enter Seasonal Energy Efficiency Ratio (SEER) as a decimal to the tenth decial point.';
            this.setState(this.state);
            return false;
        }

        if(!this.state.hspf || Math.floor(this.state.hspf * 10) / 10 !== Number(this.state.hspf) || this.state.hspf < 0) {
            this.state.errorMessage = 'Please enter Heating Seasonal Performance Factor (HSPF) as a decimal to the tenth decial point.';
            this.setState(this.state);
            return false;
        }
      }
    }

    return true;
  }

  render() {
    let { applianceType } = this.state;

    const next = async () => {
      this.state.errorMessage = '';
      this.setState(this.state);

      if (this.validateInputs()) {
        try {
          const applianceJson = await axios.post(`http://localhost:8888/api/appliance`, {
            fk_email: this.state.email,
            order_no: this.state.order_no,
            appliance_type: this.state.applianceType,
            btu_rating: this.state.btu_rating,
            model: this.state.model,
            manufacturer: this.state.manufacturer,
          })

          if (this.state.applianceType === 'water_heater') {
            try {
              await axios.post("http://localhost:8888/api/waterHeater", {
                tank_size: this.state.tank_size,
                temperature: this.state.temperature || 0,
                wh_energy_source: this.state.wh_energy_source,
                appliance_id: applianceJson.data.appliance_id
              })
            } catch (err) {
              console.log(err);
              this.state.errorMessage = err?.response?.data?.message || 'Internal Server Error';
              this.setState(this.state);
            }
          } else {
            if (this.state.checkedAirConditioner) {
                try {
                  await axios.post("http://localhost:8888/api/airConditioner", {
                    rpm: this.state.rpm,
                    eer: this.state.eer,
                    appliance_id: applianceJson.data.appliance_id
                  })
                } catch (err) {
                  console.log(err);
                  this.state.errorMessage = err?.response?.data?.message || 'Failed to add air conditioner data';
                  this.setState(this.state);
                }
            }

            if (this.state.checkedHeater) {
              try {
                await axios.post("http://localhost:8888/api/heater", {
                  rpm: this.state.rpm,
                  h_energy_source: this.state.h_energy_source,
                  appliance_id: applianceJson.data.appliance_id
                })
              } catch (err) {
                console.log(err);
                this.state.errorMessage = err?.response?.data?.message || 'Failed to add heater data';
                this.setState(this.state);
              }
            }

            if (this.state.checkedHeatPump) {
              try {
                await axios.post("http://localhost:8888/api/heatPump", {
                  rpm: this.state.rpm,
                  seer: this.state.seer,
                  hspf: this.state.hspf,
                  appliance_id: applianceJson.data.appliance_id
                })
              } catch (err) {
                console.log(err);
                this.state.errorMessage = err?.response?.data?.message || 'Failed to add heat pump data';
                this.setState(this.state);
              }
            }
          }

          window.location.href = `/viewAppliances?email=${this.state.email}&order_no=${this.state.order_no}`;
        } catch (err) {
          console.log(err.message);
          this.state.errorMessage = err?.response?.data?.message || 'Failed to add appliance';
          this.setState(this.state);
        }
      }
    };

    if (this.state.manufacturerList.length === 0) {
      axios.get(`http://localhost:8888/api/add_appliance_populate_dropdowns`)
        .then(response => {
          this.state.manufacturerList = response.data.manufacturerList.map(type => type[0]);
          this.state.manufacturer = this.state.manufacturerList[0];

          // Update UI
          this.setState(this.state);
          console.log(this.state);
        })
        .catch(err => {
          console.log(err);
          // setErrorMessage(err?.message);
        })
    }

    return (
      <>
        <h1>Add Appliance</h1>
        {this.state.errorMessage && <Alert severity="error">{this.state.errorMessage}</Alert>}
        <p>Please provide the details for the appliance:</p>
        <label>
          Manufacturer Name:
          <select onChange={(event) => this.setManufacturer(event.target.value)}>
            {this.state.manufacturerList.map(type => {
              return <option value={type}>{type}</option>;
            })}
          </select>
        </label>
        <br></br>
        <br></br>
        <label>(Optional) Model: <input value={this.model} onChange={(event) => this.setModel(event.target.value)}/></label>
        <br></br>
        <br></br>
        <label>BTU Rating: <input type="number" min="0" value={this.btu_rating} onChange={(event) => this.setBtuRating(event.target.value)}/></label>
        <br></br>
        <br></br>
        <label>
          Appliance Type:&nbsp;
          <select value={this.applianceType} onChange={(event) => this.handleChangeApplianceType(event.target.value)}>
            <option value={'air_handler'}>Air Handler</option>
            <option value={'water_heater'}>Water Heater</option>
          </select>
        </label>
        <br></br>
        <br></br>
        <div className="container">
        {applianceType === 'air_handler' && this.ShowAirHandler()}
        </div>
        <div>
        {applianceType === 'water_heater' && this.ShowWaterHeater()}
        </div>
        <br></br>
        <br></br>
        <button onClick={next}>Next</button>
      </>
    );
  }
}

export default AddAppliance;
