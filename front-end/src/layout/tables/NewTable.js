import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import TableForm from "./TableForm";
import { createTable } from "../../utils/api";

function NewTable() {
  const history = useHistory();
  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [tableData, setTableData] = useState(initialFormState);
  const [tableError, setTableError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTableError(null);
    tableData.capacity = Number(tableData.capacity);
    try {
      await createTable(tableData);
      setTableData(initialFormState);
      history.push("/dashboard");
    } catch (error) {
      setTableError(error);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    setTableError("");
    setTableData((newTable) => ({
      ...newTable,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="container fluid">
      <h3 className="text-center">Create A New Table</h3>

      <TableForm
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        tableData={tableData}
        tableError={tableError}
      />
    </div>
  );
}

export default NewTable;
