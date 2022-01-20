/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ClusterMetadataKey, ClusterModel } from "../../common/cluster-types";
import { Cluster, ClusterDependencies } from "../../common/cluster/cluster";
import directoryForKubeConfigsInjectable from "../../common/app-paths/directory-for-kube-configs.injectable";
import createKubeconfigManagerInjectable from "../kubeconfig-manager/create-kubeconfig-manager.injectable";
import createKubectlInjectable from "../kubectl/create-kubectl.injectable";
import createContextHandlerInjectable from "../context-handler/create-context-handler.injectable";
import { createClusterInjectionToken } from "../../common/cluster/create-cluster-injection-token";
import detectMetadataForClusterInjectable from "../cluster-detectors/detect-metadata-for-cluster.injectable";
import detectSpecificForClusterInjectable from "../cluster-detectors/detect-specific-for-cluster.injectable";

const createClusterInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: ClusterDependencies = {
      directoryForKubeConfigs: di.inject(directoryForKubeConfigsInjectable),
      createKubeconfigManager: di.inject(createKubeconfigManagerInjectable),
      createKubectl: di.inject(createKubectlInjectable),
      createContextHandler: di.inject(createContextHandlerInjectable),
      detectMetadataForCluster: di.inject(detectMetadataForClusterInjectable),
      detectVersion: di.inject(detectSpecificForClusterInjectable, {
        key: ClusterMetadataKey.VERSION,
      }),
    };

    return (model: ClusterModel) => new Cluster(dependencies, model);
  },

  injectionToken: createClusterInjectionToken,

  lifecycle: lifecycleEnum.singleton,
});

export default createClusterInjectable;
