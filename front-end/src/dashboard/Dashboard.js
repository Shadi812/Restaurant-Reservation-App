import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import DisplayReservation from "../layout/reservations/DisplayReservation";
import DisplayTables from "../layout/tables/DisplayTables";

import { listReservations, listTables } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate, handleCancel }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const query = useQuery();
  const route = useRouteMatch();
  const history = useHistory();

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listTables(abortController.signal).then(setTables);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }

  useEffect(() => {
    function updateDate() {
      const date = query.get("date");
      if (date) {
        setDate(date);
      } else {
        setDate(today());
      }
    }
    updateDate();
  }, [query, route, setDate]);
  useEffect(loadDashboard, [date]);

  return (
    <main className="container fluid mt-3">
      <h1 className="text-center">Dashboard</h1>

      <div className="mb-0 text-center">
        <h2 className="text-center">Reservations for {date}</h2>
      </div>
      <div className="d-flex justify-content-between m-4">
        <button
          className="btn btn-danger px-3 py-2"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>

        <button
          className="btn btn-primary px-3 py-2"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          className="btn btn-success px-3 py-2"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <ErrorAlert error={reservationsError} />

      <DisplayReservation
        reservations={reservations}
        handleCancel={handleCancel}
      />
      <div className="mt-4 text-center">
        <h1>Tables</h1>
      </div>
      <DisplayTables tables={tables} />
      <div className="d-flex justify-content-between m-4"></div>
    </main>
  );
}

export default Dashboard;
