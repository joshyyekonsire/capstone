const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(cors());

const baseURL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/";

const pool = new Pool({
  user: 'cosmicblaze123',
  host: 'db.bit.io',
  database: 'cosmicblaze123/capstone-project', 
  password: 'v2_3ysDp_LwiYyYdeW9HHheAJtgUPcQw', 
  port: 5432,
  ssl: true,
});
pool.query('SELECT username FROM users', (err, res) => {
  console.table(res.rows); 
});

app.post("/save-profile/", async (req, res) => {
  const { username, password, html_table_stocks, html_table_portfolios, html_wallet } = req.body;

  try {
    console.log(req.body)
    await pool.connect();
    await pool.query(
      `INSERT INTO users (username, password, html_table_stocks, html_table_portfolios, html_wallet) VALUES ('${username}', '${password}', '${html_table_stocks}', '${html_table_portfolios}', '${html_wallet}');`
    );
    await pool.end();
  } catch (err) {
    return res.status(500).send({ message: "Error in saving profile" });
  }
  
  res.status(200).send({ message: "Profile saved successfully" });
});

app.get("/stock/:ticker", (req, res) => {
  axios
    .get(
      `${baseURL}${req.params.ticker}?modules=financialData,assetProfile,recommendationTrend`
    )
    .then((response) => res.send(response.data))
    .catch((error) => res.status(404).send({ message: "Ticker not found" }));
});

app.listen(4455, () => console.log("Casting off from PORT: 4455"));
