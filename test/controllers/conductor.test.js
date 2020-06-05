// var proxyquire      = require('proxyquire');
var httpMocks       = require('node-mocks-http');
var sinon           = require('sinon');
var expect          = require('chai').use(require('sinon-chai')).expect;
// var firebasemock    = require('firebase-mock');
// const test = require('firebase-functions-test')();
var admin = require('firebase-admin')
var serviceAccount = require('../../serviceAccountKey.json')
// admin.initializeApp({credential: admin.credential.cert(serviceAccount),})



describe('Booking controller', function () {
  beforeEach(function() {
    
    conductor = require('../../controllers/conductor')
    
  });

  it('email should be taken', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/addconductor`,
      params:{
          uid:"123"
      },
      body:{
        "firstName":"T.L.", 
        "secondName":"Sumanasiri", 
        "email":"conductor@domain.com",
        "phoneNumber":"+94712652723",
        "address":"No 11,Flower road, Colombo",
        "nic":"722678841V"
    }
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    conductor.addConductor(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
    // expect(res.statusCode).to.equal(200);
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(409);
    
        expect(response_message).to.have.property('error').to.equal('Email already exists');
        // done();
      });
  });

 
  it('should no conductor found', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getconductors`,
      params:{
          uid:"123"
      },
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    conductor.ownerGetConductors(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
    // expect(res.statusCode).to.equal(200);
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('message').to.equal('No conductors registered');
        // done();
      });
  });

});


