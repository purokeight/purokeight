// Written by yours truly CrunchyyyLumpia for Vacate These Premises (VTP)
// August 2022

const sheetId = "1c6wGjL5hUGE8T_qBx9F4jPRhaBtnsXH5AwVpzI7cSDo";
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = "VTPGiveawayTracker";
const query = encodeURIComponent("Select *");
const url = `${base}&sheet=${sheetName}&tq=${query}`;

document.addEventListener("DOMContentLoaded", init);

let playerNames = [];
let uniqueNames = [];

async function init() {
  // Fetch google sheet data
  let response = await fetch(url);
  let text = await response.text();
  let jsonText = await JSON.parse(text.substring(47).slice(0, -2));
  //console.log(jsonText);

  // Add names to array
  jsonText.table.rows.forEach((row) => {
    //console.log(row);
    let ticketCount = row.c[2].v;
    while (ticketCount > 0) {
      playerNames.push({ name: row.c[0].v });
      ticketCount--;
    }
    uniqueNames.push({
      name: row.c[0].v,
      gold: row.c[1].v,
      tickets: row.c[2].v,
    });
  });

  createTable(uniqueNames, false);
}

console.log(playerNames);

const drawBtn = document.getElementById("draw");
const winner = document.getElementById("winner_name");

drawBtn.addEventListener("click", (e) => {
  // Scramble names
  let scrambledPlayerNames = scramblePlayerNames(playerNames);
  console.log(scrambledPlayerNames);

  if (scrambledPlayerNames.length === 0) {
    winner.innerText = "There are no more names to choose from";
  } else {
    winner.innerText = `Winner: ${drawName(scrambledPlayerNames)} 🎉🤑`;
      const table = document.querySelector("table");
    table.remove();
    createTable(uniqueNames, false);
  }
});

const drawAgainBtn = document.querySelector("#draw_again");

// drawAgainBtn.addEventListener("click", (e) => {
//   const table = document.querySelector("table");
//   document.querySelector("#winner_name").innerText = "";
//   table.remove();
//   createTable(uniqueNames, false);
// });

// Scramble the player names - returns a scrambled array of the player names
function scramblePlayerNames(playerNames) {
  // Deep copy player names
  let scrambledPlayerNames = JSON.parse(JSON.stringify(playerNames));

  // Scramble aglorithm
  for (
    let currentPlayer = 0;
    currentPlayer < scrambledPlayerNames.length;
    currentPlayer++
  ) {
    const randomIndex = Math.floor(Math.random() * scrambledPlayerNames.length);
    randomPlayer = scrambledPlayerNames[randomIndex];
    scrambledPlayerNames[randomIndex] = scrambledPlayerNames[currentPlayer];
    scrambledPlayerNames[currentPlayer] = randomPlayer;
  }
  return scrambledPlayerNames;
}

// Draw a winning name for the raffle - returns the winning player's name. Removes the winner's
// name from the list. A player may only player once with the tickets they bought.
function drawName(scrambledPlayerNames) {
  const randomIndex = Math.floor(Math.random() * scrambledPlayerNames.length);
  let winner = scrambledPlayerNames[randomIndex].name;

  // Remove winner from global list
  playerNames = playerNames.filter((playerName) => playerName.name !== winner);
  uniqueNames = uniqueNames.filter((player) => player.name !== winner);

  // const drawAgainBtn = document.querySelector("#draw_again");
  // drawAgainBtn.classList.remove("invisible");

  return winner;
}

//const body = document.querySelector("body");
function createTable(playerNames, scrambled) {
  const table = document.createElement("table");

  const headRow = document.createElement("tr");
  const headName = document.createElement("th");
  headName.appendChild(document.createTextNode("Player Name"));
  headRow.appendChild(headName);

  if (!scrambled) {
    const headTickets = document.createElement("th");
    headTickets.classList.add("tickets");
    headTickets.appendChild(document.createTextNode("Tickets"));
    headRow.appendChild(headTickets);
  }

  table.appendChild(headRow);

  playerNames.forEach((player) => {
    const tRow = document.createElement("tr");
    //tRow.classList.add(`${player.name.split(" ").join}`);
    console.log(player.name);
    // const dataList = [];
    for (let key in player) {
      if (key === "gold") {
        continue;
      }
      // console.log(player[key]);
      const tData = document.createElement("td");
      if (key === "tickets") {
        tData.classList.add("tickets");
      }
      const textNode = document.createTextNode(`${player[key]}`);
      tData.appendChild(textNode);
      tRow.appendChild(tData);
    }
    table.appendChild(tRow);
  });

  document.body.appendChild(table);
}
