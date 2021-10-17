import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";

require("dotenv").config();

export interface PipelineStackProps extends cdk.StackProps {
  // basic props
  project_code: string;
}

export class PipelineStack extends cdk.Stack {
  bucketArtifacts: s3.Bucket;
  roleCodepipeline: iam.Role;

  constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    this.bucketArtifacts = new s3.Bucket(this, "cdk-artifactsbucket-bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: `cdk-artifactsbucket-${cdk.Aws.ACCOUNT_ID}-${cdk.Aws.REGION}`,
    });

    this.roleCodepipeline = this.createRoleCodePipeline(`AWSCodePipelineRole`);
    this.updateRoleCodeBuild(
      `arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:role/AWSCodeBuildRole`
    );
    this.output();
  }

  private createRoleCodePipeline(roleName: string) {
    const role = new iam.Role(this, "cdk-codepipeline-role", {
      assumedBy: new iam.ServicePrincipal("codepipeline.amazonaws.com"),
      path: "/",
      roleName: roleName,
    });

    const managedPolicies = [
      "AWSCodeCommitFullAccess",
      "AWSCodeBuildDeveloperAccess",
      "AWSCodeDeployFullAccess",
      "AWSCodePipelineFullAccess",
      "AWSCloudFormationFullAccess",
      "AmazonS3FullAccess",
      "AmazonECS_FullAccess",
    ];

    managedPolicies.forEach((policy) => {
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName(policy));
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sts:AssumeRole", "iam:PassRole"],
        resources: ["*"],
      })
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "kms:CreateKey",
          "kms:PutKeyPolicy",
          "kms:Decrypt",
          "kms:DescribeKey",
          "kms:Encrypt",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
        ],
        resources: [
          `arn:aws:kms:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:key/*`,
        ],
      })
    );
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: [
          `arn:aws:logs:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:log-group:/*`,
        ],
      })
    );
    return role;
  }

  private updateRoleCodeBuild(roleArn: string) {
    const role = iam.Role.fromRoleArn(this, "cdk-codebuild-role", roleArn, {
      mutable: true,
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["sts:AssumeRole", "iam:PassRole"],
        resources: ["*"],
      })
    );
  }

  private output() {
    new cdk.CfnOutput(this, `cdk-artifactsbucket-name`, {
      value: this.bucketArtifacts.bucketName!,
    });
  }
}
