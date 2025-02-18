const BASE_URL =
  "https://raw.githubusercontent.com/WoXy-Sensei/currency-api/main/api/";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const themeToggle = document.getElementById('theme-toggle');
const moonIcon = themeToggle.querySelector('.fa-moon');
const sunIcon = themeToggle.querySelector('.fa-sun');
const exchangeBtn = document.querySelector("#exchange-btn")

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

exchangeBtn.addEventListener("click", async (evt) => {
  evt.preventDefault();

  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  console.log(`Converting from ${fromCurr.value} to ${toCurr.value}`);

  // ✅ Correct API URL format
  const URL = `${BASE_URL}${fromCurr.value}_${toCurr.value}.json`;
  console.log("Fetching:", URL);

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - File not found`);
    }

    let data = await response.json();
    console.log("Fetched Data:", data); // Debugging

    // ✅ Extract exchange rate correctly
    let rate = data.rate;

    // ✅ Fix if the API returns an inverse rate
    if (rate < 1) {
      rate = 1 / rate; // ✅ Inverts the rate if needed
    }

    console.log(`Exchange Rate: 1 ${fromCurr.value} = ${rate} ${toCurr.value}`);

    // ✅ Display converted amount
    let convertedAmount = (amtVal * rate).toFixed(2);
    document.querySelector(
      ".msg"
    ).innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
  }
});

themeToggle.addEventListener("click", (event) => {
  document.body.classList.toggle('dark-mode');
  
  // Toggle icons
  if (moonIcon.style.display !== 'none') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'inline';
      themeToggle.style.background = 'none';
  } else {
      moonIcon.style.display = 'inline';
      sunIcon.style.display = 'none';            
      themeToggle.style.background = 'none';
  }
});