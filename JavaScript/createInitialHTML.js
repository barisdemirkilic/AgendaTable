const WeekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let agendaTable = document.getElementById("agendaTable");
let agendaTableHead = agendaTable.getElementsByTagName("thead")[0];
let agendaTableHeadDateRow = agendaTableHead.getElementsByTagName("tr")[1];
let agendaTableBody = agendaTable.getElementsByTagName("tbody")[0];

// Create empty th elements for the date headers
function createAgendaDatesInTHead()
{
  // +1 because of the empty cell at the start of the header
  for (let i = 0; i < totalDatesInAgenda + 1; i++)
    agendaTableHeadDateRow.insertCell(i).outerHTML = "<th></th>";
}

// Convert string dates in the format "DD.MM.YYYY" to Date object
function convertStrDateDottedDMYToDateObj(dateStr)
{
  let day = Number(dateStr.slice(0, 2));
  let month = Number(dateStr.slice(3, 5)) - 1;
  let year = Number(dateStr.slice(6));
  return new Date(year, month, day);
}

// Check if 2 dates are the same by checking their MonthDay(date), month and year
function areSameDate(dateObj1, dateObj2)
{
  if (dateObj1.getFullYear() == dateObj2.getFullYear())
  {
    if (dateObj1.getMonth() == dateObj2.getMonth())
    {
      if (dateObj1.getDate() == dateObj2.getDate())
      {
        return true;
      }
    }
  }
  return false;
}

// Onclick event function for record cells
function recordCellClick(event)
{
  let recordCell = event.target;
  let agendaTableHeadDates = agendaTableHeadDateRow.getElementsByTagName("th");
  let curHeadDate = agendaTableHeadDates[recordCell.cellIndex];
  let curDateObj = convertStrDateDottedDMYToDateObj(curHeadDate.innerHTML);
  let curRow = recordCell.parentElement;
  if (recordCell.style.backgroundColor == "transparent")
  {
    // If the record cell is empty => backgroundColor == "transparent"
    let res = confirm("Abonelik mi?");
    if (res)
    {
      // Weekly Subscription
      recordCell.style.backgroundColor = "blue";

      // Set current week day in the subscription days arr to true
      let curWeekDay = curDateObj.getDay();
      subscriptionDaysArr[curRow.rowIndex - 2][curWeekDay] = true;

      // Change color of the other same weekday cells
      // For the first time use indexes, then it will be automatic
      let curRowDatas = curRow.getElementsByTagName("td");
      // cellIndex property counts hour cells too
      // curRowDatas only counts record cells
      let tmpCellIdx = recordCell.cellIndex - 7;
      while (tmpCellIdx > 0)
      {
        curRowDatas[tmpCellIdx - 1].style.backgroundColor = "blue";
        tmpCellIdx -= 7;
      }
      tmpCellIdx = recordCell.cellIndex + 7;
      while (tmpCellIdx <= totalDatesInAgenda)
      {
        curRowDatas[tmpCellIdx - 1].style.backgroundColor = "blue";
        tmpCellIdx += 7;
      }
      // Delete from the deleted subscriptions if this date is deleted before
      let curDeletedSubscriptions = deletedSubscriptionsArr[curRow.rowIndex - 2];
      for (let i = 0; i < curDeletedSubscriptions.length; i++)
      {
        if (areSameDate(curDateObj, curDeletedSubscriptions[i]))
          curDeletedSubscriptions.splice(i, 1);
      }
    }
    else
    {
      // Single record
      recordCell.style.backgroundColor = "lightblue";
      singleRecDatesArr[curRow.rowIndex - 2].push(curDateObj);
    }
  }
  else
  {
    let res = confirm("Silinsin mi?");
    if (res)
    {
      // Deletion
      if (recordCell.style.backgroundColor == "blue")
      {
        // Weekly subscription = blue
        let res2 = confirm("Abonelik silinsin mi?");
        if (res2)
        {
          let curSubscriptionDays = subscriptionDaysArr[curRow.rowIndex - 2];
          curSubscriptionDays[curDateObj.getDay()] = false;
          // Clear color of the other same weekday cells
          // For the first time use indexes, then it will be automatic
          let curRowDatas = curRow.getElementsByTagName("td");
          // cellIndex property counts hour cells too
          // curRowDatas only counts record cells
          let tmpCellIdx = recordCell.cellIndex - 7;
          while (tmpCellIdx > 0)
          {
            if (curRowDatas[tmpCellIdx - 1].style.backgroundColor == "blue")
              curRowDatas[tmpCellIdx - 1].style.backgroundColor = "transparent";
            tmpCellIdx -= 7;
          }
          tmpCellIdx = recordCell.cellIndex + 7;
          while (tmpCellIdx <= totalDatesInAgenda)
          {
            if (curRowDatas[tmpCellIdx - 1].style.backgroundColor == "blue")
              curRowDatas[tmpCellIdx - 1].style.backgroundColor = "transparent";
            tmpCellIdx += 7;
          }
        }
        else
        {
          // Delete single record
          let curDeletedSubscriptions = deletedSubscriptionsArr[curRow.rowIndex - 2];
          curDeletedSubscriptions.push(curDateObj);
        }
      }
      else
      {
        // light-blue
        // Delete single record
        let curSingleRecDates = singleRecDatesArr[curRow.rowIndex - 2];
        for (let i = 0; i < curSingleRecDates.length; i++)
        {
          if (areSameDate(curDateObj, curSingleRecDates[i]))
            curSingleRecDates.splice(i, 1);
        }
      }
      recordCell.style.backgroundColor = "transparent";
    }
  }
}

// Create and insert th for hours from 08.00 to 16.00 to agenda table
function createAgendaTableHourRows()
{
  let agendaTableBody = agendaTable.getElementsByTagName("tbody")[0];
  for (let i = 0; i < hoursCount; i++)
  {
    let curHourStr = "";
    let curHour = i + 8;
    // Add a zero to the front of one digit hours
    if (Math.floor(curHour / 10) == 0)
      curHourStr += "0";
    curHourStr += curHour;
    curHourStr += ":00";

    let curHourRow = agendaTableBody.insertRow(i);
    curHourRow.insertCell(0).outerHTML = "<th>" + curHourStr + "</th>";

    for (let i = 1; i < 21; i++)
    {
      let newCell = document.createElement("td");
      newCell.style.cursor = "pointer";
      newCell.style.backgroundColor = "transparent";
      newCell.onclick = function() {recordCellClick(event)};
      curHourRow.appendChild(newCell);
    }
  }
}

// Initialize HTML elements here by calling functions
createAgendaDatesInTHead();
createAgendaTableHourRows();
