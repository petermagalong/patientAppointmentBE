const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { tryCatch } = require("../util/tryCatch");
const AppError = require("../util/AppError");
const { AccountValidation } = require("../validations/AccountsValidation");
const { UserService, PatientService, EmployeeService } = require("../services");
const { getAge } = require("../util/dateFormat");

router.post(
  `/register`,
  tryCatch(async (req, res) => {
    const pass1 = req.body.password;

    const salt = bcrypt.genSaltSync(10);
    req.body.password = String(bcrypt.hashSync(pass1, salt));

    const {
      first_name,
      last_name,
      role,
      middle_name,
      birthday,
      sex,
      address,
      contact_number,
      email_address,
      terms_and_condition,
      password,
      agency,
      ec_name,
      ec_contact_details,
      ec_address,
      type_of_id,
      id_number,
      file_path,
      sss_num,
      pagibig_num,
      philhealth_num,
      tin_num,
      emerg_contact,
      emerg_contact_first_name,
      emerg_contact_last_name,
    } = req.body;

    const myAge = getAge(birthday);
    if (myAge.years < 5) {
      throw new AppError(false, "Invalid Age Below 5 years old", 400);
    }

    const val = await UserService.getUser({ email_address });

    if (val[0].email_count > 0) {
      throw new AppError(false, "Email Already Exist!", 500);
    }

    const results = await UserService.register({
      first_name,
      last_name,
      role,
      middle_name,
      birthday,
      sex,
      address,
      contact_number,
      email_address,
      terms_and_condition,
      password,
    });

    if (results) {
      if (role === "patient") {
        const patientDetails = {
          email_address,
          agency,
          ec_name,
          ec_contact_details,
          ec_address,
          type_of_id,
          id_number,
          file_path,
        };
        const result = await PatientService.registerPatient(patientDetails);

        if (result) {
          res.status(200).send({
            status: results,
            message: "Patient Successfully Created!",
          });
          return;
        } else throw new Error("Patient details Not Created! ");
      }

      if (role === "nurse" || role === "clerk") {
        const employeeDetails = {
          email_address,
          sss_num,
          pagibig_num,
          philhealth_num,
          tin_num,
          emerg_contact,
          emerg_contact_first_name,
          emerg_contact_last_name,
        };

        const result = await EmployeeService.registerEmployee(employeeDetails);
        if (result) {
          res.status(200).send({
            status: results,
            message: "Nurse Successfully Created!",
          });
          return;
        } else throw new Error("Patient details Not Created! ");
      }

      res.status(200).send({
        status: results,
        message: "Admin Successfully Created!",
      });
    } else {
      throw new Error("Not Created!");
    }
  }, AccountValidation.validateRegister)
);

router.post(
  `/login`,
  tryCatch(async (req, res) => {
    const { email_address, password } = req.body;

    const userDetails = await UserService.getUserByEmail({ email_address });
    if (!userDetails) {
      throw new AppError(false, "Invalid Email not exist", 400);
    }

    const isMatch = await bcrypt.compareSync(password, userDetails.password);

    if (!isMatch) {
      throw new AppError(false, "Incorect password", 400);
    }

    delete userDetails.password;
    res.status(200).send({
      status: userDetails,
      message: "Success",
    });
  }, AccountValidation.validateLogin)
);

router.put(
  `/updateInfo`,
  tryCatch(async (req, res) => {
    const {
      first_name,
      last_name,
      role,
      middle_name,
      birthday,
      sex,
      address,
      contact_number,
      terms_and_condition,
    } = req.body;
    const userData = await UserService.getUserById({
      userId: req.query.userId,
    });

    if (userData.length < 1) {
      throw new AppError(false, "Invalid UserId not found", 404);
    }

    const userInfo = {
      first_name: first_name || userData[0].first_name,
      last_name: last_name || userData[0].last_name,
      role: role || userData[0].role,
      middle_name: middle_name || userData[0].middle_name,
      birthday: birthday || userData[0].birthday,
      sex: sex || userData[0].sex,
      address: address || userData[0].address,
      contact_number: contact_number || userData[0].contact_number,
      terms_and_condition: terms_and_condition
        ? 1
        : 0 || userData[0].terms_and_condition,
    };

    const result = await UserService.updateUserInfo({
      id: req.query.userId,
      ...userInfo,
    });

    if (result) {
      res.status(200).send({
        status: result,
        message: "Successfully Updated!",
      });
    } else {
      throw new Error("Not Updated!");
    }
  }, AccountValidation.validateUpdate)
);

module.exports = router;
