/js/
   shared-booking.js      ← totals engine (must load early)
   addons.js              ← stored add-ons (depends on shared-booking)
   travelFee.js           ← live travel fee engine (depends on shared-booking)
   calendar.js            ← calendar module
   timeslots.js           ← timeslot module
   liveClock.js           ← live clock module
   booking.js             ← root initializer (loads last)
