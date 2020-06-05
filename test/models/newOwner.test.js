// var proxyquire      = require('proxyquire');
// var httpMocks       = require('node-mocks-http');
// var sinon           = require('sinon');
// var expect          = require('chai').use(require('sinon-chai')).expect;
// // var firebasemock    = require('firebase-mock');
// // const test = require('firebase-functions-test')();
// var admin = require('firebase-admin')
// var serviceAccount = require('../../serviceAccountKey.json')
// var firebasemock    = require('firebase-mock');
// var mockauth        = new firebasemock.MockFirebase();
// var mockfirestore   = new firebasemock.MockFirestore();
// var mocksdk         = firebasemock.MockFirebaseSdk(null, function() {
//   return mockauth;
// }, function() {
//   return mockfirestore;
// });

// var newOwnerModel = proxyquire('../../models/newOwner', {
//   'firebase-admin': mocksdk
// });

// // console.log("jo")

// describe('new Owner model', function () {
//   beforeEach(function() {
//     // admin.initializeApp({credential: admin.credential.cert(serviceAccount),})
//     // test.mockConfig({ projectId: 'FakeFirebaseConfig' });
//     // adminInitStub = sinon.stub(admin, 'initializeApp');
//     mockfirestore = new firebasemock.MockFirestore();
//     mockfirestore.autoFlush();
//     mockauth = new firebasemock.MockFirebase();
//     mockauth.autoFlush();
//     // newOwner = require('../../controllers/newOwner')
//     if (null == this.sinon) {
//       this.sinon = sinon.createSandbox();
//     } else {
//       this.sinon.restore();
//     }
//   });

//   // it('should succeed', async function(done) {
//   //   // mockfirestore.doc('users/123').set({
//   //   //   name: 'bob'
//   //   // });

//   //   // MockFirebase.override();
//   //   const sendRequest = await newOwnerModel.saveData('hash','hash','hash','hash')

//   //   sendRequest
//   //   .then(function(doc) {
//   //     console.log("k")
//   //     console.assert(doc.get('name') === 'dvf', 'James was created');
//   //   })
  
//   //   done();

//   // })
//   it('resolves',  () => {
//     return newOwnerModel.saveData('hash','hash','hash','hash')
//     // .resolve(1)
//     .then(() =>{
//       console.log("k")
//       // console.assert(doc.get('name') === 'dvf', 'James was created');
//       // done();
//       // setTimeout(done, 900);
//     })
//   })
// });