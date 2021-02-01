// Define global variables
// =======================
var eventArray = JSON.parse(localStorage.getItem("historyArray")) || [];
// =======================

// UI Functions
// =======================

// List building
// -----------------------

function renderCard(event) {
  if (eventArray.indexOf(event.id) >= 0) {
    var buttonText = "Saved";
  } else {
    var buttonText = "Save";
  }
  let localDate = event.dates.start.localDate;
  let time = event.dates.start.localTime
    ? moment(event.dates.start.localTime, "HH:mm:ss").format("hh:mm A")
    : "TBD";
  let template = `
<div class="card-content search-results">
  <div class="content box columns is-mobile">
      <div class="eventDate column is-one-fifth is-size-4">
          <div class="date-month has-text-centered has-text-centered has-text-weight-bold">
              ${moment(localDate, "YYYY/MM/DD").format("MMM")}
              <div class="date-day has-text-centered">
                  ${moment(localDate, "YYY/MM/DD").date()}
              </div>
          </div>
      </div>
      <div class="event-info column is-mobile is-size-6">
          <div class="week-day">
              ${moment(localDate, "YYYY/MM/DD").format("ddd")} - ${time}
              <div class="event-name has-text-weight-bold">
                  ${event.name}
                  <div class="venue-location">${
                    event._embedded.venues[0].name
                  }</div>
              </div>
          </div>
      </div>
      <div class="column is-one-fifth">
          <button class="button is-info is-rounded">See Details</button>
          <button class="button is-info is-inverted save-new-event" id="${
            event.id
          }">${buttonText}</button>
      </div>
  </div>
</div>
  `;
  return template;
}
// -----------------------

// Display Nav Bar
function renderNav() {
  let navBar = `
  <nav class="level is-mobile" >
  <div class="button is-rounded">
    <a class="link is-info" id="homeButton">Home</a>
  </div>
  <div class="level-item">
    <a class="link is-info">LOGO</a>
  </div>
  <div class="button is-rounded">
    <a class="link is-info" id="savedButton">Saved Events</a>
  </div>
</nav>
  `;
  $("body").append(navBar);
}

// -----------------------

// Display search
function renderSearch() {
  let searchPanel = `
  <section class="hero is-light  search-panel">
  <div class="hero-body">
    <div class="columns is-mobile is-centered">
      <h1 class="title is-1 has-text-centered">Find out what's happening in your city!</h1>
    </div>
      <form>
        <div class="field">
          <div class="control columns is-mobile is-centered">
            <div class="search-bar column is-two-thirds is-half-tablet">
              <div class="control has-icons-left">
                <input
                  class="input is-rounded is-large"
                  type="text"
                  placeholder="Enter a Location"
                  id="keyword"
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-map-marker-alt"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="field is-grouped is-grouped-multiline columns is-mobile is-centered"
        >
          <div class="control">
            <label class="label">Start Date</label>
            <div class="control">
              <input class="input" type="date" id="startDate" />
            </div>
          </div>
          <div class="control">
            <label class="label">End Date</label>
            <div class="control">
              <input class="input" type="date" id="endDate" />
            </div>
          </div>
        </div>
        <div class="columns is-mobile is-centered">
          <button
            href=".card-header-title"
            class="button is-rounded"
            id="searchButton"
          >
            Search
          </button>
        </div>
      </form>
  </div>
</section>
  `;
  $("body").append(searchPanel);
}
// -----------------------
// Display Event Details
// -----------------------

// -----------------------

// Display Saved Events
// -----------------------

// -----------------------

// =======================

// Logic functions

// =======================

// Ticketmaster API search function
// -----------------------

// Spotify API artist search function
// -----------------------

// Spotify API Auth Service
function spotifyAuthService() {
  const queryURL = "https://accounts.spotify.com/api/token";
  const clientKey =
    "OTIwMTI1MTA1ODZjNDllY2FjYWRkNjg3MTNjYzdhMmU6MjEzNTg0MTBhMzE4NDJhY2E1Mzc2YTFhMzcyNmJmYTY=";

  return $.ajax({
    url: queryURL,
    method: "POST",
    data: {
      grant_type: "client_credentials",
    },
    headers: {
      Authorization: `Basic ${clientKey}`,
    },
  }).then(function (response) {
    // Return Access Token
    return response.access_token;
  });
}

// Spotify Search Artist by Name
async function spotifyGetArtistService(name) {
  const token = await spotifyAuthService();
  const queryURL = "https://api.spotify.com/v1/search";
  let data;
  $.ajax({
    url: queryURL,
    method: "GET",
    data: {
      q: name,
      type: "artist",
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response);
  });
}

// =======================

// Listeners go down here

// =======================

// Search button listener
// -----------------------

// -----------------------

// Artist profile link listener
// -----------------------

// -----------------------

// =======================

// spotifyGetArtistService();

// renderInitialPage
renderNav();
renderSearch();

