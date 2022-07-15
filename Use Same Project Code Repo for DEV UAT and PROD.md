# Use Same Project Code Repo for DEV UAT and PROD



## Branches vs Environments

We will use one code repository to setup 3 environments, development (DEV), UAT and production (PROD). Each environment has its respective `.env.*` file in the `iac_cdk` folder, namely`.env.dev`, `.env.uat` and `.env.prod` respectively. 

The `.env` file is excluded from version control through `.gitignore` file. Before coding building, if the `.env` file does not exists, the CodePipeline will check the git branch name, and copy the respective `.env.*` file to `.env` file. 

We use following 3 git branches to keep the codebase for above 3 environments.

|      | Branch     | Environment | Copied .env File |
| ---- | ---------- | ----------- | ---------------- |
| 1    | develop    | DEV         | .env.dev         |
| 2    | main       | UAT         | .env.uat         |
| 3    | production | PROD        | .env.prod        |

![image-20220715111930369](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220715111930369.png)

### Some Recommendations in Configuring .ENV File

* The `PROJECT_CODE` in `.env.*` is used as prefix for resources deployed in AWS. Use the same PROJECT_CODE for UAT and PROD since they are expected to be in DIFFERENT AWS accounts.
* The `PROJECT_FAMILIY` in `.env.*` is used as prefix for resources which are shared among different environments.
* The DEV and UAT environments may be in the same AWS account. Prefix the `PROJECT_CODE` for DEV environment with a`dev-<PROJECT_CODE>` so that stacks for DEV and UAT are differentiated.
* The UAT and PROD environments are expected to be in different AWS account. Thus their `.env.*` files are expected be the same except the repo branch name.  



### Example .ENV Files

Differences between `.env.dev` and `.env.uat`.

![image-20220712165314540](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220712165314540.png)



## Setup CloudFormation Stack in AWS

1. Check out the respective branch, `develop`, `main`, or `production` from the project repo.

2. CD into the `iac_cdk` folder and copy respective `.env.*` file to `.env`. 

   ```bash
   # To setup DEV environment
   cp .env.dev .env
   # To setup UAT environment
   cp .env.uat .env
   ```

   

3. Synthesize the CloudFormation template

   ```bash
   cdk synth
   # Remov .env file to avoid confusion
   rm .env
   ```

   

4. Take the main stack template file `<PROJECT_CODE>.template.json`, and create a CloudFormation stack. 

5. Repeat above steps to deploy stacks for different environments.

