// var proxyquire      = require('proxyquire');
var httpMocks       = require('node-mocks-http');
var sinon           = require('sinon');
var expect          = require('chai').use(require('sinon-chai')).expect;
// var firebasemock    = require('firebase-mock');
// const test = require('firebase-functions-test')();
var admin = require('firebase-admin')
var serviceAccount = require('../../serviceAccountKey.json')
// admin.initializeApp({credential: admin.credential.cert(serviceAccount),})



describe('New bus controller', function () {
  beforeEach(function() {
    
    newBus = require('../../controllers/newBus')
    
  });

  it('should get routes', function() {
    
    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/newbusrequests`,
      params:{
        uid: 123
      },
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    newBus.getPendingBusRequests(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
    // expect(res.statusCode).to.equal(200);
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('newBusRequests')
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  
 

});


