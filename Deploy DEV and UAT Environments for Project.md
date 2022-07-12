# Setup DEV and UAT Environments for Project



## Branches vs Environments

We will setup 3 environments, DEV, UAT and PROD, setup for development, UAT and production. Each environment has its respective `.env` file in the `iac_cdk` folder. The content of the `.env` file for each environment are saved in `.env.dev`, `.env.uat` and `.env.prod` respectively. 

The `.env` file is excluded from version control through `.gitignore` file so that the `.env` file will not be overwritten during branch merging.

We use following 3 git branches to keep the codebase for above 3 environments.

|      | Branch  | Environment | Sample .env File |
| ---- | ------- | ----------- | ---------------- |
| 1    | develop | DEV         | .env.dev         |
| 2    | main    | UAT         | .env.uat         |
| 3    | prod    | PROD        | .env.prod        |

### Some Recommendations in Configuring .ENV File

* The `PROJECT_CODE` is used as prefix for resources deployed in AWS. Use the same PROJECT_CODE for UAT and PROD since they are expected to be in DIFFERENT AWS accounts.
* The DEV and UAT environments may be in the same AWS account. Postfix the `PROJECT_CODE` for DEV environment with a`-dev` so that stacks for DEV and UAT can be differentiated by `-dev`.  



### Example .ENV Files

Differences between `.env.dev` and `.env.uat`.

![image-20220712165314540](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220712165314540.png)



The environment variables for UAT and PROD should:

*  have same PROJECT_CODE
* have different resource values, e.g. VPC_ID etc.



## Setup CloudFormation in AWS

Each environment is corresponding to 1 or more CloudFormation stack(s) in AWS. To setup an environment, 

1. Check out the respective branch from the project repo.
2. CD into the `iac_cdk` folder and make sure the content of `.env` matches the sample environment file for that environment. 
3. Synthesize the CloudFormation template
4. Take the main template file and create a CloudFormation stack. 
5. Repeat above steps to deploy stack for different environments.



