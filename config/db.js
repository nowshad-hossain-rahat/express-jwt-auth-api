const mongoose = require('mongoose');

const connect = async (dbUri) => {
  try {
    const dbOptions = {
      dbName: 'angular_app_1'
    };
    await mongoose.connect(dbUri, dbOptions);
    console.log('[+] Connected to Database successfully.');
  } catch (err) {
    console.log(`[!] Error : ${err}`);
  }
};

module.exports = { connect };
