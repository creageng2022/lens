/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Cluster } from "../../../common/cluster/cluster";
import type WebSocket from "ws";
import createKubectlInjectable from "../../kubectl/create-kubectl.injectable";
import { NodeShellSession } from "./node-shell-session";
import createKubeJsonApiForClusterInjectable from "../../k8s-api/create-kube-json-api-for-cluster.injectable";

interface InstantiationParameter {
  webSocket: WebSocket;
  cluster: Cluster;
  tabId: string;
  nodeName: string;
}

const nodeShellSessionInjectable = getInjectable({
  instantiate: (di, { cluster, tabId, webSocket, nodeName }: InstantiationParameter) => {
    const createKubectl = di.inject(createKubectlInjectable);
    const createKubeJsonApiForCluster = di.inject(createKubeJsonApiForClusterInjectable);

    const kubectl = createKubectl(cluster.version);

    return new NodeShellSession(nodeName, kubectl, webSocket, cluster, tabId, {
      createKubeJsonApiForCluster,
    });
  },

  lifecycle: lifecycleEnum.transient,
});

export default nodeShellSessionInjectable;
