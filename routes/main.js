
var config  = require('../config/config.json');
var user_db_crud = require('../services/user_db_crud.js');
var _ = require('lodash');

var newExport = function(data){
	
    var app = data.app;
	
    app.get('/', function(req, res){
        res.render("registration_form.html");
    });
    
    /* Insert Employee data */
    app.post('/add_user', function(req, res){
        var params = [];
        _.forEach(req.body, function(value, key) {
            if( (_.indexOf(config.userCollectionFields, key) != -1) && value != '' && value != 'undefined') {
                params.push('"'+key+'":"'+value+'"');
            };
        });
        
        if(params.length > 0) {
            params.push('"date_request_made":"'+ new Date() +'", "action_taken":"", "date_responded":""');
            var user =  JSON.parse('{'+params.join(',')+'}') ;
            user_db_crud.create(user, function(message) {
                res.send(message);
            })
        } else {
            res.send('It seems data missing.');
        }
    });
    
    /* Get the list of Employees */
    app.get('/employee_list', function(req, res) {
        var data = {limit:req.query.limit, offset:req.query.offset};
        user_db_crud.getEmployeesList(data, function(list){
            res.send(list);
        });
    });
    
    app.post('/employee_list', function(req, res) {
        var data = {limit:req.body.limit, offset:req.body.offset};
        user_db_crud.getEmployeesList(data, function(list){
            res.send(list);
        });
    });
}   


module.exports = newExport; 
