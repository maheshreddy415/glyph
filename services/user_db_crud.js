var config = require('../config/config.json');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

/*
 * 
 * user fields are
 * 1. name
 * 2. emp_id
 * 3. project_id
 * 4. project_name
 * 5. project_description
 * 6. date_request_made
 * 7. email_id
 * 8. action_taken
 * 9. date_responded
 * 
 */

var service = {};

service.getEmployeesList = getEmployeesList;
service.create = create;

module.exports = service;

function getEmployeesList(data, callBack) {
    var limit=0, offset=0;
    
    if(!isNaN(data.limit))limit  = parseInt(data.limit);
    if(!isNaN(data.offset))offset = parseInt(data.offset);
    
    db.users.find().skip(offset).limit(limit).toArray(function(err, result) {
        if (err) throw err;
        return callBack(result);
    });
}


function create(userParam, callBack) {
    
    // check whether the record already exists.
    db.users.findOne(
        { email_id: userParam.email_id },
        function (err, user) {
            if (err) return callBack(err.name + ': ' + err.message);
                
            if (user) {
                // email already exists
                return callBack('Email Id "' + userParam.email_id + '" is already exists.');
            } else {
                createEmployee(userParam);
            }
        });

    function createEmployee(userParam) {
        db.users.insert(
            userParam,
            function (err, user) {
                console.log(user);
                if (err) return callBack(err.name + ': ' + err.message);
                else return callBack('Inserted - '+user.ops[0]._id);
            });
    }
}
