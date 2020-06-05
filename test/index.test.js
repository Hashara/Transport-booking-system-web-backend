const test = require('firebase-functions-test')({
    databaseURL: process.env.DATABASE,
    // storageBucket: 'my-project.appspot.com',
    projectId:  process.env.FIREBASE_PROJECT_ID,
  }, '../serviceAccountKey.json');

test.mockConfig({ stripe: { key: '23wr42ewr34' }});

const functions = require('firebase-functions');
const key = functions.config().stripe.key;

// Mock functions config values

// after firebase-functions-test has been initialized
const myFunctions = require('../index.js'); // relative path to functions code