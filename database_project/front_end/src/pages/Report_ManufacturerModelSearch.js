import React, { useState, useEffect, useMemo } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import fakeData from "../MOCK_DATA.json";

export default function ManufacturerModelSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState([]);
  const columns = [
    { dataField: "manufacturer", text: "Manufacturer" },
    { dataField: "model", text: "Appliance Model" },
  ];

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      return (
        row.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  });

  // get the data from API
  const getTableData = async (apiEndpoint) => {
    try {
      console.log(apiEndpoint);
      const data = await axios.get(apiEndpoint);
      const flattenedData = data?.data?.map((row) => {
        console.log(row);
        return {
          manufacturer: row[0],
          model: row[1],
        };
      });
      setTableData(flattenedData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect((searchQuery) => {
    if (!searchQuery) {
      getTableData(`http://localhost:8888/api/user_search/all`);
    } else {
      getTableData(`http://localhost:8888/api/user_search/${searchQuery}`);
    }
  }, []);

  return (
    <>
      <Link to="/reports">View reports/query data</Link>
      <h1>Manufacturer / Model Search Report</h1>
      <br></br>
      <label>Search </label>&nbsp;
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br></br><br></br>
      <table style={{ width: 500, borderCollapse: "collapse", margin: 'auto' }}>
        <thead>
          <tr>
            {columns.map((header) => (
              <th
                key={header.dataField}
                style={{ border: "1px solid black", padding: "8px" }}
              >
                {header.text}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row) => (
            <tr key={`${row.manufacturer}-${row.model}`}>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  backgroundColor:
                    searchQuery === ""
                      ? "white"
                      : `${
                          row.manufacturer
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                            ? "#90EE90"
                            : "white"
                        }`,
                }}
              >
                {row.manufacturer}
              </td>
              <td
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  backgroundColor:
                    searchQuery === ""
                      ? "white"
                      : `${
                          row.model
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                            ? "#90EE90"
                            : "white"
                        }`,
                }}
              >
                {row.model}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
