const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  port: 3306,
  database: "db_ohmli",
};

const db = mysql.createPool(dbConfig);

module.exports = (query) => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, sql) => {
      if (err) {
        console.log("Database error: ", err);
        reject(err);
      } else {
        sql.query(query, (err, results) => {
          if (err) {
            console.log("Query error: ", err.sqlMessage);
            reject(err.Error);
          } else {
            resolve(results);
          }

          sql.release();
        });
      }
    });
  });
};
