var AWS = require('aws-sdk');

var ec2 = new AWS.EC2({ "region": "us-east-1"});
var dryrun = true;

var params = {
  Filters: [
    { Name: "tag:for", Values: ["robotc"] }
  ]
};
ec2.describeInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
    instances = data.Reservations[0].Instances;
    if (!instances.length) {
      console.log('no instance found.');
    } else {
      instanceIds = instances.map(i => i.InstanceId);
      ec2.startInstances({InstanceIds: instanceIds, DryRun: dryrun}, function(err, data){
         if (!err) {
            console.log(data);
            console.log(instances.length + " instances have been started.");
         } else {
            console.log(err, err.stack);
         }
      });
    }
  }
});
