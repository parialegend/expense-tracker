/**
 * Account.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
	amount: {
    	  type: 'float'
    	}
  },
	/** Update Account Balance **/
	updateBalance: function(options, cb){
		console.log(options);
	  Account.findOne(options.id).exec(function (err, account){
	    if (err) return cb(err);
	    if (!account) return cb(new Error('Account not found.'));
	    console.log(typeof account.amount);
	    account.amount = account.amount + options.amount;
	    account.save(cb);
	  });
	}
};

