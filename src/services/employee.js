const Connection = require("../database/Connection");
const { getUserId } = require("./user");

module.exports = {
  registerEmployee: async (params) => {
    try {
      const {
        email_address,
        sss_num,
        pagibig_num,
        philhealth_num,
        tin_num,
        emerg_contact,
        emerg_contact_first_name,
        emerg_contact_last_name,
      } = params;

      const userId = await getUserId({ email_address });

      const query =
        `INSERT INTO ` +
        `tbl_employee ` +
        `VALUES ` +
        `(null,${userId},
          '${sss_num}',
          '${pagibig_num}',
          '${philhealth_num}',
          '${tin_num}',
          '${emerg_contact}',
          '${emerg_contact_first_name}',
          '${emerg_contact_last_name}'
           )`;

      await Connection(query);

      return true;
    } catch (err) {
      return false;
    }
  },
};
