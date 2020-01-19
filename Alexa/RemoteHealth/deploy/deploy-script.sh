#!/bin/bash

cd ../src
rm -f deploy.zip
echo "Creating zip file ..."
zip -rq deploy.zip .
echo "... done zipping file."
echo "Deploying to AWS ..."
aws s3 cp deploy.zip s3://alexa-skill-storage/
aws lambda update-function-code --function-name remoteHealth --s3-bucket alexa-skill-storage --s3-key deploy.zip
echo "Finished deploying to cloud."