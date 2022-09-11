import React, { useState } from "react";
import { changeResStatus } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function DisplayReservation({ reservations }) {
  const [showError, setShowError] = useState(null);

  const resList = reservations.map((reservation) => {
    if (
      reservation.status === "cancelled" ||
      reservation.status === "finished"
    ) {
      return null;
    }

    async function handleCancel(event) {
      event.preventDefault();
      const abortController = new AbortController();
      const message =
        "Do you want to cancel this reservation? This cannot be undone.";
      if (window.confirm(message)) {
        try {
          await changeResStatus(
            reservation.reservation_id,
            "cancelled",
            abortController.signal
          );
          window.location.reload(true);
        } catch (error) {
          if (error.name !== "AbortError") setShowError(error);
        }
      }
    }

    return (
      <>
        <div
          key={reservation.reservation_id}
          className="border d-flex flex-column align-items-center p-2"
        >
          <p>Reservation ID: {reservation.reservation_id}</p>
          <p>
            Name:{reservation.first_name} {reservation.last_name}
          </p>
          <p>Mobile Number:{reservation.mobile_number}</p>
          <p>Party Size: {reservation.people}</p>
          <p>Time: {reservation.reservation_time}</p>
          <p>Date: {reservation.reservation_date}</p>
          <p data-reservation-id-status={reservation.reservation_id}>
            Status: {reservation.status}
          </p>

          <div className="res-button-container">
            <ErrorAlert error={showError} />
            {reservation.status === "booked" ? (
              <>
                <a
                  className="btn btn-primary reservation-button"
                  href={`/reservations/${reservation.reservation_id}/seat`}
                >
                  Seat
                </a>

                <a
                  className="btn btn-info reservation-button"
                  href={`/reservations/${reservation.reservation_id}/edit`}
                >
                  Edit
                </a>
              </>
            ) : null}

            <button
              type="button"
              className=" btn btn-danger"
              data-reservation-id-cancel={reservation.reservation_id}
              onClick={handleCancel}
            >
              Cancel Reservation
            </button>
          </div>
        </div>
      </>
    );
  });

  return <div className="reservations-container">{resList}</div>;
}

export default DisplayReservation;
