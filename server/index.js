const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const baseURL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/";

app.get("/stock/:ticker", (req, res) => {
  axios
    .get(
      `${baseURL}${req.params.ticker}?modules=financialData,assetProfile,recommendationTrend`
    )
    .then((response) => res.send(response.data))
    .catch((error) => res.status(404).send({ message: "Ticker not found" }));
});



app.listen(4455, () => console.log("Casting off from PORT: 4455"));
