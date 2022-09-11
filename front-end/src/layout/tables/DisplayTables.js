import React from "react";

function DisplayTables({ reservation_id, table_id, tables, handleClear }) {
  const showTables = tables.map((table) => {
    return (
      <div className="container fluid my-3">
        <div key={table.table_id} className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">
                Table: {table.table_name}
              </h5>
              <h5 className="card-title text-center">
                Capacity: {table.table_id}
              </h5>
              <h5 className="text-center" table-status={table.table_id}>
                Status: {table.reservation_id ? "Occupied" : "Free"}
              </h5>

              <div className="table-button-container text-center">
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

  return <div className="center"> {showTables}</div>;
}

export default DisplayTables;
