# Deploy a CDK Project in CloudFormation



## Generate CloudFormation Template

We prepare a CDK project to generate the CloudFormation template.

1. Run following command to generate CloudFormation template. 
   * Command `cdk synth`
   * You may be asked to enter 2FA
   * Generated file `*.template.json` file(s) are output to `cdk.out` folder.



## Deploy CloudFormation Template

1. Create a new stack.

   ![image-20220804133332024](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220804133332024.png)

2. Choose the template file generated in the `cdk.out` folder

   ![image-20220804133230036](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220804133230036.png)

3. Configure stack options: Choose the IAM role created during CDK initialization.

   ![image-20220804133448508](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220804133448508.png)

4.  Review stack: check "I acknowledge that AWS CloudFormation might create IAM resources.". Create the stack.![image-20220804133554355](https://raw.githubusercontent.com/qinjie/picgo-images/main/image-20220804133554355.png)