// tools/generateDistances.js
// 🚀 PRO‑GRADE TRAVEL DISTANCE GENERATOR

const fs = require("fs");
const fetch = require("node-fetch");

// CONFIG
const API_KEY = "AIzaSyBmkYxQy5voKEdE0X_EOBI845ZQy4_YsBc";
const ORIGIN = "12336 Sandstone Street, Waldorf, MD 20601";
const OUTPUT_PATH = "scripts/travelLocationsMiles.js";
const CACHE_PATH = "tools/distanceCache.json";
const BATCH_SIZE = 5;          // parallel requests
const THROTTLE_MS = 150;       // delay between batches

// LOAD CACHE
let CACHE = {};
if (fs.existsSync(CACHE_PATH)) {
  CACHE = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  console.log(`✔ Loaded ${Object.keys(CACHE).length} cached distances`);
}

// BASE DATA (YOUR FULL ORIGINAL DATASET)
const TRAVEL_LOCATIONS = {
  "southern-maryland": {
    "Charles County": [
      "Waldorf",
      "La Plata",
      "Hughesville",
      "Bryans Road",
      "Indian Head",
      "Bel Alton",
      "Benedict",
      "Brandywine",
      "Charlotte Hall",
      "Faulkner",
      "Ironsides",
      "Issue",
      "Marbury",
      "Mount Victoria",
      "Nanjemoy",
      "Port Tobacco",
      "Rison",
      "Welcome"
    ],
    "St. Mary's County": [
      "Lexington Park",
      "California",
      "Leonardtown",
      "Mechanicsville",
      "Charlotte Hall",
      "Hollywood",
      "Great Mills",
      "Piney Point",
      "Callaway",
      "Loveville",
      "Morganza",
      "Ridge"
    ],
    "Calvert County": [
      "Prince Frederick",
      "Huntingtown",
      "Dunkirk",
      "Owings",
      "Chesapeake Beach",
      "North Beach",
      "Lusby",
      "Solomons"
    ]
  },

  "central-maryland": {
    "Prince George's County": [
      "Bowie",
      "Upper Marlboro",
      "Clinton",
      "Fort Washington",
      "Oxon Hill",
      "Temple Hills",
      "District Heights",
      "Suitland",
      "Capitol Heights",
      "Hyattsville",
      "College Park",
      "Greenbelt",
      "Lanham",
      "Laurel",
      "Riverdale",
      "Bladensburg",
      "Mount Rainier",
      "Brentwood",
      "Glenn Dale"
    ],
    "Montgomery County": [
      "Bethesda",
      "Chevy Chase",
      "Potomac",
      "Rockville",
      "Gaithersburg",
      "Germantown",
      "Olney",
      "Brookeville",
      "Derwood",
      "Cabin John"
    ],
    "Anne Arundel County": [
      "Annapolis",
      "Glen Burnie",
      "Hanover",
      "Odenton",
      "Severn",
      "Severna Park",
      "Pasadena",
      "Crownsville",
      "Arnold",
      "Gambrills"
    ],
    "Howard County": [
      "Columbia",
      "Ellicott City",
      "Laurel",
      "Clarksville",
      "Dayton",
      "Elkridge",
      "Fulton",
      "Glenelg",
      "Glenwood",
      "Highland",
      "Jessup",
      "Marriottsville",
      "Savage",
      "West Friendship",
      "Woodstock"
    ],
    "Frederick County": [
      "Frederick",
      "Urbana",
      "Middletown",
      "Walkersville",
      "New Market",
      "Thurmont",
      "Brunswick"
    ]
  },

  "baltimore-metro": {
    "Baltimore City": ["Baltimore"],
    "Baltimore County": [
      "Towson",
      "Catonsville",
      "Dundalk",
      "Essex",
      "Middle River",
      "Parkville",
      "Pikesville",
      "Owings Mills",
      "Reisterstown",
      "Lutherville Timonium",
      "Cockeysville",
      "Halethorpe",
      "Rosedale",
      "Nottingham",
      "Sparrows Point",
      "Gwynn Oak"
    ],
    "Carroll County": [
      "Westminster",
      "Eldersburg",
      "Sykesville",
      "Mount Airy",
      "Taneytown",
      "Hampstead",
      "Manchester",
      "New Windsor"
    ]
  },

  "upper-chesapeake": {
    "Harford County": [
      "Bel Air",
      "Aberdeen",
      "Havre de Grace",
      "Edgewood",
      "Joppa",
      "Fallston",
      "Forest Hill"
    ],
    "Cecil County": [
      "Elkton",
      "North East",
      "Perryville",
      "Rising Sun",
      "Chesapeake City"
    ]
  },

  "northern-virginia": {
    "Alexandria": ["Alexandria City"],
    "Arlington County": [
      "Arlington",
      "Rosslyn",
      "Crystal City",
      "Pentagon City",
      "Ballston",
      "Clarendon"
    ],
    "Fairfax County": [
      "Fairfax",
      "McLean",
      "Reston",
      "Herndon",
      "Vienna",
      "Annandale",
      "Burke",
      "Springfield",
      "Falls Church",
      "Lorton",
      "Centreville",
      "Chantilly"
    ],
    "Loudoun County": [
      "Ashburn",
      "Leesburg",
      "Sterling",
      "Aldie",
      "Purcellville"
    ],
    "Prince William County": [
      "Woodbridge",
      "Dumfries",
      "Manassas",
      "Gainesville",
      "Haymarket"
    ]
  },

  "washington-dc": {
    "Northwest (NW)": [
      "Adams Morgan",
      "American University Park",
      "Brightwood",
      "Burleith",
      "Cathedral Heights",
      "Chevy Chase",
      "Cleveland Park",
      "Columbia Heights",
      "Downtown",
      "Dupont Circle",
      "Foggy Bottom",
      "Friendship Heights",
      "Georgetown",
      "Glover Park",
      "Logan Circle",
      "Petworth",
      "Shaw",
      "Tenleytown",
      "U Street Corridor",
      "West End",
      "Woodley Park"
    ],
    "Northeast (NE)": [
      "Brookland",
      "Brentwood",
      "Capitol Hill (NE)",
      "Catholic University",
      "Deanwood",
      "Eckington",
      "Fort Totten",
      "Gallaudet University",
      "H Street Corridor",
      "Ivy City",
      "Langdon",
      "Lamond Riggs",
      "Marshall Heights",
      "Michigan Park",
      "National Arboretum",
      "Near Northeast",
      "NoMa",
      "Riggs Park",
      "Takoma",
      "Trinidad",
      "Union Market",
      "Union Station",
      "Woodridge"
    ],
    "Southeast (SE)": [
      "Anacostia",
      "Barracks Row",
      "Bellevue",
      "Capitol Hill (SE)",
      "Congress Heights",
      "Dupont Park",
      "Fairlawn",
      "Fort Dupont",
      "Garfield Heights",
      "Hillcrest",
      "Navy Yard",
      "Penn Branch",
      "Randle Highlands",
      "Shipley Terrace",
      "Southwest Waterfront (SE)",
      "Twining",
      "Washington Highlands"
    ],
    "Southwest (SW)": [
      "Arena Stage",
      "Buzzard Point",
      "Fort McNair",
      "L’Enfant Plaza",
      "National Mall",
      "Southwest Federal Center",
      "The Wharf"
    ]
  }
};

