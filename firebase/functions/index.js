const bookingTriggers = require("./bookingTriggers");

exports.bookingCreated = bookingTriggers.bookingCreated;
exports.paymentUpdated = bookingTriggers.paymentUpdated;
exports.bookingCancelled = bookingTriggers.bookingCancelled;
exports.eventReminder = bookingTriggers.eventReminder;

const testHarness = require("./testHarness");

exports.testEmail = testHarness.testEmail;
exports.injectTestBooking = testHarness.injectTestBooking;
