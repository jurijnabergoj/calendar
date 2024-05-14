const daysContainer = document.querySelector(".days"),
  calendar = document.querySelector(".calendar"),
  month = document.querySelector(".month-year"),
  todayBtn = document.querySelector(".today-btn"),
  dateJumpBtn = document.querySelector(".date-jump-btn"),
  fullDateJumpBtn = document.querySelector(".full-date-jump-btn"),
  holidaysFile = document.querySelector(".file-input"),
  toggleCalendarBtn = document.querySelector(".toggle-calendar-btn");

// define days, months
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let holidays = [];

// get today's date
const todayDate = new Date();
const todayDay = todayDate.getDate();
const todayMonth = todayDate.getMonth();
const todayYear = todayDate.getFullYear();

// set month, year for currently displayed calendar
const currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// function to display days
function displayCalendar() {
  // get previous month, current month, next month days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const prevLastDay = new Date(currentYear, currentMonth, 0);

  // set 2 digit years using setFullYear, Date constructor sets these to 19xx by default
  if (currentYear > -100 && currentYear < 100) {
    firstDay.setFullYear(currentYear);
    lastDay.setFullYear(currentYear);
    prevLastDay.setFullYear(currentYear);
  }
  // get number of previous days, next days
  const lastDayIndex = lastDay.getDay();
  const lastDayDate = lastDay.getDate();
  const prevLastDayDate = prevLastDay.getDate();
  const nextDays = 7 - lastDayIndex - 1;

  // update current year and month in header
  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  // initialize days html
  let days = "";

  // add days from previous month to html
  for (let x = firstDay.getDay(); x > 0; x--) {
    days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  }

  // add days from current month to html
  for (let i = 1; i <= lastDayDate; i++) {
    // set currentDate to currently handled calendar day
    currentDate.setDate(i);
    currentDate.setMonth(currentMonth);
    currentDate.setFullYear(currentYear);
    currentDayOfTheWeek = currentDate.getDay();

    // if it's today add today class
    if (
      i === todayDay &&
      currentMonth === todayMonth &&
      currentYear === todayYear
    ) {
      days += `<div class="day today">${i}</div>`;
    } else {
      // if it's a holiday add holiday class
      let isHoliday = false;
      for (const holiday of holidays) {
        // if holiday repeats add it to every year, else only specified year
        repeat = holiday["repeat"];
        if (repeat) {
          if (holiday["month"] == currentMonth && holiday["day"] == i) {
            // if it's also a sunday add a sunday class
            if (currentDayOfTheWeek == 0) {
              days += `<div class="day sunday holiday repeat">${i}</div>`;
            } else {
              days += `<div class="day holiday repeat">${i}</div>`;
            }
            isHoliday = true;
            break;
          }
        } else {
          if (
            holiday["year"] == currentYear &&
            holiday["month"] == currentMonth &&
            holiday["day"] == i
          ) {
            // if it's also a sunday add a sunday class
            if (currentDayOfTheWeek == 0) {
              days += `<div class="day sunday holiday norepeat">${i}</div>`;
            } else {
              days += `<div class="day holiday norepeat">${i}</div>`;
            }
            isHoliday = true;
            break;
          }
        }
      }
      if (!isHoliday) {
        // if it's sunday and not a holiday add only sunday class
        if (currentDayOfTheWeek == 0) {
          days += `<div class="day sunday">${i}</div>`;
        } else {
          // else add normal day
          days += `<div class="day">${i}</div>`;
        }
      }
    }
  }
  // in order for every month to be of same size we add next month days to have total 6 rows
  // if there are <= 28 days in calendar (including previous month days) -> add 2 more rows
  // else if there are <= 35 days in calendar (including previous month days) -> add 1 more row
  // else we have 6 rows -> ok
  let paddedNextDays = 0;
  if (firstDay.getDay() + lastDayDate <= 28) {
    paddedNextDays = nextDays + 14;
  } else if (firstDay.getDay() + lastDayDate <= 35) {
    paddedNextDays = nextDays + 7;
  } else {
    paddedNextDays = nextDays;
  }

  // add days from next month to html
  for (let i = 1; i <= paddedNextDays; i++) {
    days += `<div class="day next">${i}</div>`;
  }
  daysContainer.innerHTML = days;

  // hide todayBtn
  hideTodayBtn();
}

