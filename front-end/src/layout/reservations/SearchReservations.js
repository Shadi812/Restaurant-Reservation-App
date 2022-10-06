import React, { useState } from "react";
import ErrorAlert from "../ErrorAlert";
import DisplayReservation from "./DisplayReservation";
import { listReservations } from "../../utils/api";

function SearchReservations() {
  const [reservations, setReservations] = useState([]);
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);
  const [found, setfound] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setfound(false);
    try {
      const response = await listReservations(
        { mobile_number: number },
        abortController.signal
      );
      setReservations(response);
      setfound(true);
      setNumber("");
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  function handleChange({ target }) {
    setNumber(target.value);
  }

  return (
    <div className="card-body text-center">
      <ErrorAlert error={error} />
      <h2>Search By Phone Number</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control form-group"
          type="text"
          name="mobile_number"
          value={number}
          onChange={handleChange}
          placeholder="Enter a customer's phone number"
          required
        />
        <button className="form-button btn btn-block btn-success" type="submit">
          Find
        </button>
      </form>
      {reservations.length > 0 ? (
        <div>
          <h3>Reservations With the Matching Number Found:</h3>
          <DisplayReservation reservations={reservations} />
        </div>
      ) : found && reservations.length === 0 ? (
        <h4>No reservations found</h4>
      ) : (
        ""
      )}
    </div>
  );
}

export default SearchReservations;
