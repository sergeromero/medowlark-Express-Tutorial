describe('Some test', function(){
    it('Is a hello world test', function(){
        console.log(phantomjs);
        //assert(1 === 1);
        //phantom.exit();
    });
});


/*
var Browser = require('webpage');
var assert = require('chai').assert;
var mocha = require('mocha');

var page;

describe('Some test', function(){
    beforeEach(function(){
        page = Browser.create();
    });

    it('Is a hello world test', function(){
        console.log("Hello world");
        assert(1 === 1);
        phantom.exit();
    });
});


describe('Cross-Page Tests', function(){
    beforeEach(function(){
        //page = Browser.create();
    });

    it('requesting a group rate quote from the hood river tour page should populate the referrer field', function(done) {
        var referrer = 'http://localhost:3000/tours/hood-river';
        page.open(referrer, function(status){
            page.evaluate(function(){
                var link = document.getElementsByClassName('requestGroupRate');

                assert(link !== undefined);
                //assert(page.field('referrer').value === referrer);
                done();
                phantom.exit();
            });
        });
        

        var keys = Object.keys(Browser);
        keys.forEach((element) => {
            console.log(element);
        });

        //phantom.exit();
        done();
    });


    test('visiting the "request group rate" page directly results in an empty referrer field', function(){
        page.open('http://localhost:3000/tours/request-group-rate', function(){
            assert(page.field('referrer').value === '');
            done();
        });
        phantom.exit();
    });
    
});
*/