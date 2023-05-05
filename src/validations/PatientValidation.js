const Joi = require("joi");

const validator = (schema) => (payload) => schema.validate(payload);

const getPatientInfo = Joi.object({
  id: Joi.string().required(),
});

const getPatientTransaction = Joi.object({
  id: Joi.string().required(),
  status: Joi.string().optional().default("all"),
  startDate: Joi.string().optional().default(""),
  endDate: Joi.string().optional().default(""),
});

const UpdateChangePassword = Joi.object({
  email_address: Joi.string().email().required(),
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

const UpdatePatientDetails = Joi.object({
  id: Joi.string().required(),
  agency: Joi.string().required(),
  ec_name: Joi.string().required(),
  ec_contact_details: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .optional(),
  ec_address: Joi.string().required(),
  type_of_id: Joi.string().required(),
  id_number: Joi.string().required(),
  file_path: Joi.string().required(),
});

module.exports.PatientValidation = {
  validateGetPatientInfo: validator(getPatientInfo),
  validateGetPatientTransaction: validator(getPatientTransaction),
  validateChangePatientPassword: validator(UpdateChangePassword),
  validateUpdatePatientDetails: validator(UpdatePatientDetails),
};
