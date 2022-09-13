const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service");

async function validReservation(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} Not Found`,
  });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id} Not Found`,
  });
}

const validProperties = ["capacity", "table_name"];

function checkValidProperties(req, res, next) {
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

    if (property === "table_name" && data.table_name.length <= 1) {
      return next({
        status: 400,
        message: `${property} required to be at least 2 characters in length`,
      });
    }

    if (
      (property === "capacity" && data.capacity < 1) ||
      (property === "capacity" && !Number.isInteger(data.capacity))
    ) {
      return next({
        status: 400,
        message: `${property} required to be a number of 1 or greater`,
      });
    }
  });
  next();
}

async function validTable(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({
      status: 400,
      message: `requires request data`,
    });
  }
  if (!data.reservation_id) {
    return next({
      status: 400,
      message: `Requires reservation_id property`,
    });
  }
  next();
}

function validCapacity(req, res, next) {
  const reservation = res.locals.reservation;
  const table = res.locals.table;
  if (table.capacity < reservation.people) {
    return next({
      status: 400,
      message:
        "Table does not have sufficient capacity to handle this reservation",
    });
  }
  if (table.reservation_id !== null) {
    return next({
      status: 400,
      message: "Table is occupied!",
    });
  }
  next();
}

function checkIfOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    next({
      status: 400,
      message: `The table is not occupied`,
    });
  }
  next();
}

function alreadySeated(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "seated") {
    return next({
      status: 400,
      message: `The reservation you selected is already seated.`,
    });
  }
  next();
}

//CRUDL
async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function read(req, res) {
  res.json({ data: res.locals.table });
}

async function update(req, res, next) {
  const reservation_id = res.locals.reservation.reservation_id;
  const table = res.locals.table;
  const updatedTable = {
    ...table,
    reservation_id: reservation_id,
  };
  reservationService.updateStatus(reservation_id, "seated");
  service
    .update(updatedTable)
    .then((data) => res.json({ data }))
    .catch(next);
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function deleteTable(req, res, next) {
  const table = res.locals.table;
  const clearedTable = {
    ...table,
    reservation_id: null,
  };
  reservationService.updateStatus(table.reservation_id, "finished");
  service
    .update(clearedTable)
    .then((data) => res.json({ data }))
    .catch(next);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [checkValidProperties, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(tableExists), read],
  update: [
    asyncErrorBoundary(tableExists),
    validTable,
    validReservation,
    validCapacity,
    alreadySeated,
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(checkIfOccupied),
    deleteTable,
  ],
};
