const travelLocations = {

  /* -----------------------------  
     WASHINGTON, DC  
  ----------------------------- */

  "dc-ne": [
    { city: "Brookland", zip: "20017" },
    { city: "Brentwood", zip: "20018" },
    { city: "Capitol Hill (partly extends into NE)", zip: "20002" },
    { city: "Catholic University of America", zip: "20064" },
    { city: "Deanwood", zip: "20019" },
    { city: "Eckington", zip: "20002" },
    { city: "Fort Totten", zip: "20011" },
    { city: "Gallaudet University", zip: "20002" },
    { city: "H Street Corridor", zip: "20002" },
    { city: "Ivy City", zip: "20002" },
    { city: "Langdon", zip: "20018" },
    { city: "Lamond Riggs", zip: "20011" },
    { city: "Marshall Heights (bordering eastern side)", zip: "20019" },
    { city: "Michigan Park", zip: "20017" },
    { city: "National Arboretum", zip: "20002" },
    { city: "Near Northeast", zip: "20002" },
    { city: "NoMa (North of Massachusetts Avenue)", zip: "20002" },
    { city: "RFK Stadium area", zip: "20003" },
    { city: "Riggs Park", zip: "20011" },
    { city: "Takoma", zip: "20012" },
    { city: "Trinidad", zip: "20002" },
    { city: "Union Market District", zip: "20002" },
    { city: "Union Station", zip: "20002" },
    { city: "Woodridge", zip: "20018" }
  ],

  /* -----------------------------  
     NORTHERN VIRGINIA  
  ----------------------------- */

  "nova": [
    { city: "Alexandria", zip: "22314" },
    { city: "Annandale", zip: "22003" },
    { city: "Arlington", zip: "22201" },
    { city: "Ashburn", zip: "20147" },
    { city: "Burke", zip: "22015" },
    { city: "Capital One headquarters area in Tysons", zip: "22102" },
    { city: "Centreville", zip: "20120" },
    { city: "Chantilly", zip: "20151" },
    { city: "Dale City", zip: "22193" },
    { city: "Fairfax", zip: "22030" },
    { city: "Falls Church", zip: "22046" },
    { city: "Gainesville", zip: "20155" },
    { city: "Herndon", zip: "20170" },
    { city: "Lake Ridge", zip: "22192" },
    { city: "Leesburg", zip: "20175" },
    { city: "Manassas", zip: "20110" },
    { city: "Manassas Park", zip: "20111" },
    { city: "McLean", zip: "22101" },
    { city: "Reston", zip: "20190" },
    { city: "South Riding", zip: "20152" },
    { city: "Springfield", zip: "22150" },
    { city: "Sterling", zip: "20164" },
    { city: "Tysons", zip: "22102" },
    { city: "Vienna", zip: "22180" },
    { city: "Woodbridge", zip: "22191" }
  ],

  /* -----------------------------  
     MARYLAND — NORTHERN COUNTIES  
  ----------------------------- */

  "md-north-cecil": [
    { city: "Calvert", zip: "21921" },
    { city: "Cecilton", zip: "21913" },
    { city: "Chesapeake Bay waterfront areas", zip: "—" },
    { city: "Chesapeake City", zip: "21915" },
    { city: "Charlestown", zip: "21914" },
    { city: "Conowingo", zip: "21918" },
    { city: "Conowingo Dam", zip: "21918" },
    { city: "Elk Neck State Park", zip: "21920" },
    { city: "Elkton", zip: "21921" },
    { city: "Hollywood Casino Perryville", zip: "21903" },
    { city: "North East", zip: "21901" },
    { city: "Perry Point", zip: "21902" },
    { city: "Perryville", zip: "21903" },
    { city: "Port Deposit", zip: "21904" },
    { city: "Rising Sun", zip: "21911" },
    { city: "Zion", zip: "21901" }
  ],

  "md-north-harford": [
    { city: "Abingdon", zip: "21009" },
    { city: "Aberdeen", zip: "21001" },
    { city: "Bel Air", zip: "21014" },
    { city: "Churchville", zip: "21028" },
    { city: "Concord Point", zip: "21078" },
    { city: "Darlington", zip: "21034" },
    { city: "Edgewood", zip: "21040" },
    { city: "Fallston", zip: "21047" },
    { city: "Forest Hill", zip: "21050" },
    { city: "Havre de Grace", zip: "21078" },
    { city: "Jarrettsville", zip: "21084" },
    { city: "Joppatowne", zip: "21085" },
    { city: "Perryman", zip: "21130" },
    { city: "Riverside", zip: "21017" },
    { city: "Street", zip: "21154" }
  ],

  "md-north-frederick": [
    { city: "Adamstown", zip: "21710" },
    { city: "Ballenger Creek", zip: "21703" },
    { city: "Brunswick", zip: "21716" },
    { city: "Camp David (near Thurmont)", zip: "21719" },
    { city: "Catoctin Mountain Park", zip: "21719" },
    { city: "Emmitsburg", zip: "21727" },
    { city: "Fort Detrick", zip: "21702" },
    { city: "Frederick", zip: "21701" },
    { city: "Ijamsville", zip: "21754" },
    { city: "Jefferson", zip: "21755" },
    { city: "Libertytown", zip: "21762" },
    { city: "Middletown", zip: "21769" },
    { city: "Mount Airy", zip: "21771" },
    { city: "Myersville", zip: "21773" },
    { city: "New Market", zip: "21774" },
    { city: "Point of Rocks", zip: "21777" },
    { city: "Rosemont", zip: "21758" },
    { city: "Thurmont", zip: "21788" },
    { city: "Urbana", zip: "21704" },
    { city: "Walkersville", zip: "21793" },
    { city: "Woodsboro", zip: "21798" }
  ],

  "md-north-carroll": [
    { city: "Eldersburg", zip: "21784" },
    { city: "Finksburg", zip: "21048" },
    { city: "Hampstead", zip: "21074" },
    { city: "Linganore (partly associated with Frederick County regionally)", zip: "21774" },
    { city: "Manchester", zip: "21102" },
    { city: "McDaniel College", zip: "21157" },
    { city: "Middleburg", zip: "21757" },
    { city: "Mount Airy", zip: "21771" },
    { city: "New Windsor", zip: "21776" },
    { city: "Sykesville", zip: "21784" },
    { city: "Taneytown", zip: "21787" },
    { city: "Taylorsville", zip: "21784" },
    { city: "Union Bridge", zip: "21791" },
    { city: "Westminster", zip: "21157" },
    { city: "Woodbine", zip: "21797" }
  ],

  /* -----------------------------  
     MARYLAND — CENTRAL COUNTIES  
  ----------------------------- */

  "md-central-howard": [
    { city: "Clarksville", zip: "21029" },
    { city: "Columbia", zip: "21044" },
    { city: "Dayton", zip: "21036" },
    { city: "Elkridge", zip: "21075" },
    { city: "Ellicott City", zip: "21043" },
    { city: "Fulton", zip: "20759" },
    { city: "Highland", zip: "20777" },
    { city: "Hickory Ridge", zip: "21044" },
    { city: "Ilchester", zip: "21043" },
    { city: "Jessup", zip: "20794" },
    { city: "Kings Contrivance", zip: "21046" },
    { city: "North Laurel", zip: "20723" },
    { city: "Oakland Mills", zip: "21045" },
    { city: "River Hill", zip: "21044" },
    { city: "Savage", zip: "20763" },
    { city: "Scaggsville", zip: "20723" },
    { city: "Sykesville (Howard County portion)", zip: "21784" },
    { city: "Wilde Lake", zip: "21044" }
  ],

  "md-central-annearundel": [
    { city: "Annapolis", zip: "21401" },
    { city: "Arnold", zip: "21012" },
    { city: "Crofton", zip: "21114" },
    { city: "Davidsonville", zip: "21035" },
    { city: "Edgewater", zip: "21037" },
    { city: "Ferndale", zip: "21061" },
    { city: "Glen Burnie", zip: "21061" },
    { city: "Highland Beach", zip: "21403" },
    { city: "Lake Shore", zip: "21122" },
    { city: "Laurel (Anne Arundel portion)", zip: "20724" },
    { city: "Linthicum", zip: "21090" },
    { city: "Maryland City", zip: "20724" },
    { city: "Mayo", zip: "21037" },
    { city: "Odenton", zip: "21113" },
    { city: "Parole", zip: "21401" },
    { city: "Pasadena", zip: "21122" },
    { city: "Riviera Beach", zip: "21122" },
    { city: "Severn", zip: "21144" },
    { city: "Severna Park", zip: "21146" }
  ],

  "md-central-montgomery": [
    { city: "Aspen Hill", zip: "20906" },
    { city: "Barnesville", zip: "20838" },
    { city: "Bethesda", zip: "20814" },
    { city: "Brookeville", zip: "20833" },
    { city: "Burtonsville", zip: "20866" },
    { city: "Chevy Chase", zip: "20815" },
    { city: "Chevy Chase Section Five", zip: "20815" },
    { city: "Chevy Chase Section Three", zip: "20815" },
    { city: "Chevy Chase View", zip: "20815" },
    { city: "Clarksburg", zip: "20871" },
    { city: "Damascus", zip: "20872" },
    { city: "Gaithersburg", zip: "20877" },
    { city: "Garrett Park", zip: "20896" },
    { city: "Germantown", zip: "20874" },
    { city: "Glen Echo", zip: "20812" },
    { city: "Kensington", zip: "20895" },
    { city: "Laytonsville", zip: "20882" },
    { city: "Martin’s Additions", zip: "20815" },
    { city: "Montgomery Village", zip: "20886" },
    { city: "North Bethesda", zip: "20852" },
    { city: "North Chevy Chase", zip: "20815" },
    { city: "Olney", zip: "20832" },
    { city: "Poolesville", zip: "20837" },
    { city: "Potomac", zip: "20854" },
    { city: "Rockville", zip: "20850" },
    { city: "Silver Spring", zip: "20910" },
    { city: "Somerset", zip: "20815" },
    { city: "Takoma Park", zip: "20912" },
    { city: "Washington Grove", zip: "20880" },
    { city: "Wheaton", zip: "20902" }
  ],

  /* -----------------------------  
     MARYLAND — SOUTHERN COUNTIES  
  ----------------------------- */

  "md-south-calvert": [
    { city: "Broomes Island", zip: "20615" },
    { city: "Calvert Cliffs", zip: "20685" },
    { city: "Calvert Cliffs State Park", zip: "20685" },
    { city: "Chesapeake Bay waterfront living", zip: "—" },
    { city: "Chesapeake Beach", zip: "20732" },
    { city: "Cove Point", zip: "20657" },
    { city: "Dunkirk", zip: "20754" },
    { city: "Huntingtown", zip: "20639" },
    { city: "Lusby", zip: "20657" },
    { city: "North Beach", zip: "20714" },
    { city: "Owings", zip: "20736" },
    { city: "Port Republic", zip: "20676" },
    { city: "Prince Frederick — county seat", zip: "20678" },
    { city: "Solomons", zip: "20688" },
    { city: "Solomons Island", zip: "20688" },
    { city: "St. Leonard", zip: "20685" },
    { city: "Sunderland", zip: "20689" }
  ],

  "md-south-charles": [
    { city: "Accokeek", zip: "20607" },
    { city: "Bel Alton", zip: "20611" },
    { city: "Bensville", zip: "20603" },
    { city: "Bryans Road", zip: "20616" },
    { city: "Cobb Island", zip: "20625" },
    { city: "Hughesville", zip: "20637" },
    { city: "Indian Head", zip: "20640" },
    { city: "La Plata", zip: "20646" },
    { city: "Mallows Bay", zip: "20662" },
    { city: "Mallows Bay-Potomac River National Marine Sanctuary", zip: "20662" },
    { city: "Marbury", zip: "20658" },
    { city: "Morgantown", zip: "20660" },
    { city: "Nanjemoy", zip: "20662" },
    { city: "Naval Support Facility Indian Head", zip: "20640" },
    { city: "Newburg", zip: "20664" },
    { city: "Pomfret", zip: "20675" },
    { city: "Port Tobacco Historic District", zip: "20677" },
    { city: "Port Tobacco Village", zip: "20677" },
    { city: "St. Charles", zip: "20602" },
    { city: "Waldorf", zip: "20601" },
    { city: "White Plains", zip: "20695" }
  ],

  "md-south-stmarys": [
    { city: "Avenue", zip: "20609" },
    { city: "Bushwood", zip: "20618" },
    { city: "Callaway", zip: "20620" },
    { city: "California", zip: "20619" },
    { city: "Charlotte Hall", zip: "20622" },
    { city: "Dameron", zip: "20628" }