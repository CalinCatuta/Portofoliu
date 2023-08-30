let cardContainer = document.querySelector(".card__container");
let jobFilterContainer = document.querySelector(".job-filter__container");
let clearFiltersBtn = document.querySelector(".clear-btn");
let headerContent = document.querySelector(".header-content");
let selectedFilters = [];
let filters;

// Fetch data
async function fetchData() {
  const url = "data.json";
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function displayData() {
  const { result } = await fetchData();
  let displayContent = "";
  result.forEach((card) => {
    displayContent += `
    ${
      card.id === 1 || card.id === 2
        ? `<div class="card card--featured">`
        : `<div class="card ">`
    }
    <img class="card__logo" src=${card.logo} alt="">
    
    <div class="card__body">
    
    <div class="card__top">
    <span>${card.company}</span>
    <span class="tag__container">
    ${card.new === true ? `<span class="tag tag--new">New!</span>` : ``}
    ${
      card.featured === true
        ? `<span class="tag tag--featured">Featured</span>
    </span>`
        : ``
    }

    </div>
    <h1 class="card__header">${card.position}</h1>

    <div class="card__detail">
    <span>${card.postedAt}</span> 
        <span class="circle">&#9679;</span>
        <span>${card.contract}</span>
        <span class="circle">&#9679;</span>
        <span>${card.location}</span>
        </div>

        </div>
        <div class="filter__container">
        <span class="filter">${card.level}</span>
        <span class="filter">${card.role}</span>
        ${card.languages
          .map(
            (lang) => `<span class="filter">${lang}</span
        >`
          )
          .join("")} ${card.tools
      .map(
        (tool) => `<span class="filter">${tool}</span
        >`
      )
      .join("")}
      </div>
</div>`;
  });
  cardContainer.innerHTML = displayContent;
  // add listener for each filter on each card
  filters = document.querySelectorAll(".filter");
  filters.forEach((filter) => {
    filter.addEventListener("click", handleFilterClick);
  });
}
// function for clear btn
function handleClearBtnClick(e) {
  e.target.previousElementSibling.innerHTML = "";
  selectedFilters = [];
  filterCards();

  // hide selected filters container if selectedFilters == []
  if (selectedFilters.length === 0) {
    headerContent.classList.add("invisible");
  }
}
// function for all filter button
function handleFilterClick(e) {
  let filterText = e.target.innerText;
  // If filter is already selected, do nothing
  if (isFilterSelected(filterText)) return;

  // If not, add filter btn and listener (to remove filter)
  if (selectedFilters.length === 0) {
    // unhide selected filters container
    headerContent.classList.remove("invisible");

    jobFilterContainer.innerHTML = constructFilterBtn(filterText);
  } else {
    let lastFilterBtn = jobFilterContainer.lastElementChild;
    lastFilterBtn.insertAdjacentHTML(
      "afterend",
      constructFilterBtn(filterText)
    );
  }
  // add filter to list
  selectedFilters.push(filterText);

  // Handle listener for removing filter
  let removeFilterBtn =
    jobFilterContainer.lastElementChild.querySelector(".remove-filter-btn");
  removeFilterBtn.addEventListener("click", (e) => {
    handleRemoveFilterClick(e, filterText);
  });

  filterCards();
}
// remove the filter function
function handleRemoveFilterClick(e, filterText) {
  e.target.parentElement.remove();
  const filterIndex = selectedFilters.indexOf(filterText);
  selectedFilters.splice(filterIndex, 1); // remove filter from list
  filterCards();

  // hide selected filters container if selectedFilters == []
  if (selectedFilters.length === 0) {
    headerContent.classList.add("invisible");
  }
}
// function to customise cards based on selected filters
function filterCards() {
  const cards = document.querySelectorAll(".card");

  if (selectedFilters.length === 0) {
    const hiddenCards = document.querySelectorAll(".card.hidden");
    hiddenCards.forEach((card) => {
      card.classList.remove("hidden");
    });
    return;
  }

  cards.forEach((card) => {
    if (!hasSelectedFilters(card)) {
      card.classList.add("hidden");
    } else {
      card.classList.remove("hidden");
    }
  });
}
// function to check if card has all the selected filters
function hasSelectedFilters(card) {
  return selectedFilters.every((filter) => hasTag(filter, card));
}
// function to check if a card has a specific tag
function hasTag(tagText, card) {
  const tags = card.querySelectorAll(".filter");
  return Array.from(tags).some((tag) => tag.innerText === tagText);
}

// function to check if a filter is already selected
function isFilterSelected(filterText) {
  return selectedFilters.includes(filterText);
}
function constructFilterBtn(text) {
  return `
    <span class="job-filter">${text} 
        <button class="remove-filter-btn"></button>
    </span>`;
}

// add event
document.addEventListener("DOMContentLoaded", displayData);
clearFiltersBtn.addEventListener("click", handleClearBtnClick);
