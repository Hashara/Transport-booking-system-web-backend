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
    
    map = require('../../controllers/map')
    
  });

  it('should get routes', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getroute`,
      body:{
        "origin": "Kurunegala",
       "destination": "Colombo",
       "date":"2020-05-25T07:42:05.750Z"
      }
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    map.getRoutes(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
    // expect(res.statusCode).to.equal(200);
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('routes')
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  
 

});


