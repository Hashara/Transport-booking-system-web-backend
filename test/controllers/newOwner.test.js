// var proxyquire      = require('proxyquire');
var httpMocks       = require('node-mocks-http');
var sinon           = require('sinon');
var expect          = require('chai').use(require('sinon-chai')).expect;
// var firebasemock    = require('firebase-mock');
// const test = require('firebase-functions-test')();
var admin = require('firebase-admin')
var serviceAccount = require('../../serviceAccountKey.json')
// admin.initializeApp({credential: admin.credential.cert(serviceAccount),})



describe('New owner controller', function () {
  beforeEach(function() {
    
    newOwner = require('../../controllers/newOwner')
    
  });

/*
  it('should send new request', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/sendrequest`,
      body: {
        "name":"===================================================",
        "phoneNumber":"+947852154565", 
        "address":"No 1,Flower road, Colombo"
      
      }
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    newOwner.sendRequest(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');

    res.on('end', function() {
      // console.log( res._getJSONData())
      var response_message = res._getJSONData();
      expect(response_message).to.have.property('message').to.equal('Request send successfully');
      expect(res.statusCode).to.equal(200);
      expect(res._isEndCalled()).to.be.true;
      expect(res._isJSON()).to.be.true;
      // done();
    });
    
  });

  */
  it('should get pending request', function() {
    // mockfirestore.doc('users/123').set({
    //   name: 'bob'
    // });

    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/newrequests`,
      params:{
        uid: "123"
      }
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    newOwner.getPendingOwners(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');

    res.on('end', function() {
     
      var response_message = res._getJSONData();

      // console.log(response_message.newOwners[0])
      expect(response_message.newOwners[0]).to.have.property('status').to.equal('PENDING');

      expect(res.statusCode).to.equal(200);
      expect(res._isEndCalled()).to.be.true;
      expect(res._isJSON()).to.be.true;
      // done();
    });
    
  });

 
  
});


