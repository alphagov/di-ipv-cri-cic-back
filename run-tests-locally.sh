#!/bin/bash
set -eu

if [ $# -ge 1 ] && [ -n "$1" ]
then
    echo "Running test container against $1"

    export SAM_STACK=$1 
    export AWS_REGION="eu-west-2"
    export TEST_REPORT_DIR="results"
    export ENVIRONMENT="dev"

    mkdir -p results # The directory on the host where the test results will be outputted.

    aws cloudformation describe-stacks --stack-name "$SAM_STACK" --region "$AWS_REGION" --query 'Stacks[0].Outputs[].{key: OutputKey, value: OutputValue}' --output text > cf-output.txt
    eval $(awk '{ printf("export CFN_%s=\"%s\"\n", $1, $2) }' cf-output.txt)
    awk '{ printf("CFN_%s=\"%s\"\n", $1, $2) }' cf-output.txt > docker_vars.env
    echo TEST_REPORT_DIR="$TEST_REPORT_DIR" >> docker_vars.env
    echo TEST_REPORT_ABSOLUTE_DIR=/app/results >> docker_vars.env
    echo TEST_ENVIRONMENT="$ENVIRONMENT" >> docker_vars.env
    echo ENVIRONMENT="$ENVIRONMENT" >> docker_vars.env
    echo SAM_STACK_NAME="$SAM_STACK" >> docker_vars.env
    echo AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" >> docker_vars.env
    echo AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" >> docker_vars.env
    echo AWS_SESSION_TOKEN="$AWS_SESSION_TOKEN" >> docker_vars.env

    docker build -f Dockerfile -t testcontainer .
    docker run --env-file docker_vars.env -v $(pwd)/results:/results testcontainer
else    
    echo "Please ensure you've got a stack name as the first argument after ./run_tests_locally.sh..."
    echo "E.g. ./run_tests_locally.sh cri-cic-api"
fi