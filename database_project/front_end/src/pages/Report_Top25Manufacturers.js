import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BootStrapTable from "react-bootstrap-table-next";
import fakeData from "../MOCK_DATA.json";
import { Modal, Button } from "react-bootstrap";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import InfoIcon from '@mui/icons-material/Info';

//importing css
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Top25Manufacturers() {
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
        apiEndpoint === "http://localhost:8888/api/top_25_pop_manufacturers"
      ) {
        const top25 = data?.data?.map((row) => {
          return {
            Manufacturer: row[0],
            cnt: row[1],
          };
        });
        setTableData(top25);
      } else {
        const drillDwn = data?.data?.map((row) => {
          return {
            appliance_type: row[0]?.replace("_", " "),
            qty: row[1],
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
      "http://localhost:8888/api/top_25_pop_manufacturers";
    getTableData(dynamicEndpoint);
  }, []);

  const manufacturerFormatter = (cell, row) => {
    return <span style={{ "display": "inline-flex" }}><p style={{ "padding-top": "15px" }}>{row?.Manufacturer}</p> <IconButton
    onClick={ () => {
      console.log("ROW DATA: ", row.Manufacturer, row.cnt);

      //api call for modal info
      getTableData(
        `http://localhost:8888/api/top_25_pop_manufacturers_drilldown/${row.Manufacturer}`
      );
      setModalTitle(row);
      toggleTrueFalse();
    }}> <InfoIcon />
    </IconButton>
    </span>;
  };

  const countFormatter = (cell, row) => {
    return <span style={{ "display": "inline-flex" }}><p style={{ "padding-top": "15px" }}>{row?.cnt}</p>
    </span>;
  };

  //Define specific table columns from JSON response
  //"Manufacturer" and "cnt" for datafields with api calls
  const columns = [
    { dataField: "Manufacturer", text: "Manufacturer", formatter: manufacturerFormatter },
    { dataField: "cnt", text: "Raw Count of Appliances", formatter: countFormatter },
  ];
  const modalColumns = [
    { dataField: "appliance_type", text: "Appliance" },
    { dataField: "qty", text: "Quantity" },
  ];

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
              <h2>{modalTitle.Manufacturer}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <BootStrapTable
              keyField="appliance_type"
              data={modalTableData}
              columns={modalColumns}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <MuiThemeProvider>
      <Link to="/reports">View reports/query data</Link>
      <h1>Top 25 Manufacturers</h1>
      <BootStrapTable
        keyField="Manufacturer"
        data={tableData}
        columns={columns}
      />

      {show ? <ModalCotent /> : null}
    </MuiThemeProvider>
  );
}
