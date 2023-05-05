const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { tryCatch } = require("../util/tryCatch");
const AppError = require("../util/AppError");
const { PatientService, UserService } = require("../services");
const { PatientValidation } = require("../validations/PatientValidation");

router.get(
  `/getUserProfile`,
  tryCatch(async (req, res) => {
    const { id } = req.query;

    const response = await PatientService.getPatientInfoByUserId({
      id,
    });

    if (response.length < 1) {
      throw new AppError(false, "User not Found", 404);
    }

    res.status(200).send({
      status: response[0],
      message: "Success",
    });
  })
);

//http://localhost:3001/patients/getPatientTransactions?id=32&status=all&startDate=2023-05-04&endDate=2023-05-04
router.get(
  `/getPatientTransactions`,
  tryCatch(async (req, res) => {
    const { id, status, startDate, endDate } = req.query;

    const response = await PatientService.getPatientTransactionByUserId({
      id,
      status,
      startDate,
      endDate,
    });
    if (response.length < 1) {
      throw new AppError(false, "User not Found", 404);
    }

    res.status(200).send({
      status: response,
      message: "Success",
    });
  })
);

router.put(
  `/changePassword`,
  tryCatch(async (req, res) => {
    const { email_address, password, newPassword, confirmPassword } = req.body;

    if (confirmPassword !== newPassword) {
      throw new AppError(false, "Password not match.", 400);
    }

    const userDetails = await UserService.getUserByEmail({ email_address });
    if (!userDetails) {
      throw new AppError(false, "Invalid Email not exist", 400);
    }

    const isMatch = await bcrypt.compareSync(password, userDetails.password);

    if (!isMatch) {
      throw new AppError(false, "Incorect password", 400);
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = String(bcrypt.hashSync(newPassword, salt));

    const result = await PatientService.changePassword({
      id: userDetails.userId,
      password: hashPassword,
    });

    if (!result) {
      throw new AppError(false, "Patient not update", 400);
    }

    delete userDetails.password;
    res.status(200).send({
      status: result,
      message: "Success",
    });
  }, PatientValidation.validateChangePatientPassword)
);

router.put(
  `/updateDetails`,
  tryCatch(async (req, res) => {
    const {
      agency,
      ec_name,
      ec_contact_details,
      ec_address,
      type_of_id,
      id_number,
      file_path,
    } = req.body;

    const { id } = req.query;
    console.log(req.query);
    const patientDetails = await PatientService.getPatient({
      id,
    });

    if (!patientDetails) {
      throw new AppError(false, "Patient not found", 400);
    }

    const toUpdateDetails = {
      user_id: id,
      agency: agency || patientDetails.agency,
      ec_name: ec_name || patientDetails.ec_name,
      ec_contact_details:
        ec_contact_details || patientDetails.ec_contact_details,
      ec_address: ec_address || patientDetails.ec_address,
      type_of_id: type_of_id || patientDetails.type_of_id,
      id_number: id_number || patientDetails.id_number,
      file_path: file_path || patientDetails.file_path,
    };
    const result = PatientService.updatePatientDetails(toUpdateDetails);

    if (!result) {
      throw new AppError(false, "Patient not update", 400);
    }
    res.status(200).send({
      status: true,
      message: "Update success",
    });
  }, PatientValidation.validateUpdatePatientDetails)
);

router.get(
  `/getPatientAppointment`,
  tryCatch(async (req, res) => {
    const { id } = req.query;

    const response = await PatientService.getPatientInfoByUserId({
      id,
    });

    if (response.length < 1) {
      throw new AppError(false, "User not Found", 404);
    }

    console.log({ id: response[0].patientId });
    const result = await PatientService.getPatientAppointmentByPatientId({
      id: response[0].patientId,
    });

    res.status(200).send({
      status: result,
      message: "Success",
    });
  })
);

module.exports = router;
