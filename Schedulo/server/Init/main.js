const mongoose = require('mongoose');
const dummyEvents = require('./dummyevents');
const Event = require('../models/event');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Schedulo');
  console.log('Connected to mongodb!');
}

const initializeDb = async () => {
  await main();

  // Define fixed ObjectIds for host/owner and cohost
  const fixedOwnerId = new mongoose.Types.ObjectId('6863b5ef8844b207c42f12ca');
  const fixedCohostId = new mongoose.Types.ObjectId('6862dfb5326036247d28fa56');

  // Rewrite dummyEvents with fixed host, owner, and cohosts
  const updatedEvents = dummyEvents.map(event => ({
    ...event,
    host: fixedOwnerId,
    owner: fixedOwnerId,
    cohosts: [fixedCohostId]
  }));

  await Event.deleteMany({});
  await Event.insertMany(updatedEvents);
  console.log('Dummy Data Initialized in database!');
};

initializeDb();