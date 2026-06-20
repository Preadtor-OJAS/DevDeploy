"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneRepository = void 0;
var _simpleGit = _interopRequireDefault(require("simple-git"));
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _uuid = require("uuid");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const cloneRepository = async (repoUrl, branch) => {
  const tmpPath = _path.default.join(__dirname, '../../tmp', (0, _uuid.v4)());
  if (!_fs.default.existsSync(tmpPath)) {
    _fs.default.mkdirSync(tmpPath, {
      recursive: true
    });
  }
  const git = (0, _simpleGit.default)();

  // Clone the repo
  await git.clone(repoUrl, tmpPath, ['--branch', branch, '--single-branch']);

  // Auto-detect application type and generate Dockerfile if missing
  const files = _fs.default.readdirSync(tmpPath);
  if (!files.includes('Dockerfile')) {
    let dockerfileContent = '';
    if (files.includes('package.json')) {
      // Node.js
      dockerfileContent = `
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
      `;
    } else if (files.includes('requirements.txt')) {
      // Python
      dockerfileContent = `
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
      `;
    } else if (files.includes('pom.xml')) {
      // Java
      dockerfileContent = `
FROM maven:3.8-openjdk-11 as builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
      `;
    } else {
      throw new Error('Unsupported application type. Please provide a Dockerfile.');
    }
    _fs.default.writeFileSync(_path.default.join(tmpPath, 'Dockerfile'), dockerfileContent);
  }
  return tmpPath;
};
exports.cloneRepository = cloneRepository;