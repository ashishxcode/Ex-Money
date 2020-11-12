// Initialize databse
let db = new Localbase('EX-Money',1)

// Get Element Referance
const headingTotal = document.querySelector("#headingTotal");
const inputDesciption = document.querySelector("#inputDesciption");
const inputAmount = document.querySelector("#inputAmount");
const expenseTable = document.querySelector("#expenseTable");
const addExpenseButton = document.querySelector("#addExpenseButton");

let totalExpense = 0;
let expenseArray = [];

// total Expense
headingTotal.textContent = totalExpense;

// Handle addExpenseButton Click Event
addExpenseButton.addEventListener("click", addExpenseToTotal, false);

// Validate Input fields 
function validateInput() {
     document.addEventListener("keypress", function (event) {
      if (event.key === 13) {
        addExpenseToTotal();
      }
    });
}

// Callback function of addExpenseButton
function addExpenseToTotal() {
  // Defining expenseObject
  const expenseObject = {};
  const textAmount = inputAmount.value;
  const textDescription = inputDesciption.value;
  // Getting expense value
  const expenseAmount = parseInt(textAmount, 10);
  
  // Checking not null value
  if (textDescription !== "" && !isNaN(expenseAmount) && expenseAmount > 0) {
      expenseObject.id = new Date().getTime();
      expenseObject.amount = textAmount;
      expenseObject.description = textDescription;
      expenseObject.moment = new Date();
     
      //putting expenseObject into database
      db.collection('expense').add(expenseObject);
  }
  refreshPage()
}

// Reload function
function refreshPage() {
  location.reload();
  inputDesciption.value = "";
  inputAmount.value = "";
}

// Get Date String
function getDateString(momento) {
  return momento.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Load data from local storage
db.collection('expense').get().then(expense => {
  expenseArray = expense;
  updateTotal(expenseArray)
  renderlist(expenseArray);
})

function renderlist(arrOfList) {
  const allExpensesHTML = arrOfList.map(expense =>
    createListItem(expense)
  );
  const joinedAllExpenseHTML = allExpensesHTML.join("");
  expenseTable.innerHTML = joinedAllExpenseHTML;
}

function updateTotal(expense) {
  const expenseAmount  = expense.map(expense =>
    amount  = parseFloat( expense.amount)
  );
  totalExpense = expenseAmount.reduce(function (a, b) {return a + b;}, 0);
  let updateTotal = `Total: ${totalExpense}`;
  headingTotal.textContent = updateTotal;
}

// Delete item
function deleteItem(dateValue, amount) {
  db.collection('expense').doc({ id: dateValue }).delete()
  refreshPage()
}

function createListItem({
description,
amount,
moment
}) {
return `
          <li class="list-group-item d-flex justify-content-between">
                  <div class="d-flex flex-column">
                          ${description}
                      <small class="text-muted">${getDateString(
                        moment
                      )}</small>
                  </div>
                  <div>
                      <span class="px-5">
                              ${amount}
                      </span>
                      <button type="button" class="btn btn-outline-danger btn-sm" onclick="deleteItem(${moment.valueOf()}, ${amount})">
                          <i class="fas fa-trash-alt"></i>
                      </button>
                  </div>
              </li>
          `;
}

db.config.debug = false