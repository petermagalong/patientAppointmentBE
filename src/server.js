const express = require("express");
const bodyParser = require("body-parser");

const app = express();

/* Middleware */
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes */
const accountsRoute = require("./routes/Accounts");
const patientsRoute = require("./routes/Patient");
const nurseRoute = require("./routes/Nurse");
const errorHandler = require("./middleware/errorHandler");

app.use("/accounts", accountsRoute);
app.use("/patients", patientsRoute);
app.use("/nurse", nurseRoute);

app.use(errorHandler);
const port = 3001;

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
