const agenda = require('./agendaInstance');
const defineJobs = require('./agendaJobs');

const startAgenda = async () => {
  defineJobs();            // define all jobs
  await agenda.start();    // start agenda processing
  console.log('✅ Agenda started');
};

module.exports = startAgenda;
