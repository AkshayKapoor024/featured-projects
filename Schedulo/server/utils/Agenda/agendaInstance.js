const { Agenda } = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.ATLASURL, collection: 'agendaJobs' },
  processEvery: '30 seconds',
});

module.exports = agenda;
