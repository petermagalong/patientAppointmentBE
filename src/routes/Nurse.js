const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { tryCatch } = require("../util/tryCatch");
const AppError = require("../util/AppError");
const { PatientService } = require("../services");
const { getDateToday } = require("../util/dateFormat");

router.get(
  `/summary`,
  tryCatch(async (req, res) => {
    const today = getDateToday();
    console.log(today);
    const patientDetails = await PatientService.getTotalNumberOfPatient(today);

    if (!patientDetails) {
      throw new AppError(false, "Patient not found", 400);
    }

    res.status(200).send({
      status: patientDetails,
      message: "Success",
    });
  })
);

router.get(
  `/getPatientAppointment`,
  tryCatch(async (req, res) => {
    const result = await PatientService.getPatientAppointment();

    res.status(200).send({
      status: result,
      message: "Success",
    });
  })
);

module.exports = router;
