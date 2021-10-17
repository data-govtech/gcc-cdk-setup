# Bootstrap AWS CDK in GCC

**Tags: aws-cdk, gov-commercial-cloud, aws**

This project shows how to bootstrap AWS CDK in a Government Commercial Cloud (AWS) account, which we may not have AWS CLI access. 

## Background

To perform CDK deployment in an AWS account, we must bootstrap the account with necessary setup first. 

> cdk bootstrap is **a tool in the AWS CDK command-line interface responsible for populating a given environment** (that is, a combination of AWS account and region) with resources required by the CDK to perform deployments into that environment.

Following are the 2 common methods to bootstrap an AWS account with CDK. But neither of the method can be used directly in GCC (AWS environment).

**Option 1: CDK CLI**

Bootstrapping can be conveniently done using [CDK CLI](https://docs.aws.amazon.com/cdk/latest/guide/cli.html). 

But in many GCC account, due to security reasons, engineers are not allowed to use AWS CLI, and hence CDK CLI is not allowed either.

**Option 2: CloudFormation**

All CDK projects are eventually compiled down to a CloudFormation template. That is also true during CDK bootstrapping. CDK provides a CloudFormation template `bootstrap-template.yml`, which can be downloaded from [aws-cdk in GitHub](https://github.com/aws/aws-cdk/blob/master/packages/aws-cdk/lib/api/bootstrap/bootstrap-template.yaml).

In GCC(AWS), new IAM role must be created with a specific Permissions Boundary. Thus the original `bootstrap-template.yml` cannot be used directly. We have to modify it to incorporate setting of Permission Boundary.

## Workaround

Here is the workaround to bootstrap AWS CDK in your GCC (AWS) account. 

**Customized Bootstrap Template**

First, we must modify existing `bootstrap-template.yml` file by specifying Permissions Boundary for all roles created in the template. 

A modified version of the template can be found at `cdk-bootstrap/bootstrap-template-with-permission-boundary.yaml`.

**Required Additional Resources**

After bootstrapping, we still need to setup a few resources for CDK projects.

* A S3 Bucket `cdk-artifactsbucket-<ACCOUNT_ID>-ap-southeast-1` which will be used to stage artifacts like source code during deployment. By default, CDK will create a staging bucket for every deployment, which will end up too many buckets to be cleaned up later.
* A IAM role `AWSCodePipelineRole` for `codepipeline.amazonaws.com` to deploy sub-stacks on your behalf. 

Due to restriction in GCC, we are not able to create above IAM role through AWS Console. But we can create it using a CloudFormation stack. 

The `cdk-setup-other-resource` folder contains a CDK project which generates a CloudFormation template to create above resources. 

The generated CloudFormation template can be found in `cdk.out/gcc-cdk-setup.template.json`.  


## Deployment Steps



#### Deploying Customized Bootstrap Template

The modified template `bootstrap-template-with-permissions-boundary.yml` is located in  `cdk-bootstrap` folder.

**Setup:**

1. Create a role `CloudFormationAdminRole` for CloudFormation service with `AdministratorAccess` permission.

2. Find the Permissions Boundary policy in your AWS environment and take note of its ARN.

3. Create a CloudFormation stack by uploading the template file `bootstrap-template-with-permissions-boundary.yml`.
   * On first step of the stack creation, fill the parameter `PermissionsBoundaryPolicy` with the Permission Boundary policy ARN of your account.
   * Use the `CloudFormationAdminRole` to create the stack.
   * Must name the stack `CDKToolkit` because future CloudFormation stacks created by CDK may refer to this stack for some resources.

#### Deploying Stack to Create Additional Resources

The `cdk-setup-other-resource` folder contains a CDK project which generates a template to deploy following resources:

1. An S3 Bucket `cdk-artifactsbucket-<ACCOUNT_ID>-ap-southeast-1`

2. An IAM Role `AWSCodePipelineRole` for trust entity `cloudformation.amazonaws.com` with following permissions. (Permissions be further minimized for better security.)
   * AWSCodeCommitFullAccess
   * AWSCodeBuildDeveloperAccess
   * AWSCodeDeployFullAccess
   * AWSCodePipelineFullAccess
   * AWSCloudFormationFullAccess
   * AmazonS3FullAccess

A generated CloudFormation template `gcc-cdk-setup.template.json` can be found in `cdk.out` folder.

Deploy the template with name `gcc-cdk-setup`. (You can choose any name for this stack.)

