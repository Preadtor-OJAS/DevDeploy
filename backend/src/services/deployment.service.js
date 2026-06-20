"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logProgress = exports.deployApplication = void 0;
var _prisma = require("../utils/prisma");
var _github = require("./github.service");
var _docker = require("./docker.service");
var _kubernetes = require("./kubernetes.service");
const deployApplication = async applicationId => {
  const deployment = await _prisma.prisma.deployment.create({
    data: {
      applicationId,
      status: 'PENDING'
    }
  });
  const app = await _prisma.prisma.application.findUnique({
    where: {
      id: applicationId
    }
  });
  if (!app) return;
  try {
    await logProgress(deployment.id, `Starting deployment for ${app.name}...`);

    // 1. Clone Repo
    await _prisma.prisma.deployment.update({
      where: {
        id: deployment.id
      },
      data: {
        status: 'BUILDING'
      }
    });
    await logProgress(deployment.id, `Cloning repository ${app.repositoryUrl}...`);
    const repoPath = await (0, _github.cloneRepository)(app.repositoryUrl, app.branch);

    // 2. Build Docker Image
    await logProgress(deployment.id, `Building Docker image...`);
    const imageName = `devdeploy-${app.name.toLowerCase()}:latest`;
    await (0, _docker.buildDockerImage)(repoPath, imageName, deployment.id);

    // 3. Deploy to Kubernetes
    await _prisma.prisma.deployment.update({
      where: {
        id: deployment.id
      },
      data: {
        status: 'DEPLOYING'
      }
    });
    await logProgress(deployment.id, `Deploying to Kubernetes...`);
    await (0, _kubernetes.deployToKubernetes)(app.name, imageName);
    await _prisma.prisma.deployment.update({
      where: {
        id: deployment.id
      },
      data: {
        status: 'SUCCESS'
      }
    });
    await _prisma.prisma.application.update({
      where: {
        id: app.id
      },
      data: {
        status: 'RUNNING'
      }
    });
    await logProgress(deployment.id, `Deployment completed successfully ✅`);
  } catch (error) {
    await _prisma.prisma.deployment.update({
      where: {
        id: deployment.id
      },
      data: {
        status: 'FAILED'
      }
    });
    await _prisma.prisma.application.update({
      where: {
        id: app.id
      },
      data: {
        status: 'FAILED'
      }
    });
    await logProgress(deployment.id, `Deployment failed: ${error.message}`);
  }
};
exports.deployApplication = deployApplication;
const logProgress = async (deploymentId, message) => {
  console.log(`[Deployment ${deploymentId}] ${message}`);
  await _prisma.prisma.log.create({
    data: {
      deploymentId,
      message
    }
  });
};
exports.logProgress = logProgress;