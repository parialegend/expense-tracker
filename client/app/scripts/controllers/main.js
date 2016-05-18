'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function (restService,NgTableParams,$uibModal) {

  	var vm = this;

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //var restService = restService;

    this.tags = [];

    this.txnOptions = [
    	{value: 'credit', name: 'Credit '},
  		{value: 'debit', name: 'Debit '},
  		{value: 'transfer', name: 'Transfer '}
    ];

    this.filterData = [
    	'credit',
  		'debit',
  		'transfer'
    ];
    vm.accounts = [];
    vm.totalBalance = 0;

    var getAccounts = function () {
    	restService.getAccounts()
    	    	.then(function successCallback(response) {
    	    	    // this callback will be called asynchronously
    	    	    // when the response is available
    	    		console.log('yay..');
    	    		console.log(response.data);
    	    		vm.accounts = response.data;
    	    		vm.totalBalance = 0;
    	    		for (var i = 0; i < response.data.length; i++) {
    	    			vm.totalBalance += parseInt(response.data[i].amount);
    	    		}

    	    	  }, function errorCallback(response) {
    	    	    // called asynchronously if an error occurs
    	    	    // or server returns response with an error status.
    	    	    console.log('thats sad');
    	    	    console.error(response);
    	    	  });
    }
    getAccounts();
    

    // for (var i = 0; i < this.accounts.length; i++) {
    // 	this.totalBalance =+ parseInt(this.accounts[i].balance)
    // }

    this.selectedAction = 'Please..';
    this.selectedAccount = 'Select Account..';
    this.setAction = function(action) {
	  this.selectedAction = action;
	};
	this.setAccount = function(account) {
	  this.selectedAccount = account;
	};
	this.selectedToAccount = '';
	this.setToAccount = function(account) {
	  this.selectedToAccount = account;
	};

	this.addTxn = function(form){
		var transactionObj = {};
		transactionObj.selectedAccount = {
			amount:this.selectedAccount.amount,
			account:this.selectedAccount.account,
			id:this.selectedAccount.id
		};
		transactionObj.selectedToAccount = {
			amount:this.selectedToAccount.amount,
			account:this.selectedToAccount.account,
			id:this.selectedToAccount.id
		};
		transactionObj.amount = this.balance;
		transactionObj.action = this.selectedAction;
		transactionObj.tags = this.tags;

		console.log(transactionObj);
		restService.addTransaction(transactionObj)
			.then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				console.log('yay..');
				console.log(response);
				getAccounts();
				getTxns();
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log('thats sad');
			    console.error(response);
			  });
	}

	/***  end transaction function **/
	this.transactions = [];

	vm.addingAccount = false;
	this.addAccount = function(){
		vm.addingAccount = true;
	}
	this.cancelAddingAccount = function(){
		vm.addingAccount = false;
	}

	this.addAccountInfo = function(){
		var newAccount = {};
		newAccount.account = this.newAccount.account;
		newAccount.amount = 0;
		console.log(typeof newAccount.amount);
		//this.accounts.push(newAccount);
		restService.addAccount(newAccount)
			.then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				console.log('yay..');
				console.log(response);
				vm.accounts.push(response.data);
				vm.totalBalance += response.data.amount;
				vm.addingAccount = false;
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log('thats sad');
			    console.error(response);
			  });
		console.log(newAccount);
		this.newAccount.account ='';
	}

	//debugger;
	vm.transactions = [];
	var getTxns = function () {
		restService.getTransactions()
			.then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				console.log('yay.. transactions');
				console.log(response);
				vm.transactions = response.data;
				vm.tableParams = new NgTableParams({}, {
			      dataset: response.data
			    });
			  }, function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			    console.log('thats sad');
			    console.error(response);
			  });
	}
	getTxns();


	/* Form Editing */
	vm.items = ['item1', 'item2', 'item3'];
	this.open = function (txn) {
	   var modalInstance = $uibModal.open({
	     animation: this.animationsEnabled,
	     templateUrl: 'myModalContent.html',
	     controller: 'ModalInstanceCtrl',
	     resolve: {
	       items: function () {
	         return vm.items;
	       },
	       accounts: function () {
	       	 return vm.accounts;
	       },
	       transactions: function () {
	       	 return vm.transactions;
	       },
	       addTxn: function () {
	       	 return vm.addTxn;
	       },
	       txn: function () {
	       	 return txn;
	       }
	     }
	   });

	   modalInstance.result.then(function (data) {
	   		console.log(data);
	   		//debugger;
	     //this.selected = selectedItem;
	     restService.updateTransaction(data.transactionObj,data.txnId)
	     	.then(function successCallback(response) {
	     	    // this callback will be called asynchronously
	     	    // when the response is available
	     		console.log('yay..updated');
	     		console.log(response);
	     		getAccounts();
	     		getTxns();
	     	  }, function errorCallback(response) {
	     	    // called asynchronously if an error occurs
	     	    // or server returns response with an error status.
	     	    console.log('thats sad');
	     	    console.error(response);
	     	  });
	   }, function () {
	     console.info('Modal dismissed at: ' + new Date());
	   });
	 };


  });

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('clientApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, accounts, transactions, addTxn, txn) {

  var eM = this;
  $scope.items = items;
  $scope.accounts = accounts;
  $scope.transactions = transactions;
  $scope.addTxn = addTxn;
  $scope.txn = txn;
  $scope.txnId = txn.id;
  console.log(txn);
  console.log($scope.txnId);
  $scope.status = {
    isopen: false
  };

  $scope.selectedAction = txn.action;

  $scope.selectedAccount = txn.selectedAccount;
	$scope.setAccount = function(account) {
	  $scope.selectedAccount = account;
	};

	$scope.selectedToAccount = '';
	if(txn.action === 'transfer'){
		$scope.selectedToAccount = txn.selectedToAccount;	
	}
	$scope.setToAccount = function(account) {
	  $scope.selectedToAccount = account;
	};

	$scope.balance = txn.amount;
	$scope.newTags = txn.tags;

  $scope.ok = function () {
  	var transactionObj = {};
	transactionObj.selectedAccount = {
		amount:$scope.selectedAccount.amount,
		account:$scope.selectedAccount.account,
		id:$scope.selectedAccount.id
	};
	transactionObj.selectedToAccount = {
		amount:$scope.selectedToAccount.amount,
		account:$scope.selectedToAccount.account,
		id:$scope.selectedToAccount.id
	};
	transactionObj.amount = $scope.balance;
	transactionObj.action = txn.action
	transactionObj.tags = $scope.newTags;
	//transactionObj.txnId = $scope.txnId;
	  var data = {
	  	transactionObj:transactionObj,
	  	txnId:$scope.txnId
	  }
  $uibModalInstance.close(data);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
