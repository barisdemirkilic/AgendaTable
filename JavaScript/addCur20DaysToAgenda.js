const DateUpdateModes = {"Today":0, "PrevWeek":1, "PrevDay":2, "NextDay":3, "NextWeek":4};

// Global start date holder
let agendaStartDate = new Date();

// Get the string version ("D.M.Y") of the given date object
function getStrDateDottedDMY(dateObj)
{
  let dateStr = "";
  let dayOfTheMonth = dateObj.getDate();
  // Add a zero to the front of one digit days
  if (Math.floor(dayOfTheMonth / 10) == 0)
    dateStr += "0";
  dateStr += dayOfTheMonth;
  dateStr += ".";
  // Months start from 0 index (January = 0)
  let monthNo = dateObj.getMonth() + 1;
  // Add a zero to the front of one digit months
  if (Math.floor(monthNo / 10) == 0)
    dateStr += "0";
  dateStr += monthNo;
  dateStr += ".";
  dateStr += dateObj.getFullYear();
  return dateStr;
}

// Fill Agenda's table head dates according to the startDateObj
function fillAgendaDateHeadCells(startDateObj, agendaTableHeadDates)
{
  let tmpDate = new Date(startDateObj);
  // +1 because of the empty cell at the start of the header
  for (let i = 1; i < totalDatesInAgenda + 1; i++)
  {
    let curTableHeadDate = agendaTableHeadDates[i];
    curTableHeadDate.innerHTML = getStrDateDottedDMY(tmpDate);
    if (i < totalDatesInAgenda) // No need to increment the date in the last iteration
      tmpDate.setDate(tmpDate.getDate() + 1);
  }
}

// Convert all the record cell's backgroundColor to transparent
function clearAllCellColors(agendaTableBodyRows)
{
  for (let i = 0; i < hoursCount; i++)
  {
    let curRow = agendaTableBodyRows[i];
    let curRowDatas = curRow.getElementsByTagName("td");
    for (let j = 0; j < totalDatesInAgenda; j++)
      curRowDatas[j].style.backgroundColor = "transparent";
  }
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

function updateCellColors(agendaTableBodyRows, agendaTableHeadDates)
{
  for (let i = 0; i < hoursCount; i++)
  {
    let curSingleRecDates = singleRecDatesArr[i]; // This hour's single records
    let curSubscriptionDays = subscriptionDaysArr[i]; // This hour's subscription weekdays
    let curDeletedSubscriptions = deletedSubscriptionsArr[i]; // This hour's deleted subscription dates
    let curRow = agendaTableBodyRows[i];
    let curRowDatas = curRow.getElementsByTagName("td");
    for (let j = 0; j < totalDatesInAgenda; j++)
    {
      let curHeadDate = agendaTableHeadDates[j + 1]; // Head dates array includes one empty cell
      let curDateObj = convertStrDateDottedDMYToDateObj(curHeadDate.innerHTML);

      let bDealedWithTheCurrentCell = false; // This is used to continue with the next record cell
      // Hash table can be used instead of these loops
      // First check single records filling the record cells
      for (let k = 0; k < curSingleRecDates.length; k++)
      {
        if (areSameDate(curDateObj, curSingleRecDates[k]))
        {
          curRowDatas[j].style.backgroundColor = "lightblue";
          bDealedWithTheCurrentCell = true;
          break;
        }
      }
      if (bDealedWithTheCurrentCell)
        continue;
      for (let k = 0; k < curDeletedSubscriptions.length; k++)
      {
        if (areSameDate(curDateObj, curDeletedSubscriptions[k]))
        {
          bDealedWithTheCurrentCell = true;
          break;
        }
      }
      if (bDealedWithTheCurrentCell)
        continue;
      if (curSubscriptionDays[curDateObj.getDay()])
        curRowDatas[j].style.backgroundColor = "blue";
    }
  }
}

// Update the agenda table dates
// Default is starting from today
function updateAgendaDates(updateMode = DateUpdateModes["Today"])
{
  let agendaTable = document.getElementById("agendaTable");
  let agendaTableHead = agendaTable.getElementsByTagName("thead")[0];
  let agendaTableHeadDates = agendaTableHead.getElementsByTagName("tr")[1].getElementsByTagName("th");
  let agendaTableBody = agendaTable.getElementsByTagName("tbody")[0];
  let agendaTableBodyRows = agendaTableBody.getElementsByTagName("tr");

  clearAllCellColors(agendaTableBodyRows);

  // Switch-case can also be used here
  if (updateMode == DateUpdateModes["Today"]) // Today
  {
    agendaStartDate = new Date();
    fillAgendaDateHeadCells(agendaStartDate, agendaTableHeadDates);
    for (let i = 0; i < hoursCount; i++)
    {
      deletedSubscriptionsArr[i] = new Array();
      subscriptionDaysArr[i] = new Array(false, false, false, false, false, false, false);
      singleRecDatesArr[i] = new Array();
    }
  }
  else
  {
    if (updateMode == DateUpdateModes["PrevWeek"]) // Previous Week
      agendaStartDate.setDate(agendaStartDate.getDate() - 7);
    else if (updateMode == DateUpdateModes["PrevDay"]) // Previous Day
      agendaStartDate.setDate(agendaStartDate.getDate() - 1);
    else if (updateMode == DateUpdateModes["NextDay"]) // Next Day
      agendaStartDate.setDate(agendaStartDate.getDate() + 1);
    else if (updateMode == DateUpdateModes["NextWeek"]) // Next Week
      agendaStartDate.setDate(agendaStartDate.getDate() + 7);
    fillAgendaDateHeadCells(agendaStartDate, agendaTableHeadDates);
    updateCellColors(agendaTableBodyRows, agendaTableHeadDates);
  }
}

// When the page is loaded, 20 days starting from today is added to the agenda
updateAgendaDates();
