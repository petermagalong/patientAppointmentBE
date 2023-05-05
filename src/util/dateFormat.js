//get age MM/DD/YYYY
function getAge(dateString) {
  let now = new Date();

  let yearNow = now.getYear();
  let monthNow = now.getMonth();
  let dateNow = now.getDate();

  let dob = new Date(
    dateString.substring(6, 10),
    dateString.substring(0, 2) - 1,
    dateString.substring(3, 5)
  );

  let yearDob = dob.getYear();
  let monthDob = dob.getMonth();
  let dateDob = dob.getDate();
  let monthAge;
  let dateAge;
  let yearAge;

  yearAge = yearNow - yearDob;

  if (monthNow >= monthDob) monthAge = monthNow - monthDob;
  else {
    yearAge--;
    monthAge = 12 + monthNow - monthDob;
  }

  if (dateNow >= dateDob) dateAge = dateNow - dateDob;
  else {
    monthAge--;
    dateAge = 31 + dateNow - dateDob;

    if (monthAge < 0) {
      monthAge = 11;
      yearAge--;
    }
  }

  const userAge = {
    years: yearAge,
    months: monthAge,
    days: dateAge,
  };
  return userAge;
}

const getDateToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
};

module.exports = {
  getAge,
  getDateToday,
};
