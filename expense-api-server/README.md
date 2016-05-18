# expense-api-server

a [Sails](http://sailsjs.org) application

Install Sails.js
To get started visit http://sailsjs.org/get-started


### Models
- Account
- Transaction
- User (not in use currently)

### Controllers
- AccountController
- TransactionController (see this file)
- UserController

> Blueprints API is enabled by default
> Visit http://sailsjs.org/documentation/concepts/blueprints to learn more

### TODO
- Simplify Transaction Actions (debit,credit and tranfer)
  What I mean is Transferring amount A from Account X to Account Y should be Debit amount A from Account X and Credit amount A to Account Y
