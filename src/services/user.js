const Connection = require("../database/Connection");

module.exports = {
  register: async (params) => {
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
    } = params;

    try {
      const query =
        `INSERT INTO ` +
        `tbl_user ` +
        `VALUES ` +
        `(null,'${first_name}',
          '${last_name}',
          '${password}',
          '${role}',
          '${middle_name}',
          '${birthday}',
          '${sex}',
          '${address}',
          '${contact_number}',
          '${email_address}',
          '${terms_and_condition}'
           )`;

      await Connection(query);

      return true;
    } catch (err) {
      return false;
    }
  },
  getUser: async (params) => {
    const { email_address } = params;

    const query = `select count(*) AS email_count from tbl_user where email_address = '${email_address}'`;

    return await Connection(query);
  },
  getUserId: async (params) => {
    try {
      const { email_address } = params;

      const query = `select userId from tbl_user where email_address = '${email_address}' limit 1`;

      const result = await Connection(query);

      return result[0].userId ? result[0].userId : [];
    } catch (err) {
      return [];
    }
  },
  getUserByEmail: async (params) => {
    try {
      const { email_address } = params;

      const query = `select * from tbl_user where email_address = '${email_address}' limit 1`;

      const result = await Connection(query);

      return result[0];
    } catch (err) {
      return [];
    }
  },
  //http://localhost:3001/accounts/updateInfo?userId=2
  getUserById: async (params) => {
    try {
      const { userId } = params;

      const query = `select * from tbl_user where userId = '${userId}' limit 1`;
      const result = await Connection(query);

      return result;
    } catch (err) {
      return [];
    }
  },
  getUserLogin: async (params) => {
    try {
      const { email_address, password } = params;

      const query = `select 
                        first_name,
                        last_name,
                        role,
                        middle_name,
                        birthday,
                        sex,
                        address,
                        contact_number,
                        email_address,
                        terms_and_condition 
                    from 
                        tbl_user 
                    where 
                        email_address = '${email_address}' 
                    AND 
                        password = '${password}' LIMIT 1`;

      const result = await Connection(query);

      return result;
    } catch (err) {
      return [];
    }
  },
  updateUserInfo: async (params) => {
    try {
      const {
        id,
        first_name,
        last_name,
        role,
        middle_name,
        birthday,
        sex,
        address,
        contact_number,
        terms_and_condition,
      } = params;

      const query =
        `UPDATE ` +
        `tbl_user ` +
        `SET ` +
        ` first_name = '${first_name}',
        last_name = '${last_name}',
        role = '${role}',
        middle_name = '${middle_name}',
        birthday = '${birthday}',
        sex = '${sex}',
        address = '${address}',
        contact_number = '${contact_number}',
        terms_and_condition = '${terms_and_condition}'` +
        `WHERE ` +
        `userId = ${id}`;

      await Connection(query);

      return true;
    } catch (err) {
      return false;
    }
  },
};
