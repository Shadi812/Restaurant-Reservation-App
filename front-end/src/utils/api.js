/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  if (params) {
    const url = new URL(`${API_BASE_URL}/reservations`);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value.toString())
    );
    return await fetchJson(url, { headers, signal }, [])
      .then(formatReservationDate)
      .then(formatReservationTime);
  } else {
    const url = `${API_BASE_URL}/reservations`;
    return await fetchJson(url, { headers, signal }, []);
  }
}

/**
 * Saves resrvation to the database (public/data/db.json).
 * @param newReservation
 *  the reservation to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation, which will now have an `id` property.
 * Creates a new reservation.
 */
export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}
/**
 * Updates resrvation to the database (public/data/db.json).
 * @param newReservation
 *  the reservation to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error>}
 * Creates an updated reservation.
 */
export async function updateReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };
  return await fetchJson(url, options, reservation);
}
/**
 * Creates a new table associated with the specified `tableId`.
 * @param table
 *  the id of the target deck
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to the new table, which will have an `id` property.
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, table);
}

/**
 * Retrieves all existing tables.
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  return await fetchJson(url, { signal });
}
/**
 * Retrieves the reservation with the specified `reservationId`
 * @param reservationId
 *  the `id` property matching the desired resrvation.
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<any>}
 *  a promise that resolves to the saved reservation.
 * Retrieves an individual reservation given a reservation_id.
 */
export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(url, { headers, signal }, {})
    .then(formatReservationDate)
    .then(formatReservationTime);
}
/**
 * Updates table to the database in relation to the recervationID (public/data/db.json).
 * @param reservationId
 *  the reservattion to save, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error>}
 * Creates an updated table status of canceled so the table can be deleted.
 */
export async function changeResStatus(reservationId, status, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  };
  return await fetchJson(url, options);
}
/**
 * Updates table to the database (public/data/db.json).
 * @param tableId
 *  the table to save, which must not have an `id` property
 * @param reservationId
 *  the reservationId, which must not have an `id` property
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error>}
 * Creates an updated table.
 */
export async function updateTable(reservationId, tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id: reservationId } }),
    signal,
  };
  return await fetchJson(url, options);
}
/**
 * Deletes the table with the specified `tableId`.
 * @param cardId
 *  the id of the table to delete
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export async function deleteTable(tableId) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`;
  const options = {
    method: "DELETE",
  };
  return await fetchJson(url, options);
}
/**
 * Deletes the card with the specified `reservationId`.
 * @param reservationId
 *  the id of the reservation to delete
 * @param signal
 *  optional AbortController.signal
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export async function deleteReservation(reservationId) {
  const url = `${API_BASE_URL}/reservations/${reservationId}`;
  const options = {
    method: "DELETE",
  };
  return await fetchJson(url, options);
}