// display calendar
displayCalendar();

// button to go to current day's month
todayBtn.addEventListener("click", () => {
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  displayCalendar();
});

// jump button for month and year date selection
dateJumpBtn.addEventListener("click", () => {
  selectedMonth = parseInt(document.getElementById("select-month").value);
  selectedYear = parseInt(document.getElementById("select-year").value);
  currentMonth = selectedMonth;
  currentYear = selectedYear;
  displayCalendar();
});

// jump button for full date selection
fullDateJumpBtn.addEventListener("click", () => {
  fullDate = document.getElementById("select-date").value;
  const [selectedYear, selectedMonth, selectedDay] = parseFullDate(fullDate);
  currentMonth = selectedMonth;
  currentYear = selectedYear;
  displayCalendar();

  // flash the selected day for 1250ms, after 100ms delay
  const dayElements = document.querySelectorAll(".day");
  dayElements.forEach((dayElement) => {
    if (
      dayElement.textContent.trim() === selectedDay.toString() &&
      !dayElement.classList.contains("prev") &&
      !dayElement.classList.contains("next")
    ) {
      setTimeout(() => {
        dayElement.classList.add("flash");
        setTimeout(() => {
          dayElement.classList.remove("flash");
        }, 1250);
      }, 100);
    }
  });
});

// validate and handle full date input
function validateDate(input) {
  var v = input.value;
  if (v.match(/^\d{0,4}$/) !== null) {
    if (v.length === 4 && parseInt(v) > 0) {
      input.value = v + "/";
    }
  } else if (v.match(/^\d{4}\/\d{0,2}$/) !== null) {
    var year = parseInt(v.substring(0, 4));
    var month = parseInt(v.substring(5, 7));
    if (v.length === 7) {
      if (month > 0 && month <= 12) {
        input.value = v + "/";
      } else {
        input.value = v.slice(0, -2);
      }
    }
  } else if (v.match(/^\d{4}\/\d{2}\/\d{0,2}$/) !== null) {
    var year = parseInt(v.substring(0, 4));
    var month = parseInt(v.substring(5, 7));
    var day = parseInt(v.substring(8, 10));
    if (v.length === 10) {
      if (day > 0 && day <= 31) {
        if (day <= new Date(year, month, 0).getDate()) {
          input.value = v;
        } else {
          input.value = v.slice(0, -2);
        }
      } else {
        input.value = v.slice(0, -2);
      }
    }
  } else {
    input.value = "";
  }
}

// hide today btn if todays month is already displayed
function hideTodayBtn() {
  if (currentYear === todayYear && currentMonth === todayMonth) {
    todayBtn.style.visibility = "hidden";
  } else {
    todayBtn.style.visibility = "visible";
  }
}

// retrieve holiday txt file
holidaysFile.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const contents = event.target.result;
    holidays = parseHolidays(contents);
    displayCalendar();
  };
  reader.readAsText(file);
});

// close and open the calendar
toggleCalendarBtn.addEventListener("click", () => {
  if (calendar.style.display === "none") {
    calendar.style.display = "block";
  } else {
    calendar.style.display = "none";
  }
});

// parse holidays from txt file
function parseHolidays(contents) {
  const lines = contents.trim().split("\n");
  const holidays = lines.map((line) => {
    const [date, repeat] = line.split("-");
    const [year, month, day] = line.split("/");
    return {
      year: parseInt(year),
      month: parseInt(month) - 1, // -1 because months start with 0 in Date format
      day: parseInt(day),
      repeat: repeat.trim() === "repeat",
    };
  });
  return holidays;
}

// parse inputted date
function parseFullDate(date) {
  const [year, month, day] = date.split("/");
  return [parseInt(year), parseInt(month) - 1, parseInt(day)]; // -1 because months start with 0 in Date format
}
