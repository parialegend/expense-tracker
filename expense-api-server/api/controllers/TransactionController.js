/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create:function(req,res){
	
		console.log(req.body);
		var action = req.body.action;
		var fromAccount = req.body.selectedAccount;
		var toAccount = req.body.selectedToAccount || {};
		if(req.body.tags){
			//var tags = _.values(req.body.tags); 
			var tags = _.map(req.body.tags, _.iteratee('text'));
			req.body.tags = tags;
			console.log('------- tags --------');
			console.log(tags);
			console.log(req.body.tags);
			console.log('------- /tags --------');
		}
		//var transaction = {};
		Transaction.create(req.body).exec(function createCB(err, created){
		  console.log('Created transaction..\n' + created);
			  if(action === 'credit'){
			  	console.log('credit');
			  	Account.find(fromAccount.id).exec(
			  	  function(err,myAccounts){
			  	  	if(err){
			  	  		res.send(err);
			  	  	}
			  	  	console.log('got account');
			  	  	var myAccount = myAccounts[0];
			  	  	console.log(myAccount);
			  	  	myAccount.amount = parseInt(myAccount.amount) + parseInt(req.body.amount);
			  	  	myAccount.save(function(err){
			  	  		if(err) res.send(err);
			  	  		res.ok();
			  	  	});

			  	  });
			  }
			  if(action === 'debit'){
			  	console.log('debit money')
			  	Account.find(fromAccount.id).exec(
			  	  function(err,myAccounts){
			  	  	if(err){
			  	  		res.send(err);
			  	  	}
			  	  	console.log('got account');
			  	  	var myAccount = myAccounts[0];
			  	  	console.log(myAccount);
			  	  	myAccount.amount = parseInt(myAccount.amount) - parseInt(req.body.amount);
			  	  	myAccount.save(function(err){
			  	  		if(err) res.send(err);
			  	  		res.ok();
			  	  	});

			  	  });
			  }
			  if(action === 'transfer'){
			  	Account.find(fromAccount.id).exec(
			  	  function(err,myAccounts){
			  	  	if(err){
			  	  		res.send(err);
			  	  	}
			  	  	console.log('got account');
			  	  	var myAccount = myAccounts[0];
			  	  	console.log(myAccount);
			  	  	myAccount.amount = parseInt(myAccount.amount) - parseInt(req.body.amount);
			  	  	myAccount.save(function(err){
			  	  		if(err) res.send(err);
			  	  		Account.find(toAccount.id).exec(
			  	  		  function(err,myAccounts){
			  	  		  	if(err){
			  	  		  		res.send(err);
			  	  		  	}
			  	  		  	console.log('got account');
			  	  		  	var myAccount = myAccounts[0];
			  	  		  	console.log(myAccount);
			  	  		  	myAccount.amount = parseInt(myAccount.amount) + parseInt(req.body.amount);
			  	  		  	myAccount.save(function(err){
			  	  		  		if(err) res.send(err);
			  	  		  		res.ok();
			  	  		  	});

			  	  		  });

			  	  	});

			  	  });
			  	
			  }
		});
	},

	update:function (req,res) {
		console.log('updating..');
		//console.log(req.body);
		var id = req.param('id');
		console.log(id);
		//var action = req.body.action;
		var fromAccount = req.body.selectedAccount;
		var toAccount = req.body.selectedToAccount || {};
		var newAmount = parseInt(req.body.amount);
		var newTags = req.body.tags;
		Transaction
		.findOne(id)
		.exec(function (err, foundTxn) {
			if(err) {
				res.send(err);
			}
			console.log('foundTxn ->');
			console.log(foundTxn);
			var foundTxn = foundTxn;
			var action = foundTxn.action;
			var oldAmount = foundTxn.amount;
			var isSameAccount = (fromAccount.id === foundTxn.selectedAccount.id);
			if(action === 'debit'){
				if(isSameAccount){
					var amount = -(parseInt(newAmount) - parseInt(oldAmount));
					updateBalance(fromAccount,amount);
				}
				if(!isSameAccount){
					var amount = newAmount;
					updateBalance(fromAccount,-amount);
					updateBalance(foundTxn.selectedAccount,amount);
				}
			}
			if(action === 'credit'){
				if(isSameAccount){
					var amount = parseInt(newAmount) - parseInt(oldAmount);
					updateBalance(fromAccount,amount);
				}
				if(!isSameAccount){
					var amount = newAmount;
					updateBalance(fromAccount,amount);
					updateBalance(foundTxn.selectedAccount,-amount);
				}
			}
			if(action === 'transfer'){
				console.log('transfer');
				var isSameToAccount = (toAccount.id === foundTxn.selectedToAccount.id);

				if(isSameAccount && isSameToAccount){
					console.log('same from account');
					console.log('same to account');
					var amount = parseInt(oldAmount) - parseInt(newAmount);
					updateBalance(foundTxn.selectedAccount,amount);
					updateBalance(foundTxn.selectedToAccount, -amount);
				}
				if(!isSameAccount && isSameToAccount){
					console.log('not same from account');
					console.log('same to account');
					updateBalance(fromAccount, -parseInt(newAmount));
					updateBalance(foundTxn.selectedAccount,parseInt(oldAmount));
					
					var amount = parseInt(newAmount) - parseInt(oldAmount);
					updateBalance(foundTxn.selectedToAccount,amount);
				}
				if(isSameAccount && !isSameToAccount){
					console.log('same from account');
					console.log('not same to account');
					var amount = parseInt(oldAmount) - parseInt(newAmount);
					updateBalance(foundTxn.selectedAccount,amount);

					updateBalance(foundTxn.selectedToAccount,-parseInt(oldAmount));
					updateBalance(toAccount,parseInt(newAmount));
				}
				if (!isSameAccount && !isSameToAccount) {
					console.log('not same from && not same to');
					updateBalance(foundTxn.selectedAccount, parseInt(oldAmount));
					if(fromAccount.id === foundTxn.selectedToAccount.id){
						var amount = parseInt(oldAmount) + parseInt(newAmount);
						updateBalance(foundTxn.selectedToAccount,-amount);
					}
					else{
						updateBalance(foundTxn.selectedToAccount,-parseInt(oldAmount));
						updateBalance(fromAccount,-parseInt(newAmount));
					}
					
					updateBalance(toAccount,parseInt(newAmount));
				}
			}

			foundTxn.selectedAccount = fromAccount;
			foundTxn.selectedToAccount = toAccount;
			foundTxn.amount = newAmount;
			foundTxn.tags = _.map(newTags, _.iteratee('text'));
			foundTxn.save(function (err, savedTxn) {
				// body...
				if(err)
					res.send(err);

				// send ok response
				res.ok();
			})
		})
	}
	
};



function updateBalance(account,amount){
	var opts = {
		id: account.id,
		amount:amount
	}
	Account.updateBalance(opts,function (err,done) {
		if (err) {
			console.log(err);			
		}
		else{
			console.log('done');
		}
	})
}