'use strict';

angular.module('clientApp')
	.factory('restService', function($http) {
	  var restServiceObj = {};
	   var urlBase = 'http://localhost:1337';

	  restServiceObj.getAccounts = function () {
	  	return $http.get(urlBase+'/account');
	  };

	  restServiceObj.addAccount = function (account) {
	  	 return $http.post(urlBase+'/account',account);
	  };

	  restServiceObj.getTransactions = function () {
	  	return $http.get(urlBase+'/transaction');
	  };

	  restServiceObj.addTransaction = function (transaction) {
	  	 return $http.post(urlBase+'/transaction',transaction);
	  };

	  restServiceObj.updateTransaction = function (transaction,txnId) {
	  	 console.log(txnId);
	  	 //debugger;
	  	 return $http.post(urlBase+'/transaction/'+ txnId,transaction);
	  };


	  
	  return restServiceObj;
});
