const input = document.getElementById("textInput");
const submitButton = document.getElementById("search-button");
const saveButton = document.getElementById("saveAll");
const saveProfileButton = document.getElementById("save");
const timeContainer = document.querySelector("#time-container");
const dateAndTimeContainer = document.querySelector("#date-and-time");
const nyTimeContainer = document.querySelector("#ny-time-container");
const nyDateAndTimeContainer = document.querySelector("#ny-date-and-time");


const originalMoney = 10000;
let money = 10000;
let roundedMoney = (Math.round(money * 100) / 100).toFixed(2);
let wallet = `<h1>Cash</h1><h2>$${roundedMoney}</h2>`;
document.getElementById("wallet").innerHTML = wallet;
console.log(`Wallet: ${roundedMoney}`);
let cardCount = 0;
let portfolioCount = 0;
console.log(`cardCount: ${cardCount}`);
console.log(`portfolioCount: ${portfolioCount}`);
let globalId = 1;


function updateTime() {
  const date = new Date();
  const options = {
    timeZone: "America/Denver",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const mstTime = new Intl.DateTimeFormat("en-US", options).format(date);

  dateAndTimeContainer.innerHTML = `<div class = "digital-clock-container"><h2>${mstTime}</h2><div>`;
}

function updateNyTime() {
  const date = new Date();
  const options = {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const estTime = new Intl.DateTimeFormat("en-US", options).format(date);
  const day = date.getDay();

  const openHours = 7;
  const closedHours = 14;
  const currentHour = date.getHours();
  let marketStatus;
  if (
    day >= 1 &&
    day <= 5 &&
    currentHour >= openHours &&
    currentHour < closedHours
  ) {
    marketStatus =
      "<span style='background: lightgreen; color: #424242; padding: 5px 10px; border-radius: 5px;'>Open</span>";
  } else {
    marketStatus =
      "<span style='background: lightcoral; color: white; padding: 5px 10px; border-radius: 5px;'>Closed</span>";
  }
  nyDateAndTimeContainer.innerHTML = `<div class = "digital-clock-container"><h2>${estTime}</h2><div>`;
  document.getElementById(
    "open-closed"
  ).innerHTML = `<h2><center>Market</center></h2> ${marketStatus}`;
}

async function submitQuery(e) {
  e.preventDefault();
  console.log("submitQuery HIT");
  const inputValue = input.value;


  try {
    const { data } = await axios.get(
    `http://localhost:4455/stock/${inputValue}`
    );
    console.log(data);
    let responseHTML = "";
    if (data.quoteSummary && data.quoteSummary.result) {
      const financialData = data.quoteSummary.result[0].financialData;
      if (financialData) {




        responseHTML += `
        <img src="./png-yahoo-logo-download-4.webp" id="yahoo-image">
        <br>
        <br>
       
        <div id="cardContainer">
       
        <h1>${inputValue}</h1>
       <h2><strong>Price: $${financialData.currentPrice.fmt}</strong></h2>
        <p><strong>Current Ratio:</strong> ${financialData.currentRatio.fmt}</p>
        <p><strong>Quick Ratio:</strong> ${financialData.quickRatio.fmt}</p>
        <p><strong>EBITDA:</strong> $${financialData.ebitda.fmt}</p>
       <p><strong>Total revenue:</strong> $${financialData.totalRevenue.fmt}</p>
      
       <button id = "refresh" class = "cardButton"> <strong>Refresh </strong></button> <button id="moreInfo" class = "cardButton"> <strong>More Info </strong></button> <button id = "addButton" class = "cardButton"> <strong>Purchase </strong></button>
       </div>
        </div>`;
      } else {
        responseHTML += `<p>Financial data not available for this stock</p>;`
}
document.getElementById("response").innerHTML = responseHTML;
}
} catch (error) {
if (error.response.status === 404) {
document.getElementById("response").innerHTML = "Ticker not found";
} else {
document.getElementById("response").innerHTML = "Server error";
}
}
  const addButton = document.getElementById("addButton");
  const refreshButton = document.getElementById("refresh");
  const infoButton = document.getElementById("moreInfo");

  async function refreshCard(e) {
    console.log("refreshButton HIT");

    submitQuery(e);
  }

  async function moreInfoCard(e) {
    e.preventDefault();
    console.log("infoButton HIT");
    window.location.href = "info/info.html";
  }

  async function addCard(e) {
    e.preventDefault();
    console.log("addButton HIT");
    
    cardCount++;
    const inputValue = input.value;
    const res = await axios.get(`http://localhost:4455/stock/${inputValue}`);
    const json = res.data;
    
    if (json.quoteSummary && json.quoteSummary.result) {
    const financialData = json.quoteSummary.result[0].financialData;

        if (financialData) {
          let card = `<center id="center-${globalId}"><td><div id="cardContainerList">
          
          <h2><center>${inputValue}</center></h2>
          <h3 id = 'cardPrice'><center>Value: $${financialData.currentPrice.fmt}</center></h3>
          <div id="cardButtonContainer">
          <button class="cardButton" id="removeButton" card-id="${cardCount}"  onclick="sellFunc('${inputValue}', '${globalId}')"> <strong>Sell </strong></button>          
          </div>
        </div></td><center>`;

          globalId++;
          console.log(`globalId: ${globalId}`);

          let stockCurrentPrice = financialData.currentPrice.fmt;
          console.log(`Purchased ${inputValue} at  ${stockCurrentPrice}`);
          money -= financialData.currentPrice.fmt;
          roundedMoney = (Math.round(money * 100) / 100).toFixed(2);
          if (roundedMoney < 0) {
            roundedMoney = 0;
          } else if (financialData.currentPrice.fmt > money) {
            alert("You don't have enough money");
            return;
          }

          if (roundedMoney < originalMoney) {
            wallet = `<h1>Cash </h1><h2 style="color:red;">$${roundedMoney}</h2>`;
            document.body.style.background = `linear-gradient( rgb(255, 0, 0), rgba(55, 0, 255, 0)), 
              linear-gradient( rgb(0, 255, 0), rgba(253, 1, 1, 0)), 
              linear-gradient( rgb(0, 85, 255), rgba(250, 29, 4, 0.151))`;
            document.body.style.backgroundAttachment = "fixed";
            document.body.style.backgroundSize = "100% 100%";
            document.body.style.display = "flex";
            document.body.style.flexWrap = "wrap";
            document.body.style.justifyContent = "center";
            document.body.style.alignItems = "center";
            document.body.style.height = "90vh";
            document.body.style.margin = 0;
            document.body.style.padding = 0;
          } else {
            wallet = `<h1>Cash </h1><h2>$${roundedMoney}</h2>`;
          }

          document.getElementById("wallet").innerHTML = wallet;

          console.log(`Wallet: ${roundedMoney}`);
          const cardTable = document.getElementById("cardTable");
          const rows = cardTable.getElementsByTagName("tr");

          let lastRow;
          if (rows[rows.length - 1].getElementsByTagName("td").length === 3) {
            lastRow = document.createElement("tr");
            cardTable.appendChild(lastRow);
          } else {
            lastRow = rows[rows.length - 1];
          }

          const newCard = document.createElement("td");
          newCard.innerHTML = card;
          lastRow.appendChild(newCard);
          console.log(`Card count: ${cardCount}`);



          const clearButton = document.getElementById("clearAll");
          async function clearAll(e) {
            e.preventDefault();
            console.log("clearButton HIT");
            newCard.remove();
            cardCount--;
            console.log(`Card count: ${cardCount}`);
          }

          clearButton.addEventListener("click", clearAll);
        }
      
    }
  }
  infoButton.addEventListener("click", moreInfoCard);
  refreshButton.addEventListener("click", refreshCard);
  addButton.addEventListener("click", addCard);
}

async function savePortfolio(e) {
  e.preventDefault();
  console.log("saveButton HIT");
  const cardTable = document.getElementById("cardTable");
  let cardArray = [];
  const cards = cardTable.getElementsByTagName("td");
  for (const card of cards) {
    const stock = card.getElementsByTagName("h2")[0].textContent;
    const price = card.getElementsByTagName("h3")[0].textContent;
    cardArray.push({ stock, price });
  }

  let portfolioTitle = prompt("Name your portfolio: ");
  let portfolio = {};
  portfolio[portfolioTitle] = cardArray;
  console.log("rename success");
  console.log(portfolioTitle);
  console.log(portfolio[portfolioTitle]);
  let newPortfolioCount = portfolioCount + 1;
  let portfolioCard = `<center><td class = 'cardButtonContainer'><div id="cardContainerList">
  <h2><center>${newPortfolioCount}: ${portfolioTitle}</center></h2>
  <button class='cardButton' onclick="window.location.href='./portfolios/portfolios.html'">View</button>
  <div id="cardButtonContainer">
  </div>
</div></td></center>`;

  let td = document.createElement("td");
  td.innerHTML = portfolioCard;

  let portfolioCardTable = document.getElementById("portfolioTable");
  let portfolioRows = portfolioCardTable.getElementsByTagName("tr");

  let portfolioLastRow;
  if (
    portfolioRows[portfolioRows.length - 1].getElementsByTagName("td")
      .length === 3
  ) {
    portfolioLastRow = document.createElement("tr");
    portfolioCardTable.appendChild(portfolioLastRow);
  } else {
    portfolioLastRow = portfolioRows[portfolioRows.length - 1];
  }

  portfolioLastRow.appendChild(td);
  portfolioCount++;
  console.log(`Portfolio Count: ${portfolioCount}`);
}

async function sellFunc(searchParam, id) {
  try {
    const response = await axios.get(`http://localhost:4455/stock/${searchParam}`);
    const json = response.data;
    console.log("json arrived");

    if (json.quoteSummary && json.quoteSummary.result) {
      const financialData = json.quoteSummary.result[0].financialData;
      if (financialData) {
        let newPrice = financialData.currentPrice.fmt;
        console.log(`Sold ${searchParam} at ${newPrice}`);
        console.log(`old money: ${money}`);
        let newMoney = (money += +newPrice).toFixed(2);
        console.log(`new money: ${newMoney}`);

        if (newMoney < originalMoney) {
          wallet = `<h1>Cash </h1><h2 style="color:red;">$${newMoney}</h2>`;
          document.body.style.background = `linear-gradient( rgb(255, 0, 0), rgba(55, 0, 255, 0)), 
          linear-gradient( rgb(0, 255, 0), rgba(253, 1, 1, 0)), 
          linear-gradient( rgb(0, 85, 255), rgba(250, 29, 4, 0.151))`;
          document.body.style.backgroundAttachment = "fixed";
          document.body.style.backgroundSize = "100% 100%";
          document.body.style.display = "flex";
          document.body.style.flexWrap = "wrap";
          document.body.style.justifyContent = "center";
          document.body.style.alignItems = "center";
          document.body.style.height = "90vh";
          document.body.style.margin = 0;
          document.body.style.padding = 0;
        } else {
          wallet = `<h1>Cash </h1><h2 style="color: green;">$${newMoney}</h2>`;
          document.body.style.backgroundImage =
            'url("./yellow-blue-Presentation-Gradient-Background (1).webp")';
          document.body.style.backgroundAttachment = "fixed";
          document.body.style.backgroundSize = "100% 100%";
          document.body.style.display = "flex";
          document.body.style.flexWrap = "wrap";
          document.body.style.justifyContent = "center";
          document.body.style.alignItems = "center";
          document.body.style.height = "90vh";
          document.body.style.margin = 0;
          document.body.style.padding = 0;
        }

     
        document.getElementById("wallet").innerHTML = ``;
        document.getElementById("wallet").innerHTML += wallet;
        cardCount--;
        console.log(`Card count: ${cardCount}`);

        let cardToRemove = document.querySelector(`#center-${id}`);
        cardToRemove.remove();
        if (cardCount === 0) {
          console.log("No more cards, table cleared, row added");

          let table = document.getElementById("cardTable");
          table.innerHTML = '<tr id = "cardTableRow"></tr>';
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}




async function saveProfile(e) {
// Axios.get() in this saveProfile function can only happen if the API get requests have not already been executed
// Fetch API has been removed as a dependency for thi app

// PSUEDO CODE:

// 1. Prevent the default behavior of the event (e.preventDefault())
// 2. Declare variables for username, password, stocks, portfolios, and wallet, and set their values from the respective HTML elements
// 3. Log the data that will be sent to the server (username, password, stocks, portfolios, wallet)
// 4. Make an axios post request to the server with the API endpoint "http://localhost:4455/save-profile/" and pass in an object with the keys and values for username, password, html_table_stocks, html_table_portfolios, and html_wallet.
// 5. If the request is successful, log "Profile saved successfully" and the response data.
// 6. If there is an error, log the error.

  e.preventDefault();
  console.log("saveProfile HIT");
  let username = 'AFTER FETCH gone';
  let password = 'PASS AFTER FETCH gone';
  let stocks = document.getElementById("cardTable").innerHTML;
  let portfolios = document.getElementById("portfolioTable").innerHTML;
  let wallet = document.getElementById("wallet").innerHTML;

  console.log("------------");
  console.log("Sending data to the server");
  console.log("username: ", username);
  console.log("password: ", password);
  console.log("stocks: ", stocks);
  console.log("portfolios: ", portfolios);
  console.log("wallet: ", wallet);

  try {
    const response = await axios.post("http://localhost:4455/save-profile/", {
      username: username,
      password: password,
      html_table_stocks: stocks,
      html_table_portfolios: portfolios,
      html_wallet: wallet
    });
    console.log("Profile saved successfully");
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

setInterval(updateTime, 5000);
updateTime();
setInterval(updateNyTime, 5000);
updateNyTime();
saveButton.addEventListener("click", savePortfolio);
submitButton.addEventListener("click", submitQuery);
saveProfileButton.addEventListener("click", saveProfile);
