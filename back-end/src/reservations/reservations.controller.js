const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "people",
  "reservation_date",
  "reservation_time",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dateFormat = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const timeFormat = /[0-9]{2}:[0-9]{2}/;

const validReservationStatus = ["booked", "cancelled", "finished", "seated"];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: "requires request data",
    });
  }

  validProperties.forEach((property) => {
    if (!data[property]) {
      return next({
        status: 400,
        message: `requires ${property}`,
      });
    }

    if (property === "people" && !Number.isInteger(data.people)) {
      return next({
        status: 400,
        message: `requires ${property} to be a number`,
      });
    }

    if (
      property === "reservation_date" &&
      !dateFormat.test(data.reservation_date)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be YYYY-MM-DD`,
      });
    }

    if (
      property === "reservation_time" &&
      !timeFormat.test(data.reservation_time)
    ) {
      return next({
        status: 400,
        message: `requires ${property} to be HH:MM`,
      });
    }
  });

  next();
}

function dayIsValid(req, res, next) {
  const { data } = req.body;
  const reservationDate = new Date(
    `${data.reservation_date} ${data.reservation_time}`
  );
  let day = days[reservationDate.getDay()];
  let time = data.reservation_time;
  if (reservationDate < new Date() && day === "Tuesday") {
    return next({
      status: 400,
      message:
        "Reservations can only be created on a future date, except Tuesdays",
    });
  }
  if (reservationDate < new Date()) {
    return next({
      status: 400,
      message: "Reservations can only be created on a future date",
    });
  }
  if (day === "Tuesday") {
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays",
    });
  }
  if (time <= "10:30" || time >= "21:30") {
    return next({
      status: 400,
      message: "Reservations are available from 10:30AM - 9:30PM.",
    });
  }
  next();
}

function isBooked(req, res, next) {
  const { data } = req.body;
  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message:
        "New reservations cannot be created with a status of 'seated' or 'finished'",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} Not Found`,
  });
}

function validStatus(req, res, next) {
  const { status } = req.body.data;
  if (validReservationStatus.includes(status)) {
    res.locals.status = status;
    next();
  } else {
    next({
      status: 400,
      message: "unknown",
    });
  }
}

function checkIfFinished(req, res, next) {
  const { reservation_id } = req.params;
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({
      status: 400,
      message: `Reservation ${reservation_id} is already finished`,
    });
  }
  next();
}

async function updateStatus(req, res, next) {
  const updated = {
    ...res.locals.reservation,
    status: res.locals.status,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

//CRUDL
async function create(req, res) {
  const reservation = await service.create(req.body.data);
  res.status(201).json({ data: reservation });
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update(req, res, next) {
  const updated = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  service
    .update(updated)
    .then((data) => res.json({ data }))
    .catch(next);
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  let reservations;
  if (date) {
    reservations = await service.listByDate(date);
  } else if (mobile_number) {
    reservations = await service.listByNumber(mobile_number);
  }

  res.json({ data: reservations });
}

module.exports = {
  create: [
    hasValidProperties,
    dayIsValid,
    isBooked,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    checkIfFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
