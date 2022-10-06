import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function DisplayTables({ tables }) {
  const [error, setError] = useState(null);
  const history = useHistory();

  async function handleClear(tableId) {
    const abortController = new AbortController();

    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? This cannot be undone."
        )
      ) {
        await deleteTable(tableId);
        history.go();
      }
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  const showTables = tables.map((table) => {
    return (
      <div className="container fluid my-3">
        <div key={table.table_id} className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">
                {" "}
                Table: {table.table_name}
              </h5>
              <h5 className="card-title text-center">
                Table Size: {table.capacity}
              </h5>
              <h5 className="text-center" table-status={table.table_id}>
                Status: {table.reservation_id ? "Occupied" : "Free"}
              </h5>

              <div className="text-center">
                <button
                  className="btn btn-danger"
                  data-table-id-finish={table.table_id}
                  onClick={() => handleClear(table)}
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="tables-container">
        <ErrorAlert error={error} />
        {showTables}
      </div>
    </div>
  );
}

export default DisplayTables;
