import * as k8s from '@kubernetes/client-node';
import { writeFile } from 'fs/promises';
export const getInformer = (kubeConfig: k8s.KubeConfig): k8s.Informer<k8s.V1Pod> & k8s.ObjectCache<k8s.V1Pod> => {
  const k8sApi = kubeConfig.makeApiClient(k8s.CoreV1Api);

  const listFn = () => k8sApi.listNamespacedPod('default');

  const informer = k8s.makeInformer(kubeConfig, '/api/v1/namespaces/default/pods', listFn);
  let updateCount = 0;
  let addedCount = 0;
  let deleteCount = 0;
  informer.on('add', async (obj: k8s.V1Pod) => {
    console.log(`Added: ${obj.metadata!.name}`);
    await writeFile(`./AddedObjSample-${addedCount}.json`, JSON.stringify(obj, null, 4));
    addedCount++;
  });
  informer.on('update', async (obj: k8s.V1Pod) => {
    await writeFile(`./UpdateObjSample-${updateCount}.json`, JSON.stringify(obj, null, 4));
    updateCount++;
    console.log(`Updated: ${obj.metadata!.name}`);
  });
  informer.on('delete', async (obj: k8s.V1Pod) => {
    await writeFile(`./DeleteObjSample-${deleteCount}.json`, JSON.stringify(obj, null, 4));
    deleteCount++;
    console.log(`Deleted: ${obj.metadata!.name}`);
  });
  informer.on('error', (err: k8s.V1Pod) => {
    console.error(err);
    // Restart informer after 5sec
    setTimeout(() => {
      informer.start();
    }, 5000);
  });
  return informer;
};
