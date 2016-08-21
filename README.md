## aws-lambda-ec2-scheduler
Use AWS Lambda service to automatically start stop EC2 instance on schedule

### Introduction
AWS does not have out-of-box service that can start stop EC2 instance on schedule. It could be useful to have such service that one can define a group of instances that share a common schedule. For example, a group of ec2 instances that only needs to work during 10am to 5pm during weekdays. It will be ideal for this group of instances to start 10am during weekdays and stop at 5pm everyday automatically. This project is to use AWS IAM, EC2, Lambda, CloudWatch, and SNS to achieve this automation.

### Design
- Use AWS tag to group desired EC2 instances. For example, a group of instances can all be given a tag "for" with value of "roboray". That tag can be used to form a search filter `{Filters: {Name:'tags:for'}, Values:['roboray']}`.
- Use CloudWatch to create a schedule rule using Cron format
  - Create one rule to trigger at every weekeday at 10am.
  - When the rule is triggered, it sends out a fixed content to a SNS topic
  - The content is a JSON blob that contains start/stop action and EC2 instances group filter.
  - Create another rule for stop instance at 5pm everyday.
- Use Lambda function to start/stop ec2 instance
  - Lambda function subscribe to the SNS topic
  - Based on the content of the SNS (originated from the CloudWatch rules), Lambda function query for the group of instances and start/stop them.

### Other Consideration
- Needs to create an IAM role for Lambda function to access the EC2 instance
- The Lambda function take ec2 filter from the content it received from SNS/CloudWatch.
- To create a schedule for a different group, one can add a new rule for different time and different ec2 filter.