// GOOGLE API CALL
async function getMiles(destination) {
  if (CACHE[destination]) return CACHE[destination];

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    ORIGIN
  )}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") return null;

  const miles = parseFloat(element.distance.text.replace("mi", "").trim());
  CACHE[destination] = miles;

  fs.writeFileSync(CACHE_PATH, JSON.stringify(CACHE, null, 2));

  return miles;
}

// SAVE FINAL FILE
function saveToFile(result) {
  const output =
    "window.TRAVEL_LOCATIONS = " + JSON.stringify(result, null, 2) + ";";
  fs.writeFileSync(OUTPUT_PATH, output);
  console.log(`\n✔ travelLocationsMiles.js updated\n`);
}

// MAIN BUILDER
async function build() {
  const result = {};
  const tasks = [];

  for (const [region, counties] of Object.entries(TRAVEL_LOCATIONS)) {
    result[region] = {};

    for (const [county, cities] of Object.entries(counties)) {
      for (const city of cities) {
        const destination = `${city}, ${county}, MD`;
        const safeCity = city.replace(/"/g, '\\"');

        tasks.push({ region, county, city: safeCity, destination });
      }
    }
  }

  console.log(`\n📍 Total locations: ${tasks.length}\n`);

  // PROCESS IN BATCHES
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    const batch = tasks.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (t) => {
        const miles = await getMiles(t.destination);
        if (miles == null) {
          console.warn(`✖ Skipped: ${t.destination}`);
          return;
        }

        if (!result[t.region][t.city]) {
          result[t.region][t.city] = {
            county: t.county,
            miles
          };
        }

        console.log(`✔ ${t.destination} → ${miles} miles`);
      })
    );

    await new Promise((r) => setTimeout(r, THROTTLE_MS));
  }

  saveToFile(result);
}

build();
