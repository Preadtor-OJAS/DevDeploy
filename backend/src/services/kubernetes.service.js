"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deployToKubernetes = void 0;
var k8s = _interopRequireWildcard(require("@kubernetes/client-node"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
const deployToKubernetes = async (appName, imageName) => {
  const namespace = 'default';
  const name = appName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const deploymentManifest = {
    metadata: {
      name: `${name}-deployment`
    },
    spec: {
      replicas: 1,
      selector: {
        matchLabels: {
          app: name
        }
      },
      template: {
        metadata: {
          labels: {
            app: name
          }
        },
        spec: {
          containers: [{
            name: name,
            image: imageName,
            imagePullPolicy: 'Never',
            // Use local minikube docker daemon image
            ports: [{
              containerPort: 3000 // Make this configurable based on type
            }]
          }]
        }
      }
    }
  };
  const serviceManifest = {
    metadata: {
      name: `${name}-service`
    },
    spec: {
      selector: {
        app: name
      },
      ports: [{
        port: 80,
        targetPort: 3000
      }],
      type: 'NodePort'
    }
  };

  // Create or Update Deployment
  try {
    await k8sApi.readNamespacedDeployment({
      name: `${name}-deployment`,
      namespace
    });
    await k8sApi.replaceNamespacedDeployment({
      name: `${name}-deployment`,
      namespace,
      body: deploymentManifest
    });
  } catch (err) {
    await k8sApi.createNamespacedDeployment({
      namespace,
      body: deploymentManifest
    });
  }

  // Create or Update Service
  try {
    await coreV1Api.readNamespacedService({
      name: `${name}-service`,
      namespace
    });
    await coreV1Api.replaceNamespacedService({
      name: `${name}-service`,
      namespace,
      body: serviceManifest
    });
  } catch (err) {
    await coreV1Api.createNamespacedService({
      namespace,
      body: serviceManifest
    });
  }
};
exports.deployToKubernetes = deployToKubernetes;