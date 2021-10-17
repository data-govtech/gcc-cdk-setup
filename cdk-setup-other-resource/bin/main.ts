#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { PermissionsBoundary } from "../cdk-common/permission-boundary";
import { PipelineStack, PipelineStackProps } from "../lib/pipeline-stack";

// Load .env file
require("dotenv").config();

const tags = {
  "Agency-Code": process.env.AGENCY_CODE! || "",
  "Project-Code": process.env.PROJECT_CODE! || "",
  Environment: process.env.ENVIRONMENT! || "",
  Zone: process.env.ZONE! || "",
  Tier: process.env.TIER! || "",
  "Project-Owner": process.env.PROJECT_OWNER! || "",
};

const project_code = process.env.PROJECT_CODE!;
const AWS_POLICY_PERM_BOUNDARY = process.env.AWS_POLICY_PERM_BOUNDARY!;

const app = new cdk.App();

/* Pipeline Stack */
const pipelineProps: PipelineStackProps = {
  // basic props
  project_code,
};

const pipelineStack = new PipelineStack(app, project_code, {
  ...pipelineProps,
  tags,
});

if (AWS_POLICY_PERM_BOUNDARY) {
  cdk.Aspects.of(pipelineStack).add(
    new PermissionsBoundary(AWS_POLICY_PERM_BOUNDARY)
  );
}

app.synth();
