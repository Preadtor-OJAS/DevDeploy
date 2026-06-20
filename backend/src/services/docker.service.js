"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildDockerImage = void 0;
var _dockerode = _interopRequireDefault(require("dockerode"));
var _path = _interopRequireDefault(require("path"));
var _tar = _interopRequireDefault(require("tar"));
var _fs = _interopRequireDefault(require("fs"));
var _deployment = require("./deployment.service");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const docker = new _dockerode.default();
const buildDockerImage = async (repoPath, imageName, deploymentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tarPath = _path.default.join(repoPath, '..', `${_path.default.basename(repoPath)}.tar`);

      // Create tarball of the directory
      await _tar.default.c({
        gzip: false,
        file: tarPath,
        cwd: repoPath
      }, ['.']);
      const stream = await docker.buildImage(tarPath, {
        t: imageName
      });
      stream.on('data', async chunk => {
        const output = chunk.toString('utf8');
        try {
          const json = JSON.parse(output);
          if (json.stream) {
            await (0, _deployment.logProgress)(deploymentId, json.stream.trim());
          }
        } catch (e) {
          // Ignore parse errors from chunk
        }
      });
      stream.on('end', () => {
        _fs.default.unlinkSync(tarPath); // cleanup tar
        _fs.default.rmSync(repoPath, {
          recursive: true,
          force: true
        }); // cleanup repo
        resolve();
      });
      stream.on('error', err => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};
exports.buildDockerImage = buildDockerImage;