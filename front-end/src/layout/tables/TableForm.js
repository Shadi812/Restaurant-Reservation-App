import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";

function TableForm({ tableData, tableError, handleSubmit, handleChange }) {
  const history = useHistory();

  return (
    <div>
      <form className="d-flex flex-column" onSubmit={handleSubmit}>
        <fieldset>
          <ErrorAlert error={tableError} />
          <label htmlFor="table_name"> Table Name: </label>
          <input
            className="form-control my-2"
            id="table_name"
            name="table_name"
            type="text"
            required
            min={2}
            placeholder="Table Name"
            onChange={handleChange}
          />
          <label htmlFor="capacity"> Table Capacity: </label>
          <input
            className="form-control my-2"
            id="capacity"
            name="capacity"
            type="number"
            required
            min={1}
            placeholder={1}
            value={tableData.capacity}
            onChange={handleChange}
          />
        </fieldset>
        <div className="form-item mt-2 mb-2">
          <button type="submit" className="btn btn-success btn-block">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-block"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TableForm;
