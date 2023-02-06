const financeImg = document.querySelector("#finance-img");
const form = document.querySelector("form");
const input = document.querySelector("input");
const tableBody = document.querySelector("tbody");
const companyInfo = document.querySelector(".company-info h3");
const recTrend = document.getElementById("recommendation-content");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("formSubmit HIT");
  const inputValue = input.value;
  const response = await fetch(`http://localhost:4455/stock/${inputValue}`);
  const data = await response.json();

  const financialData = data.quoteSummary.result[0].financialData;

  const tableFirstRow = `<table>
  <tr>
  <td><h3>Variables and Ratios</h3></td>
  <td><h3>Values</h3></td
  </tr>
</table>`;
  let tableHTML = "";
  for (const key in financialData) {
    tableHTML += `
    <tr>
        <td>${key}</td>
        <td>${financialData[key].fmt}</td>
      </tr>
    `;
  }
  tableBody.innerHTML = tableFirstRow + tableHTML;

  const companyProfile = data.quoteSummary.result[0].assetProfile;
  companyInfo.innerHTML = `
  <h3><center>Company Information</center></h3>
  <hr style="border-top: 1px solid black;">
  <p><b>Address:</b><br>
    ${companyProfile.address1} ${companyProfile.address2}<br>
    ${companyProfile.city}, ${companyProfile.state} ${companyProfile.zip}<br>
    ${companyProfile.country}
  </p>
  <p><b>Phone:</b><br>
    <a style="color: inherit; text-decoration: none;" href="tel:${companyProfile.phone}">
      ${companyProfile.phone}
    </a>
  </p>
  <hr style="border-top: 1px solid black;">
  <br>
  <h3><u>Company Details</u></h3>
  <p><b>Company Name:</b><br> ${companyProfile.companyName}</p>
  <p><b>Exchange:</b><br> ${companyProfile.exchange}</p>
  <p><b>Industry:</b><br> ${companyProfile.industry}</p>
  <p><b>Website:</b><br>
    <a href="${companyProfile.website}" target="_blank">${companyProfile.website}</a>
  </p>
  <p><b>Sector:</b><br> ${companyProfile.sector}</p>
  <p><b>Sub-Industry:</b><br> ${companyProfile.subIndustry}</p>
  <p><b>Full Time Employees:</b><br> ${companyProfile.fullTimeEmployees}</p>
  <hr style="border-top: 1px solid black;">
  <br>
  <h3><u>Description</u></h3>
  <p>${companyProfile.longBusinessSummary}</p>
`;

  const recommendationTrend = data.quoteSummary.result[0].recommendationTrend;
  console.log(recommendationTrend);

  let recHTML = "";
  recommendationTrend.trend.forEach((rec) => {
    recHTML += `
    <section>
    <hr style="border-top: 1px solid black;">
      <h2>Period: ${rec.period}</h2>
      <h4><b>Strong Buy:</b> ${rec.strongBuy}</h4>
      <h4><b>Buy:</b> ${rec.buy}</h4>
      <h4><b>Hold:</b> ${rec.hold}</h4>
      <h4><b>Sell:</b> ${rec.sell}</h4>
      <h4><b>Strong Sell:</b> ${rec.strongSell}</h4>
    </section>
    <br>
  `;
  });

  recTrend.innerHTML = `<br>
  ${recHTML}
`;
});
