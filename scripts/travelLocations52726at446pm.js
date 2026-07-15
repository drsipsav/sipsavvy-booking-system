/* ============================================================
   FULL TRAVEL LOCATION DATASET — CLEAN, FLAT, FINAL VERSION
   ============================================================ */
window.travelLocations = {

  /* ============================================================
     SOUTHERN MARYLAND
  ============================================================ */
  "Southern Maryland": {
    counties: {

      "Charles County": {
        cities: [
          { name: "Waldorf", zips: ["20601","20602","20603"] },
          { name: "La Plata", zips: ["20646"] },
          { name: "White Plains", zips: ["20695"] },
          { name: "Bryans Road", zips: ["20616"] },
          { name: "Indian Head", zips: ["20640"] }
        ]
      },

      "St. Mary's County": {
        cities: [
          { name: "Leonardtown", zips: ["20650"] },
          { name: "California", zips: ["20619"] },
          { name: "Lexington Park", zips: ["20653"] },
          { name: "Mechanicsville", zips: ["20659"] }
        ]
      },

      "Calvert County": {
        cities: [
          { name: "Prince Frederick", zips: ["20678"] },
          { name: "Huntingtown", zips: ["20639"] },
          { name: "Dunkirk", zips: ["20754"] },
          { name: "Owings", zips: ["20736"] }
        ]
      }

    }
  },

  /* ============================================================
     CENTRAL MARYLAND
  ============================================================ */
  "Central Maryland": {
    counties: {

      "Prince George's County": {
        cities: [
          { name: "Upper Marlboro", zips: ["20772","20774"] },
          { name: "Bowie", zips: ["20715","20716","20720","20721"] },
          { name: "Clinton", zips: ["20735"] },
          { name: "Brandywine", zips: ["20613"] },
          { name: "Hyattsville", zips: ["20781","20782","20783","20784","20785"] },
          { name: "Lanham", zips: ["20706"] }
        ]
      },

      "Montgomery County": {
        cities: [
          { name: "Silver Spring", zips: ["20901","20902","20903","20904","20905","20906","20910"] },
          { name: "Rockville", zips: ["20850","20851","20852","20853"] },
          { name: "Gaithersburg", zips: ["20877","20878","20879","20882","20886"] },
          { name: "Bethesda", zips: ["20814","20815","20816","20817"] }
        ]
      },

      "Howard County": {
        cities: [
          { name: "Columbia", zips: ["21044","21045","21046"] },
          { name: "Ellicott City", zips: ["21042","21043"] },
          { name: "Laurel (Howard)", zips: ["20723"] }
        ]
      },

      "Anne Arundel County": {
        cities: [
          { name: "Annapolis", zips: ["21401","21403","21409"] },
          { name: "Glen Burnie", zips: ["21060","21061"] },
          { name: "Severn", zips: ["21144"] },
          { name: "Odenton", zips: ["21113"] }
        ]
      },

      "Frederick County": {
        cities: [
          { name: "Frederick", zips: ["21701","21702","21703"] },
          { name: "Urbana", zips: ["21704"] },
          { name: "Middletown", zips: ["21769"] }
        ]
      }

    }
  },

  /* ============================================================
     BALTIMORE METRO
  ============================================================ */
  "Baltimore Metro": {
    counties: {

      "Baltimore City": {
        cities: [
          { name: "Baltimore", zips: [
            "21201","21202","21205","21206","21207","21209","21210","21211",
            "21212","21213","21214","21215","21216","21217","21218","21223",
            "21224","21225","21226","21229","21230","21231","21239"
          ]}
        ]
      },

      "Baltimore County": {
        cities: [
          { name: "Towson", zips: ["21204","21286"] },
          { name: "Catonsville", zips: ["21228","21229"] },
          { name: "Parkville", zips: ["21234"] },
          { name: "Dundalk", zips: ["21222"] }
        ]
      },

      "Carroll County": {
        cities: [
          { name: "Westminster", zips: ["21157","21158"] },
          { name: "Sykesville", zips: ["21784"] },
          { name: "Eldersburg", zips: ["21784"] }
        ]
      }

    }
  },

  /* ============================================================
     UPPER CHESAPEAKE
  ============================================================ */
  "Upper Chesapeake": {
    counties: {

      "Harford County": {
        cities: [
          { name: "Bel Air", zips: ["21014","21015"] },
          { name: "Aberdeen", zips: ["21001"] },
          { name: "Edgewood", zips: ["21040"] }
        ]
      },

      "Cecil County": {
        cities: [
          { name: "Elkton", zips: ["21921"] },
          { name: "North East", zips: ["21901"] },
          { name: "Perryville", zips: ["21903"] }
        ]
      }

    }
  },

  /* ============================================================
     NORTHERN VIRGINIA (NOVA)
  ============================================================ */
  "NOVA": {
    counties: {

      "Fairfax County": {
        cities: [
          { name: "Fairfax", zips: ["22030","22031","22032"] },
          { name: "Reston", zips: ["20190","20191"] },
          { name: "Herndon", zips: ["20170"] }
        ]
      },

      "Arlington County": {
        cities: [
          { name: "Arlington", zips: ["22201","22202","22203","22204","22205","22206","22207","22209"] }
        ]
      },

      "Alexandria City": {
        cities: [
          { name: "Alexandria", zips: ["22301","22302","22304","22305","22314"] }
        ]
      },

      "Prince William County": {
        cities: [
          { name: "Woodbridge", zips: ["22191","22192","22193"] },
          { name: "Manassas", zips: ["20109","20110","20111"] }
        ]
      },

      "Loudoun County": {
        cities: [
          { name: "Ashburn", zips: ["20147","20148"] },
          { name: "Leesburg", zips: ["20175","20176"] }
        ]
      }

    }
  },

  /* ============================================================
     WASHINGTON DC (QUADRANTS)
  ============================================================ */
  "Washington DC": {
    counties: {
      "Washington DC": {
        cities: [

          { 
            name: "Washington NW",
            zips: [
              "20001","20004","20005","20006","20007","20008",
              "20009","20010","20011","20012","20015","20016",
              "20036","20037"
            ]
          },

          { 
            name: "Washington NE",
            zips: [
              "20002","20017","20018"
            ]
          },

          { 
            name: "Washington SE",
            zips: [
              "20003","20019","20020"
            ]
          },

          { 
            name: "Washington SW",
            zips: [
              "20024","20032"
            ]
          }

        ]
      }
    }
  }

};




  "Southern Maryland": {
    counties: {
      "Charles County": {
        cities: [
          { name: "Waldorf", fee: 0 },
          { name: "La Plata", fee: 0 },
          { name: "White Plains", fee: 0 }
        ]
      },
      "St. Mary's County": {
        cities: [
          { name: "Leonardtown", fee: 0 },
          { name: "California", fee: 0 }
        ]
      },
      "Calvert County": {
        cities: [
          { name: "Prince Frederick", fee: 0 },
          { name: "Huntingtown", fee: 0 }
        ]
      }
    }
  },

  "Central Maryland": {
    counties: {
      "Prince George's County": { cities: [] },
      "Montgomery County": { cities: [] },
      "Howard County": { cities: [] }
    }
  },

  "Baltimore Metro": {
    counties: {
      "Baltimore County": { cities: [] },
      "Baltimore City": { cities: [] }
    }
  },

  "Upper Chesapeake": {
    counties: {
      "Harford County": { cities: [] },
      "Cecil County": { cities: [] }
    }
  },

  "NOVA": {
    counties: {
      "Fairfax County": { cities: [] },
      "Arlington County": { cities: [] },
      "Alexandria City": { cities: [] }
    }
  },

  "Washington DC": {
    counties: {
      "Washington DC": {
        cities: [
          { name: "NW", fee: 0 },
          { name: "NE", fee: 0 },
          { name: "SW", fee: 0 },
          { name: "SE", fee: 0 }
        ]
      }
    }
  }









  /* ============================
     WASHINGTON DC — NW
     ============================ */
  "dc-nw": [
    { city: "Adams Morgan", zip: "20009" },
    { city: "American University Park", zip: "20016" },
    { city: "Brightwood", zip: "20011" },
    { city: "Burleith", zip: "20007" },
    { city: "Cathedral Heights", zip: "20016" },
    { city: "Chevy Chase", zip: "20015" },
    { city: "Cleveland Park", zip: "20008" },
    { city: "Columbia Heights", zip: "20010" },
    { city: "Downtown", zip: "20001" },
    { city: "Dupont Circle", zip: "20036" },
    { city: "Foggy Bottom", zip: "20037" },
    { city: "Friendship Heights", zip: "20015" },
    { city: "Georgetown", zip: "20007" },
    { city: "Glover Park", zip: "20007" },
    { city: "Logan Circle", zip: "20005" },
    { city: "Petworth", zip: "20011" },
    { city: "Shaw", zip: "20001" },
    { city: "Tenleytown", zip: "20016" },
    { city: "U Street Corridor", zip: "20009" },
    { city: "West End", zip: "20037" },
    { city: "Woodley Park", zip: "20008" },
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     WASHINGTON DC — NE
     ============================ */
  "dc-ne": [
    { city: "Brookland", zip: "20017" },
    { city: "Brentwood", zip: "20018" },
    { city: "Capitol Hill", zip: "20002" },
    { city: "Catholic University", zip: "20064" },
    { city: "Deanwood", zip: "20019" },
    { city: "Eckington", zip: "20002" },
    { city: "Fort Totten", zip: "20011" },
    { city: "Gallaudet University", zip: "20002" },
    { city: "H Street Corridor", zip: "20002" },
    { city: "Ivy City", zip: "20002" },
    { city: "Langdon", zip: "20018" },
    { city: "Lamond Riggs", zip: "20011" },
    { city: "Marshall Heights", zip: "20019" },
    { city: "Michigan Park", zip: "20017" },
    { city: "National Arboretum", zip: "20002" },
    { city: "Near Northeast", zip: "20002" },
    { city: "NoMa", zip: "20002" },
    { city: "Riggs Park", zip: "20011" },
    { city: "Takoma", zip: "20012" },
    { city: "Trinidad", zip: "20002" },
    { city: "Union Market", zip: "20002" },
    { city: "Union Station", zip: "20002" },
    { city: "Woodridge", zip: "20018" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     WASHINGTON DC — SE
     ============================ */
  "dc-se": [
    { city: "Anacostia", zip: "20020" },
    { city: "Barracks Row", zip: "20003" },
    { city: "Bellevue", zip: "20032" },
    { city: "Capitol Hill", zip: "20003" },
    { city: "Congress Heights", zip: "20032" },
    { city: "Dupont Park", zip: "20019" },
    { city: "Fairlawn", zip: "20020" },
    { city: "Fort Dupont", zip: "20019" },
    { city: "Garfield Heights", zip: "20020" },
    { city: "Hillcrest", zip: "20020" },
    { city: "Navy Yard", zip: "20003" },
    { city: "Penn Branch", zip: "20020" },
    { city: "Randle Highlands", zip: "20020" },
    { city: "Shipley Terrace", zip: "20032" },
    { city: "Southwest Waterfront", zip: "20024" },
    { city: "Twining", zip: "20020" },
    { city: "Washington Highlands", zip: "20032" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     WASHINGTON DC — SW
     ============================ */
  "dc-sw": [
    { city: "Arena Stage", zip: "20024" },
    { city: "Buzzard Point", zip: "20024" },
    { city: "Fort McNair", zip: "20319" },
    { city: "L’Enfant Plaza", zip: "20024" },
    { city: "National Mall", zip: "20024" },
    { city: "Southwest Federal Center", zip: "20024" },
    { city: "The Wharf", zip: "20024" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     NORTHERN VIRGINIA (NOVA)
     ============================ */
  "nova": [
    { city: "Alexandria", zip: "22314" },
    { city: "Annandale", zip: "22003" },
    { city: "Arlington", zip: "22201" },
    { city: "Ashburn", zip: "20147" },
    { city: "Burke", zip: "22015" },
    { city: "Centreville", zip: "20120" },
    { city: "Chantilly", zip: "20151" },
    { city: "Dale City", zip: "22193" },
    { city: "Fairfax", zip: "22030" },
    { city: "Falls Church", zip: "22046" },
    { city: "Gainesville", zip: "20155" },
    { city: "Herndon", zip: "20170" },
    { city: "Leesburg", zip: "20175" },
    { city: "Manassas", zip: "20110" },
    { city: "McLean", zip: "22101" },
    { city: "Reston", zip: "20190" },
    { city: "Springfield", zip: "22150" },
    { city: "Sterling", zip: "20164" },
    { city: "Tysons", zip: "22102" },
    { city: "Vienna", zip: "22180" },
    { city: "Woodbridge", zip: "22191" },    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }   
  ],

  /* ============================
     MARYLAND — ANNE ARUNDEL
     ============================ */
  "md-anne-arundel": [
    { city: "Annapolis", zip: "21401" },
    { city: "Arnold", zip: "21012" },
    { city: "Crofton", zip: "21114" },
    { city: "Edgewater", zip: "21037" },
    { city: "Glen Burnie", zip: "21061" },
    { city: "Hanover", zip: "21076" },
    { city: "Laurel", zip: "20724" },
    { city: "Millersville", zip: "21108" },
    { city: "Odenton", zip: "21113" },
    { city: "Pasadena", zip: "21122" },
    { city: "Severn", zip: "21144" },
    { city: "Severna Park", zip: "21146" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     MARYLAND — BALTIMORE CITY
     ============================ */
  "md-baltimore-city": [
    { city: "Baltimore", zip: "21201" },
    { city: "Canton", zip: "21224" },
    { city: "Federal Hill", zip: "21230" },
    { city: "Fells Point", zip: "21231" },
    { city: "Hampden", zip: "21211" },
    { city: "Inner Harbor", zip: "21202" },
    { city: "Mount Vernon", zip: "21201" },
    { city: "Patterson Park", zip: "21224" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     MARYLAND — BALTIMORE COUNTY
     ============================ */
  "md-baltimore-county": [
    { city: "Towson", zip: "21204" },
    { city: "Catonsville", zip: "21228" },
    { city: "Pikesville", zip: "21208" },
    { city: "Owings Mills", zip: "21117" },
    { city: "Essex", zip: "21221" },
    { city: "Dundalk", zip: "21222" },
    { city: "Parkville", zip: "21234" },
    { city: "White Marsh", zip: "21162" }, 
        { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     MARYLAND — CARROLL
     ============================ */
  "md-carroll": [
    { city: "Eldersburg", zip: "21784" },
    { city: "Finksburg", zip: "21048" },
    { city: "Mount Airy", zip: "21771" },
    { city: "Sykesville", zip: "21784" },
    { city: "Westminster", zip: "21157" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     MARYLAND — CECIL
     ============================ */
  "md-cecil": [
    { city: "Elkton", zip: "21921" },
    { city: "North East", zip: "21901" },
    { city: "Perryville", zip: "21903" },
    { city: "Rising Sun", zip: "21911" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     MARYLAND — FREDERICK
     ============================ */
  "md-frederick": [
    { city: "Frederick", zip: "21701" },
    { city: "Ballenger Creek", zip: "21703" },
    { city: "Middletown", zip: "21769" },
    { city: "New Market", zip: "21774" },
    { city: "Urbana", zip: "21704" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     MARYLAND — HARFORD
     ============================ */
  "md-harford": [
    { city: "Aberdeen", zip: "21001" },
    { city: "Bel Air", zip: "21014" },
    { city: "Edgewood", zip: "21040" },
    { city: "Fallston", zip: "21047" },
    { city: "Forest Hill", zip: "21050" },
    { city: "Havre de Grace", zip: "21078" }, 
        { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     MARYLAND — HOWARD
     ============================ */
  "md-howard": [
    { city: "Columbia", zip: "21044" },
    { city: "Ellicott City", zip: "21043" },
    { city: "Elkridge", zip: "21075" },
    { city: "Laurel", zip: "20723" },
    { city: "Fulton", zip: "20759" },
    { city: "Clarksville", zip: "21029" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     MARYLAND — MONTGOMERY
     ============================ */
  "md-montgomery": [
    { city: "Silver Spring", zip: "20910" },
    { city: "Bethesda", zip: "20814" },
    { city: "Rockville", zip: "20850" },
    { city: "Gaithersburg", zip: "20877" },
    { city: "Germantown", zip: "20874" },
    { city: "Takoma Park", zip: "20912" },
    { city: "Wheaton", zip: "20902" },
    { city: "Olney", zip: "20832" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     MARYLAND — PG COUNTY
     ============================ */
  "pg-county": [
    { city: "Bowie", zip: "20715" },
    { city: "Clinton", zip: "20735" },
    { city: "College Park", zip: "20740" },
    { city: "Greenbelt", zip: "20770" },
    { city: "Hyattsville", zip: "20782" },
    { city: "Laurel", zip: "20707" },
    { city: "Oxon Hill", zip: "20745" },
    { city: "Suitland", zip: "20746" },
    { city: "Upper Marlboro", zip: "20772" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     MARYLAND — CHARLES
     ============================ */
  "md-charles": [
    { city: "Accokeek", zip: "20607" },
    { city: "Bel Alton", zip: "20611" },
    { city: "Benedict", zip: "20612" },
    { city: "Bryans Road", zip: "20616" },
    { city: "Cobb Island", zip: "20625" },
    { city: "Hughesville", zip: "20637" },
    { city: "Indian Head", zip: "20640" },
    { city: "La Plata", zip: "20646" },
    { city: "Nanjemoy", zip: "20662" },
    { city: "Newburg", zip: "20664" },
    { city: "Pomfret", zip: "20675" },
    { city: "Port Tobacco", zip: "20677" },
    { city: "St. Charles", zip: "20602" },
    { city: "Waldorf", zip: "20601" },
    { city: "White Plains", zip: "20695" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ],

  /* ============================
     MARYLAND — ST. MARY’S
     ============================ */
  "md-stmarys": [
    { city: "California", zip: "20619" },
    { city: "Charlotte Hall", zip: "20622" },
    { city: "Great Mills", zip: "20634" },
    { city: "Hollywood", zip: "20636" },
    { city: "Leonardtown", zip: "20650" },
    { city: "Lexington Park", zip: "20653" },
    { city: "Mechanicsville", zip: "20659" },
    { city: "Piney Point", zip: "20674" },
    { city: "Ridge", zip: "20680" },
    { city: "Valley Lee", zip: "20692" }, 
        { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }  
  ],

  /* ============================
     MARYLAND — CALVERT
     ============================ */
  "md-calvert": [
    { city: "Barstow", zip: "20610" },
    { city: "Broomes Island", zip: "20615" },
    { city: "Chesapeake Beach", zip: "20732" },
    { city: "Dunkirk", zip: "20754" },
    { city: "Huntingtown", zip: "20639" },
    { city: "Lusby", zip: "20657" },
    { city: "North Beach", zip: "20714" },
    { city: "Owings", zip: "20736" },
    { city: "Prince Frederick", zip: "20678" },
    { city: "Solomons", zip: "20688" },
    { city: "St. Leonard", zip: "20685" },
    { city: "Sunderland", zip: "20689" }, 
    { city: "*                  *", zip: "*          *" },
    { city: "*******************",zip: "**************" },
    { city: "*                  *", zip: "*          *" }      
  ]

}; // END travelLocations


const REGIONS = {
  "Southern Maryland": {
    counties: [
      "Charles County",
      "St. Mary's County",
      "Calvert County"
    ],
    cities: [
      "Waldorf", "La Plata", "Hughesville", "White Plains", "Bryans Road", "Indian Head",
      "Leonardtown", "Lexington Park", "California", "Hollywood", "Mechanicsville",
      "Prince Frederick", "Dunkirk", "Owings", "Huntingtown", "Solomons"
    ]
  },

  "Central Maryland": {
    counties: [
      "Prince George's County",
      "Montgomery County",
      "Howard County",
      "Anne Arundel County"
    ],
    cities: [
      "Accokeek", "Brandywine", "Clinton", "Upper Marlboro", "Bowie", "Laurel",
      "Silver Spring", "Rockville", "Bethesda", "Gaithersburg", "Germantown",
      "Columbia", "Ellicott City", "Fulton", "Clarksville",
      "Annapolis", "Glen Burnie", "Severn", "Odenton", "Pasadena"
    ]
  },

  "Baltimore Metro": {
    counties: [
      "Baltimore County",
      "Baltimore City"
    ],
    cities: [
      "Baltimore", "Towson", "Catonsville", "Parkville", "Randallstown"
    ]
  },

  "Upper Chesapeake": {
    counties: [
      "Cecil County",
      "Harford County",
      "Frederick County"
    ],
    cities: [
      "Elkton", "North East", "Perryville", "Rising Sun",
      "Bel Air", "Aberdeen", "Havre de Grace", "Edgewood",
      "Frederick", "Urbana", "Middletown", "Walkersville"
    ]
  },

  "NOVA": {
    counties: [
      "NOVA"
    ],
    cities: [
      "Arlington", "Alexandria", "Fairfax", "Reston", "Herndon", "Ashburn", "Woodbridge" 
    ]
  },

  "Washington DC": {
    counties: [      
      "Washington DC"
    ],
    cities: [
      "NW", "NE", "SE", "SW"
    ]
  }
};

//  

window.travelLocations = {

  /* ============================================================
     SOUTHERN MARYLAND
  ============================================================ */
  "Southern Maryland": {
    counties: {

      "Charles County": {
        cities: [
          { name: "Waldorf", zips: ["20601","20602","20603"] },
          { name: "La Plata", zips: ["20646"] },
          { name: "White Plains", zips: ["20695"] },
          { name: "Bryans Road", zips: ["20616"] },
          { name: "Indian Head", zips: ["20640"] }
        ]
      },

      "St. Mary's County": {
        cities: [
          { name: "Leonardtown", zips: ["20650"] },
          { name: "California", zips: ["20619"] },
          { name: "Lexington Park", zips: ["20653"] },
          { name: "Mechanicsville", zips: ["20659"] }
        ]
      },

      "Calvert County": {
        cities: [
          { name: "Prince Frederick", zips: ["20678"] },
          { name: "Huntingtown", zips: ["20639"] },
          { name: "Dunkirk", zips: ["20754"] },
          { name: "Owings", zips: ["20736"] }
        ]
      }

    }
  },

  /* ============================================================
     CENTRAL MARYLAND
  ============================================================ */
  "Central Maryland": {
    counties: {

      "Prince George's County": {
        cities: [
          { name: "Upper Marlboro", zips: ["20772","20774"] },
          { name: "Bowie", zips: ["20715","20716","20720","20721"] },
          { name: "Clinton", zips: ["20735"] },
          { name: "Brandywine", zips: ["20613"] },
          { name: "Hyattsville", zips: ["20781","20782","20783","20784","20785"] },
          { name: "Lanham", zips: ["20706"] }
        ]
      },

      "Montgomery County": {
        cities: [
          { name: "Silver Spring", zips: ["20901","20902","20903","20904","20905","20906","20910"] },
          { name: "Rockville", zips: ["20850","20851","20852","20853"] },
          { name: "Gaithersburg", zips: ["20877","20878","20879","20882","20886"] },
          { name: "Bethesda", zips: ["20814","20815","20816","20817"] }
        ]
      },

      "Howard County": {
        cities: [
          { name: "Columbia", zips: ["21044","21045","21046"] },
          { name: "Ellicott City", zips: ["21042","21043"] },
          { name: "Laurel (Howard)", zips: ["20723"] }
        ]
      },

      "Anne Arundel County": {
        cities: [
          { name: "Annapolis", zips: ["21401","21403","21409"] },
          { name: "Glen Burnie", zips: ["21060","21061"] },
          { name: "Severn", zips: ["21144"] },
          { name: "Odenton", zips: ["21113"] }
        ]
      },

      "Frederick County": {
        cities: [
          { name: "Frederick", zips: ["21701","21702","21703"] },
          { name: "Urbana", zips: ["21704"] },
          { name: "Middletown", zips: ["21769"] }
        ]
      }

    }
  },

  /* ============================================================
     BALTIMORE METRO
  ============================================================ */
  "Baltimore Metro": {
    counties: {

      "Baltimore City": {
        cities: [
          { name: "Baltimore", zips: [
            "21201","21202","21205","21206","21207","21209","21210","21211",
            "21212","21213","21214","21215","21216","21217","21218","21223",
            "21224","21225","21226","21229","21230","21231","21239"
          ]}
        ]
      },

      "Baltimore County": {
        cities: [
          { name: "Towson", zips: ["21204","21286"] },
          { name: "Catonsville", zips: ["21228","21229"] },
          { name: "Parkville", zips: ["21234"] },
          { name: "Dundalk", zips: ["21222"] }
        ]
      },

      "Carroll County": {
        cities: [
          { name: "Westminster", zips: ["21157","21158"] },
          { name: "Sykesville", zips: ["21784"] },
          { name: "Eldersburg", zips: ["21784"] }
        ]
      }

    }
  },

  /* ============================================================
     UPPER CHESAPEAKE
  ============================================================ */
  "Upper Chesapeake": {
    counties: {

      "Harford County": {
        cities: [
          { name: "Bel Air", zips: ["21014","21015"] },
          { name: "Aberdeen", zips: ["21001"] },
          { name: "Edgewood", zips: ["21040"] }
        ]
      },

      "Cecil County": {
        cities: [
          { name: "Elkton", zips: ["21921"] },
          { name: "North East", zips: ["21901"] },
          { name: "Perryville", zips: ["21903"] }
        ]
      }

    }
  },

  /* ============================================================
     NORTHERN VIRGINIA (NOVA)
  ============================================================ */
  "NOVA": {
    counties: {

      "Fairfax County": {
        cities: [
          { name: "Fairfax", zips: ["22030","22031","22032"] },
          { name: "Reston", zips: ["20190","20191"] },
          { name: "Herndon", zips: ["20170"] }
        ]
      },

      "Arlington County": {
        cities: [
          { name: "Arlington", zips: ["22201","22202","22203","22204","22205","22206","22207","22209"] }
        ]
      },

      "Alexandria City": {
        cities: [
          { name: "Alexandria", zips: ["22301","22302","22304","22305","22314"] }
        ]
      },

      "Prince William County": {
        cities: [
          { name: "Woodbridge", zips: ["22191","22192","22193"] },
          { name: "Manassas", zips: ["20109","20110","20111"] }
        ]
      },

      "Loudoun County": {
        cities: [
          { name: "Ashburn", zips: ["20147","20148"] },
          { name: "Leesburg", zips: ["20175","20176"] }
        ]
      }

    }
  },

  /* ============================================================
     WASHINGTON DC (QUADRANTS)
  ============================================================ */
  "Washington DC": {
    counties: {
      "Washington DC": {
        cities: [

          { 
            name: "Washington NW",
            zips: [
              "20001","20004","20005","20006","20007","20008",
              "20009","20010","20011","20012","20015","20016",
              "20036","20037"
            ]
          },

          { 
            name: "Washington NE",
            zips: [
              "20002","20017","20018"
            ]
          },

          { 
            name: "Washington SE",
            zips: [
              "20003","20019","20020"
            ]
          },

          { 
            name: "Washington SW",
            zips: [
              "20024","20032"
            ]
          }

        ]
      }
    }
  }

};



  /* ============================================================
     MARYLAND
  ============================================================ */
  "maryland": {
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

    "Howard County": [
      "Columbia",
      "Ellicott City",
      "Laurel"
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

    "Baltimore City": [
      "Baltimore"
    ],

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
    ]
  },


  /* ============================================================
     VIRGINIA (Northern VA Only)
  ============================================================ */
  "virginia": {
    "Alexandria City": [
      "Alexandria"
    ],

    "Arlington County": [
      "Arlington"
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


/* ============================================================
   WASHINGTON, DC — 4 QUADRANTS
============================================================ */
"dc": {

  /* ============================
     WASHINGTON DC — NW
     ============================ */
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

  /* ============================
     WASHINGTON DC — NE
     ============================ */
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

  /* ============================
     WASHINGTON DC — SE
     ============================ */
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

  /* ============================
     WASHINGTON DC — SW
     ============================ */
  "Southwest (SW)": [
    "Arena Stage",
    "Buzzard Point",
    "Fort McNair",
    "L’Enfant Plaza",
    "National Mall",
    "Southwest Federal Center",
    "The Wharf"
  ]
},
}












// Tier 2 → Tier 3 (County → City)
countySelect.addEventListener("change", () => {
  const region = regionSelect.value;
  const county = countySelect.value;

  // Reset Tier 3
  citySelect.innerHTML = '<option value="">— Select City —</option>';
  citySelect.disabled = true;

  if (!county) return;

  // ⭐ Pull ONLY the cities inside the selected county
  const cities = REGIONS[region].counties[county];

  // ⭐ Populate Tier 3 with ONLY those cities
  cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  citySelect.disabled = false;
});


