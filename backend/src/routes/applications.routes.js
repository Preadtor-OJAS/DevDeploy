"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _prisma = require("../utils/prisma");
var _auth = require("../middleware/auth");
var _deployment = require("../services/deployment.service");
const router = (0, _express.Router)();
router.use(_auth.authenticate);
router.get('/', async (req, res) => {
  try {
    const apps = await _prisma.prisma.application.findMany({
      where: {
        userId: req.auth.userId
      },
      include: {
        deployments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    res.json(apps);
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});
router.post('/', async (req, res) => {
  try {
    const {
      name,
      repositoryUrl,
      branch
    } = req.body;
    const existing = await _prisma.prisma.application.findUnique({
      where: {
        name
      }
    });
    if (existing) {
      return res.status(400).json({
        error: 'Application name already in use'
      });
    }
    const app = await _prisma.prisma.application.create({
      data: {
        name,
        repositoryUrl,
        branch: branch || 'main',
        userId: req.auth.userId
      }
    });

    // Start deployment asynchronously
    (0, _deployment.deployApplication)(app.id).catch(console.error);
    res.json(app);
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const app = await _prisma.prisma.application.findUnique({
      where: {
        id
      }
    });
    if (!app || app.userId !== req.auth.userId) {
      return res.status(404).json({
        error: 'Not found'
      });
    }
    await _prisma.prisma.application.delete({
      where: {
        id
      }
    });
    res.json({
      message: 'Deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error'
    });
  }
});
var _default = exports.default = router;