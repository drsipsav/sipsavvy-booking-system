// generateDistances.js
import fetch from "node-fetch";

const API_KEY = "AIzaSyBV0hILvm0HRmTLcb9W7eyXayNj54GSOu0";
const ORIGIN = "12336 Sandstone Street, Waldorf, MD 20601";

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

/*  "upper-chesapeake": {
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
  },  */

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

async function getMilesTo(destination) {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    ORIGIN
  )}&destinations=${encodeURIComponent(destination)}&units=imperial&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const element = data.rows?.[0]?.elements?.[0];
  if (!element || element.status !== "OK") return null;

  return parseFloat(element.distance.text.replace("mi", "").trim());
}

async function buildDistanceMap() {
  const result = {};

  for (const [region, counties] of Object.entries(TRAVEL_LOCATIONS)) {
    result[region] = {};

    for (const [countyName, cities] of Object.entries(counties)) {
      for (const city of cities) {
        const destination = `${city}, ${countyName}, MD`;

        const miles = await getMilesTo(destination);
        if (miles == null) continue;

const safeCity = city.replace(/"/g, '\\"');

result[region][safeCity] = {
  county: countyName,
  miles: miles
};

        };

        console.log(`✔ ${destination} → ${miles} miles`);
        await new Promise(r => setTimeout(r, 200)); // throttle
      }
    }
  }

  console.log("\n\nwindow.TRAVEL_LOCATIONS_WITH_MILES = ");
  console.log(JSON.stringify(result, null, 2));
}

buildDistanceMap();
