// var proxyquire      = require('proxyquire');
var httpMocks       = require('node-mocks-http');
var sinon           = require('sinon');
var expect          = require('chai').use(require('sinon-chai')).expect;
// var firebasemock    = require('firebase-mock');
// const test = require('firebase-functions-test')();
var admin = require('firebase-admin')
var serviceAccount = require('../../serviceAccountKey.json')
// admin.initializeApp({credential: admin.credential.cert(serviceAccount),})



describe('turn controller', function () {
  beforeEach(function() {
    
    turn = require('../../controllers/turn')
    
  });

  it('should get turn by route', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getturnbyroute`,
      body:{
        routeId:"1 Colombo Kandy"
      }
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getTurnByRouteID(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('turns')
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get active turn by conductor', function() {
    
    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/getactiveturns`,
      params:{
        uid:"123"
      }
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getActiveTurnsByConductor(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('turns')
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });
 
  it('should get past turn by conductor', function() {
    
    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/getpastturns`,
      params:{
        uid:"123"
      }
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getActiveTurnsByConductor(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('turns')
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get turn by a trun Id by passenger', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getseatsdetailspassenger`,
      params:{
        uid:"123"
      },
      body:{
        "turnId": "IB5CS5JD7foW57HVUVFo 2020-05-16T09:00:00.000Z",
        
    }
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getSeatsDetailsOfTurnByPassenger(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('message').to.equal('You can not book this bus');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get seat details by conductor', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getseatdetailsbyconductor`,
      params:{
        uid:"123"
      },
      body:{
        "turnId": "IB5CS5JD7foW57HVUVFo 2020-05-16T09:00:00.000Z"
        
    }
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getSeatsDetailsOfTurnByConductor(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('error').to.equal('You don\'t have access');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get passenger of the seat by conductor', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getpassengerfromseat`,
      params:{
        uid:"123"
      },
      body:{
        "turnId": "IB5CS5JD7foW57HVUVFo 2020-05-16T09:00:00.000Z",
        "seatId":"2"
    }
    
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getPassengerOfTheSeatByConductor(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('error').to.equal('You don\'t have access');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get no access to the owner', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getactiveturnsbyowner`,
      params:{
        uid:"123"
      },
      body:{
        "turnId": "IB5CS5JD7foW57HVUVFo 2020-05-16T09:00:00.000Z",
        "seatId":"2"
    }
    
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.ownerViewActiveTurns(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('message').to.equal('You don\'t have access');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get no access to the owner', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getpastturnsbyowner`,
      params:{
        uid:"123"
      },
      body:{
        "turnId": "IB5CS5JD7foW57HVUVFo 2020-05-16T09:00:00.000Z"
    }
    
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.ownerViewPastTurns(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('message').to.equal('You don\'t have access');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get no access to the owner view full details', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getturndetails`,
      params:{
        uid:"123"
      },
      body:{
        "turnId": "IB5CS5JD7foW57HVUVFo 2020-05-16T09:00:00.000Z"
    }
    
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.getFullDetailedTurn(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log("gi")
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('message').to.equal('You dont have access');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });


  it('should get no turn found for owner', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getpastturnsofownerbyadmin`,
      params:{
        uid:"123"
      },
      body:{
        "ownerUid": "123"
    }
    
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.viewPastTurnsUsingOwnerIdByAdmin(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log(res.statusCode)
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('message').to.equal('No past turns found');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });

  it('should get no turn found for owner', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/getpastturnsofownerbyadmin`,
      params:{
        uid:"123"
      },
      body:{
        "ownerUid": "123"
    }
    
 
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    turn.viewActiveTurnsUsingOwnerIdByAdmin(req, res);   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        // console.log(res.statusCode)
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('message').to.equal('No past turns found');
        
        expect(res._isJSON()).to.be.true;
        // done();
      });
  });
});


