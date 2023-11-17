import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BootStrapTable from "react-bootstrap-table-next";
import fakeData from "../MOCK_DATA.json";
import { Modal, Button } from "react-bootstrap";

//importing css
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function WaterHeaterStatisticsByState() {
  //********** UNCOMMENT FOR API CALL ********
  const [tableData, setTableData] = useState([]);
  //create modal controll variable for drilldown menus
  const [modalTitle, setModalTitle] = useState([]);
  const [modalTableData, setModalTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getTableData = async (apiEndpoint) => {
    try {
      const data = await axios.get(apiEndpoint);
      if (
        apiEndpoint === "http://localhost:8888/api/water_heater_stats"
      ) {
        const waterstat = data?.data?.map((row) => {
          return {
            State: row[0],
            AverageTankSize: row[1],
            AverageBTUs: row[2],
            AverageTemperatureSetting: row[3],
            TemperatureSettingCount: row[4],
            NoTemperatureSettingCount: row[5],
          };
        });
        setTableData(waterstat);
      } else {
        const drillDwn = data?.data?.map((row) => {
          return {
            State: row[0],
            wh_energy_source: row[1],
            min_wh_tank_size: row[2],
            avg_wh_tank_size: row[3],
            max_wh_tank_size: row[4],
            min_tempeature: row[5],
            avg_wh_temp_setting: row[6],
            max_temp_setting: row[7],
          };
        });
        setModalTableData(drillDwn);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const dynamicEndpoint =
      "http://localhost:8888/api/water_heater_stats";
    getTableData(dynamicEndpoint);
  }, []);

  //Define specific table columns from JSON response
  //"Manufacturer" and "cnt" for datafields with api calls
  const columns = [
    { dataField: "State", text: "State" },
    { dataField: "AverageTankSize", text: "AverageTankSize" },
    { dataField: "AverageBTUs", text: "AverageBTUs" },
    { dataField: "AverageTemperatureSetting", text: "AverageTemperatureSetting" },
    { dataField: "TemperatureSettingCount", text: "TemperatureSettingCount" },
    { dataField: "NoTemperatureSettingCount", text: "NoTemperatureSettingCount" },
  ];
  const modalColumns = [
    { dataField: "State", text: "State" },
    { dataField: "wh_energy_source", text: "wh_energy_source" },
    { dataField: "min_wh_tank_size", text: "min_wh_tank_size" },
    { dataField: "avg_wh_tank_size", text: "avg_wh_tank_size" },
    { dataField: "max_wh_tank_size", text: "max_wh_tank_size" },
    { dataField: "min_tempeature", text: "min_tempeature" },
    { dataField: "avg_wh_temp_setting", text: "avg_wh_temp_setting" },
    { dataField: "max_temp_setting", text: "max_temp_setting" },
  ];

  //create variable responsible for grabbing row data for modal
  const rowEvents = {
    onClick: (e, row) => {
      console.log("ROW DATA: ", row.State); //, row.wh_energy_source,row.min_wh_tank_size,row.avg_wh_tank_size,row.max_wh_tank_size,row.min_tempeature,row.avg_wh_temp_setting,row.max_temp_setting);

      //api call for modal info
      getTableData(
        `http://localhost:8888/api/water_heater_stats_drilldown/${row.State}`
      );
      setModalTitle(row);
      toggleTrueFalse();
    },
  };

  console.log(modalTableData);
  console.log(modalColumns);

  //function that is responsible for toggling b/w T&F
  const toggleTrueFalse = () => {
    setShowModal(handleShow);
  };

  //create modal component with data
  const ModalCotent = () => {
    return (
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>
              <h2>{modalTitle.State} Drill Down</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BootStrapTable
              keyField="State"
              data={modalTableData}
              columns={modalColumns}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close Drill Down
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Link to="/reports">View reports/query data</Link>
      <h1>Water Heater Statistics by State</h1>
      <BootStrapTable
        keyField="State"
        data={tableData}
        columns={columns}
        rowEvents={rowEvents}
      />

      {show ? <ModalCotent /> : null}
    </>
  );
}