$(document).on("click", "#searchButton", function (event) {
  event.preventDefault();
  let queryURLBase =
    "https://app.ticketmaster.com/discovery/v2/events.json?apikey=2wklXXwfJkLzbYFxIvoGSwhehNloF33O&classificationName=music&dmaId=701&sort=date,asc";
  let queryURL = queryURLBase;
  let cityName = $("#keyword").val();
  let startDate = $("#startDate").val();
  let endDate = $("#endDate").val();
  let queryData = {};
  if (startDate) {
    startDate = startDate + "T00:00:00Z";
    queryData.startDateTime = startDate;
    console.log(queryData.startDateTime);
  }

  if (endDate) {
    endDate = endDate + "T00:00:00Z";
    queryData.endDateTime = endDate;
    console.log(queryData.endDateTime);
  }
  if (cityName) {
    queryData.city = cityName;
  }
  $.ajax({
    url: queryURL,
    method: "GET",
    data: queryData,
  }).then(async function (res) {
    let events = await res._embedded.events;
    console.log(events);
    $(".outer-card").empty();
    var eventsHeader = `
      <div class="card outer-card column is-tablet">
        <header class="card-header">
        <p class="card-header-title">Upcoming Events</p>
        </header>
        <div class="card-content box">
          <p class="country is-size-4 has-text-weight-bold">${cityName}</p>
          <p class="eventNumber is-size-6 has-text-weight-medium">
            ${events.length} Events
          </p>
        </div>
      </div>
      `;
    $("body").append(eventsHeader);
    for (i = 0; i < events.length; i++) {
      var eventObj = renderCard(events[i]);
      $(".outer-card").append(eventObj);
    }
  });
});

$(document).on("click", "#savedButton", function (event) {
  event.preventDefault();
  $("body").empty();
  renderNav();
  var savedHeader = `
    <section class="hero is-light search-panel">
      <div class="hero-body">
        <header class="card-header">
          <p class="card-header-title">Saved Events</p>
        </header>
        <div class="card-content box">
          <p class="country is-size-4 has-text-weight-bold">Saved</p>
          <p class="eventNumber is-size-6 has-text-weight-medium">
          ${eventArray.length} Events
          </p>
        </div>
      </div>
    </section>
    `;
  $("body").append(savedHeader);
  for (i = 0; i < eventArray.length; i++) {
    let queryURL =
      "https://app.ticketmaster.com/discovery/v2/events/" +
      eventArray[i] +
      ".json?apikey=2wklXXwfJkLzbYFxIvoGSwhehNloF33O";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(async function (res) {
      console.log(res);
      var response = await res.dates;
      var savedObj = renderCard(res);
      $(".hero-body").append(savedObj);
    });
  }
});

$(document).on("click", ".save-new-event", function (event) {
  event.preventDefault();
  eventArray = JSON.parse(localStorage.getItem("historyArray")) || [];
  var savedEvent = $(this).attr("id");
  if (eventArray != []) {
    if (typeof savedEvent === "string") {
      if (eventArray.indexOf(savedEvent) >= 0) {
        localStorage.clear();
        localStorage.setItem("historyArray", JSON.stringify(eventArray));
      } else {
        localStorage.clear();
        eventArray.splice(0, 0, savedEvent);
        localStorage.setItem("historyArray", JSON.stringify(eventArray));
      }
    }
  } else {
    eventArray.push(savedEvent);
    localStorage.clear();
    localStorage.setItem("historyArray", JSON.stringify(eventArray));
  }
});

$(document).on("click", "#homeButton", function (event) {
  event.preventDefault();
  $("body").empty();
  renderNav();
  renderSearch();
});

// REFACTOR!!!!!!!!! //
// =======================
// Application Service Class Definition
// =======================

class EventService {
  constructor(stateCode, startDate, endDate) {
    this.queryBaseURL =
      "https://app.ticketmaster.com/discovery/v2/events.json?apikey=2wklXXwfJkLzbYFxIvoGSwhehNloF33O&classificationName=music&dmaId=701&sort=date,asc";
    this.API_KEY = "2wklXXwfJkLzbYFxIvoGSwhehNloF33O";

    this.queryData;

    if (stateCode) {
      this.queryData.stateCode = stateCode;
    }

    if (startDate) {
      this.queryData.startDateTime = startDate + "T00:00:00Z";
    }

    if (endDate) {
      this.queryData.endDateTime = endDate + "T00:00:00Z";
    }

    // const events = this.getEvents();
    // this.events = events.map((event) => new Event(event));
  }

  // Fetch Events From TicketMaster API (Returns Promise)
  fetchEvents() {
    return $.ajax({
      url: this.queryBaseURL,
      method: "GET",
      data: {
        stateCode: "SA",
      },
    });
  }

  saveEvent(event) {}
}

// =======================
// Application Controller Class Definition
// =======================

// =======================
// View Component Class Definitions
// =======================
