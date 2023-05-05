const Connection = require("../database/Connection");
const { getUserId } = require("./user");

module.exports = {
  registerPatient: async (params) => {
    try {
      const {
        email_address,
        agency,
        ec_name,
        ec_contact_details,
        ec_address,
        type_of_id,
        id_number,
        file_path,
      } = params;

      const userId = await getUserId({ email_address });
      if (userId) {
        const query =
          `INSERT INTO ` +
          `tbl_patient ` +
          `VALUES ` +
          `(null,${userId},
          '${agency}',
          '${ec_name}',
          '${ec_contact_details}',
          '${ec_address}',
          '${type_of_id}',
          '${id_number}',
          '${file_path}'
           )`;

        await Connection(query);
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  },
  getPatientInfoByUserId: async (params) => {
    try {
      const { id } = params;

      const query = `SELECT * , "" as password
      FROM tbl_user 
      INNER JOIN tbl_patient
      ON tbl_user.userId=tbl_patient.user_id 
      where tbl_user.userId = '${id}' limit 1`;
      const result = await Connection(query);

      return result;
    } catch (err) {
      return [];
    }
  },
  getPatientTransactionByUserId: async (params) => {
    try {
      const { id, status, startDate, endDate } = params;

      let query = `SELECT 
      tbl_appointment.appointment_date, 
      tbl_transaction.*
      FROM tbl_user 
      INNER JOIN tbl_patient  ON tbl_user.userId = tbl_patient.user_id 
      INNER JOIN tbl_appointment ON tbl_patient.patientId = tbl_appointment.patient_id 
      INNER JOIN tbl_transaction ON tbl_transaction.appointment_id = tbl_appointment.appointmentId 
      where tbl_user.userId = '${id}'`;

      if (status && status !== "all") {
        query = query.concat(" ", `AND tbl_transaction.status = ${status}`);
      }
      if (startDate && endDate) {
        query = query.concat(
          " ",
          `AND tbl_transaction.date BETWEEN  '${startDate}' AND '${endDate}'`
        );
      }

      console.log(query);
      const result = await Connection(query);

      return result;
    } catch (err) {
      return [];
    }
  },

  getPatientAppointmentByPatientId: async (params) => {
    try {
      const { id } = params;

      let query = `SELECT 
      tbl_appointment.* ,
      tbl_doctor.*,
      tbl_time_slots.*
      FROM tbl_patient 
      INNER JOIN tbl_appointment ON tbl_patient.patientId = tbl_appointment.patient_id 
      INNER JOIN tbl_time_slots ON tbl_appointment.time_slot = tbl_time_slots.timeSlotId
      INNER JOIN tbl_doctor ON tbl_appointment.doctor_id  = tbl_doctor.doctorId
      where tbl_patient.patientId = '${id}';`;
      console.log(query, "query");
      const result = await Connection(query);

      console.log(result);
      return result;
    } catch (err) {
      return [];
    }
  },
  getPatientAppointment: async () => {
    try {
      let query = `SELECT 
      tbl_appointment.* ,
      tbl_doctor.*,
      tbl_time_slots.*
      FROM tbl_patient 
      INNER JOIN tbl_appointment ON tbl_patient.patientId = tbl_appointment.patient_id 
      INNER JOIN tbl_time_slots ON tbl_appointment.time_slot = tbl_time_slots.timeSlotId
      INNER JOIN tbl_doctor ON tbl_appointment.doctor_id  = tbl_doctor.doctorId`;
      console.log(query, "query");
      const result = await Connection(query);

      console.log(result);
      return result;
    } catch (err) {
      return [];
    }
  },
  changePassword: async (params) => {
    try {
      const { id, password } = params;

      const query =
        `UPDATE ` +
        `tbl_user ` +
        `SET ` +
        ` password = '${password}' ` +
        `WHERE ` +
        `userId = ${id}`;

      await Connection(query);

      return true;
    } catch (err) {
      return false;
    }
  },
  getPatient: async (params) => {
    try {
      const { id } = params;
      const query =
        `Select * from  tbl_patient ` + `WHERE ` + `user_id = ${id} limit 1`;
      console.log(query, "query");
      const result = await Connection(query);

      return result[0];
    } catch (err) {
      return false;
    }
  },
  updatePatientDetails: async (params) => {
    try {
      const {
        user_id,
        agency,
        ec_name,
        ec_contact_details,
        ec_address,
        type_of_id,
        id_number,
        file_path,
      } = params;

      const query = `UPDATE tbl_patient 
        SET 
        agency='${agency}',
        ec_name='${ec_name}',
        ec_contact_details='${ec_contact_details}',
        ec_address='${ec_address}',
        type_of_id='${type_of_id}',
        id_number='${id_number}',
        file_path='${file_path} ' 
        WHERE user_id = ${user_id} `;

      await Connection(query);

      return true;
    } catch (err) {
      return false;
    }
  },
  getTotalNumberOfPatient: async (today) => {
    try {
      const patientQuery = `Select count(*) as total_patient from tbl_appointment
                            WHERE appointment_date =  '${today}'
                            LIMIT 1;`;

      const totalNumberOfPatient = await Connection(patientQuery);

      const patientPendingQuery = `Select count(*) as total_pending from  tbl_patient 
                                  INNER JOIN tbl_appointment 
                                  ON tbl_appointment.patient_id = tbl_patient.patientId
                                  Where tbl_appointment.appointment_status =  'pending' 
                                  AND tbl_appointment.appointment_date =  '${today}' 
                                  Limit 1
                                  `;

      const totalNumberOfPending = await Connection(patientPendingQuery);
      console.log(totalNumberOfPending, "totalNumberOfPending");

      const patientCompletedQuery = `Select count(*) as total_completed from  tbl_patient 
      INNER JOIN tbl_appointment 
      ON tbl_appointment.patient_id = tbl_patient.patientId
      Where tbl_appointment.appointment_status =  'complete' 
      AND tbl_appointment.appointment_date =  '${today}' 
       Limit 1
      `;

      const totalNumberOfCompleted = await Connection(patientCompletedQuery);

      return {
        ...totalNumberOfPatient[0],
        ...totalNumberOfPending[0],
        ...totalNumberOfCompleted[0],
      };
    } catch (err) {
      return false;
    }
  },
};
