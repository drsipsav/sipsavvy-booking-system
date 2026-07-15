// travelFeeEngine.js — clean public API

async function onUserSelectedLocation({ origin, destination }) {
  await recalcTravelFromLocation({ origin, destination });
}
