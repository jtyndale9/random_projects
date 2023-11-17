import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BootStrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HeatingCoolingMethodDetails() {
  // TODO: Enter code here
  const apiEndpoint = "http://localhost:8888/api/heating_cooling_report";
  const [acTableData, setAcTableData] = useState([]);
  const airConditionerColumns = [
    { dataField: "household_type", text: "Household Type" },
    { dataField: "ac_cnt", text: "Count" },
    { dataField: "avg_ac_btu", text: "Avg BTU" },
    { dataField: "avg_ac_rpm", text: "Avg RPM" },
    { dataField: "avg_ac_eer", text: "Avg EER" },
  ];

  const [hTableData, setHTableData] = useState([]);
  const heaterColumns = [
    { dataField: "household_type", text: "Household Type" },
    { dataField: "htr_cnt", text: "Count" },
    { dataField: "avg_htr_btu", text: "Avg BTU" },
    { dataField: "avg_htr_rpm", text: "Avg RPM" },
    { dataField: "htr_common_enrgy_src", text: "Most Common Energy Source" },
  ];

  const [hpTableData, setHpTableData] = useState([]);
  const heatPumpColumns = [
    { dataField: "household_type", text: "Household Type" },
    { dataField: "hp_cnt", text: "Count" },
    { dataField: "avg_hp_btu", text: "Avg BTU" },
    { dataField: "avg_hp_rpm", text: "Avg RPM" },
    { dataField: "avg_hp_seer", text: "Avg Seer" },
    { dataField: "avg_hp_hspf", text: "Avg HSPF" },
  ];

  // unction reqruied so data isnt being reset into useState infinitelty
  const getTableData = async (apiEndpoint) => {
    try {
      const data = await axios.get(apiEndpoint);
      const acData = data?.data?.map((row) => {
        console.log(typeof row[2]);
        return {
          household_type: row[0],
          ac_cnt: row[1] || '-',
          avg_ac_btu: row[2] !== '0' ? row[2] : '-',
          avg_ac_rpm: row[3] !== '0.0' ? row[3] : '-',
          avg_ac_eer: row[4] || '-',
        };
      });

      setAcTableData(acData);

      const heaterData = data?.data?.map((row) => {
        return {
          household_type: row[0] || '-',
          htr_cnt: row[5] || '-',
          avg_htr_btu: row[6] !== '0' ? row[6] : '-',
          avg_htr_rpm: row[7] !== '0.0' ? row[7] : '-',
          htr_common_enrgy_src: row[8] || '-'
        };
      });

      setHTableData(heaterData);

      const heatPumpData = data?.data?.map((row) => {
        return {
          household_type: row[0],
          hp_cnt: row[9] || '-',
          avg_hp_btu: row[10] !== '0' ? row[10] : '-',
          avg_hp_rpm: row[11] !== '0.0' ? row[11] : '-',
          avg_hp_seer: row[12] || '-',
          avg_hp_hspf: row[13] || '-'
        };
      });

      setHpTableData(heatPumpData)
    } catch (e) {
      console.log(e);
    }
  };

  // useEffect required to ensure the page doesn't contintue to rerender infinitely
  useEffect(() => {
    getTableData(apiEndpoint);
  }, []);

  return (
    <>
      <Link to="/reports">View reports/query data</Link>
      <h1>Heating Cooling Method Details</h1>
      <br></br><br></br>
      <h2>Air Conditioner Details</h2>
      <BootStrapTable
        keyField="household_type"
        data={acTableData}
        columns={airConditionerColumns}
      />
      <br></br><br></br>
      <h2>Heater Details</h2>
      <BootStrapTable
        keyField="household_type"
        data={hTableData}
        columns={heaterColumns}
      />
      <br></br><br></br>
      <h2>Heat Pump Details</h2>
      <BootStrapTable
        keyField="household_type"
        data={hpTableData}
        columns={heatPumpColumns}
      />
    </>
  );
}
