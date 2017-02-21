var NewsletterSignup = function(options){
    this.options = options || {};

    this.save = function(fn){
        var rnd = Math.floor(Math.random() * 2) + 1;

        if(rnd === 1) fn();
        else fn({ error: 'Some error' });
    }
};

module.exports = NewsletterSignup;