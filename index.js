'use strict';

console.log('Loading function');

var AWS = require('aws-sdk');
var ec2 = new AWS.EC2({ "region": "us-east-1"});

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2))
    const message = event.Records[0].Sns.Message;
    console.log('From SNS:', message);
    
    var options = JSON.parse(message);
    var action = options.Action;
    var params = { Filters: options.Filters };
    
    ec2.describeInstances(params)
        .promise()
        .then(function(data){
            var reservations = data.Reservations,
                instances,
                instanceIds;

            if (reservations && reservations.length) {
                instances = data.Reservations.map(r => r.Instances).reduce((a1, a2) => a1.concat(a2));
                instanceIds = instances.map(i => i.InstanceId);
                if (action == "start") {
                    return ec2.startInstances({InstanceIds: instanceIds}).promise();
                } else if (action == "stop") {
                    return ec2.stopInstances({InstanceIds: instanceIds}).promise();
                }
            }
        })
        .then(function(data){
            if (data) {
                console.log(data);
            } else {
                console.log("no instance has been found.");
            }
        })
        .catch(function(error){
            console.error(error);
        });
};