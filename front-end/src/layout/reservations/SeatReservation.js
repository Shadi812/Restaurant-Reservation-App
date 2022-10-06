import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { updateTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import Tables from "../tables/Tables";

function SeatReservation() {
  const reservationId = useParams();
  const [tableId, setTableId] = useState(3);
  const [seatingError, setSeatingError] = useState(null);
  const history = useHistory();

  const handleChange = (event) => {
    event.preventDefault();
    setTableId(Number(event.target.value));
  };

  const handleSeating = async (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    await updateTable(
      reservationId.reservation_id,
      tableId,
      abortController.signal
    )
      .then(() => history.push("/"))
      .catch(setSeatingError);
    return () => abortController.abort();
  };

  return (
    <div>
      <main className="m-3 text-center">
        <div className="page-head-container">
          <h2>Seat Reservation: {reservationId.reservation_id}</h2>
        </div>
        <ErrorAlert error={seatingError} />
        <form onSubmit={handleSeating} className="form-card">
          <div className="form-control-lg">
            <label htmlFor="table_id">Select a Table: </label>
            <select
              name="table_id"
              className="form-input"
              onChange={handleChange}
            >
              <Tables />
            </select>
          </div>
          <div className="form-item mt-2 mb-2">
            <input
              type="submit"
              className="btn btn-success m-3"
              value={"Submit"}
            />
            <input
              type="button"
              className="btn btn-danger m-3"
              value={"Cancel"}
              onClick={() => history.goBack()}
            />
          </div>
        </form>
      </main>
    </div>
  );
}

export default SeatReservation;
