import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import { createReservation } from "../../utils/api";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [reservationError, setReservationError] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    setFormData((newReservation) => ({
      ...newReservation,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    let newResDate = formData.reservation_date;
    setReservationError(null);
    formData.people = Number(formData.people);

    try {
      await createReservation(formData, abortController.signal);
      setFormData(initialFormState);
      history.push(`/dashboard?date=${newResDate}`);
    } catch (error) {
      setReservationError(error);
    }
    return () => abortController.abort();
  };

  return (
    <div className="container fluid">
      <h3 className="text-center">Create A New Reservation</h3>
      <ErrorAlert error={reservationError} />

      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default NewReservation;
