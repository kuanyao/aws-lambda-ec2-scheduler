var AWS = require('aws-sdk');

var ec2 = new AWS.EC2({ "region": "us-east-1"});

var params = {
  InstanceIds: [ 
    'i-0f05e06255a17d2f6',
  ],
};
ec2.stopInstances(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
