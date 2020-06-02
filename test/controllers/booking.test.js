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
    
    booking = require('../../controllers/booking')
    
  });

  it('should not book a seat', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/bookseats`,
      params:{
          uid:123
      },
      body: {
        "seatIdArray":[1,2,23,3,9],
        "turnId":"", 
        "startStation":"", 
        "endStation":""
    }
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    booking.bookSeats(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
    var response_message = res._getJSONData();
    expect(res.statusCode).to.equal(400);

    expect(response_message).to.have.property('error').to.equal('Booking seats must be between 1 - 4');

    
    
  });


  it('should not be able to cancel book the seat', function() {
    
    var req  = httpMocks.createRequest({
      method: 'POST',
      url: `/bookseats`,
      params:{
          uid:123
      },
      body: {
        bookingId: "12312"
    }
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    booking.cancelBooking(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
    var response_message = res._getJSONData();
    expect(res.statusCode).to.equal(400);

    expect(response_message).to.have.property('error').to.equal('Something went wrong');

    
    
  });

  it('should  be no past booking', function() {
    
    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/getpastbookings/123`,
      params:{
          uid:"123"
      },
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    booking.passengerViewPastBooking(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('message').to.equal('No turns found');
        // done();
      });
  });

  it('should  be no active booking', function() {
    
    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/getactivebookings/123`,
      params:{
          uid:"123"
      },
      
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    booking.passengerViewActiveBooking(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        expect(res.statusCode).to.equal(200);
    
        expect(response_message).to.have.property('message').to.equal('No turns found');
        // done();
      });
  });

 
  it('should not be adding to the waiting list', function() {
    
    var req  = httpMocks.createRequest({
      method: 'GET',
      url: `/addtowaiting/`,
      params:{
          uid:"123"
      },
      body:{
        turnId:"IB5CS5JD7foW57HVUVFo 2020-05-22T09:00:00.000Z"
      }
    });
    var res = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    booking.passengerToWaitingList(req, res);
    // var user = JSON.parse(res._getData());
    // expect(user).to.have.property('name').to.equal('bob');
    // console.log(res._getJSONData())
   

    
    res.on('end', function() {
     
        var response_message = res._getJSONData();
        // console.log(res._getJSONData())
        expect(res.statusCode).to.equal(400);
    
        expect(response_message).to.have.property('message').to.equal('You cannot be in waiting list when seats are available');
        // done();
      });
  });
});


