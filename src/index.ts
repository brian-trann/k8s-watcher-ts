import * as k8s from '@kubernetes/client-node';
import { getInformer } from './informer.js';
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
kc.setCurrentContext('minikube');

const main = async () => {
  const ctx = kc.getCurrentContext();
  console.log('Current Context: ', ctx);
  const informer = getInformer(kc)
  informer.start()
};

main();
