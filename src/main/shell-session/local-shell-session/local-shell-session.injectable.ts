/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { LocalShellSession, LocalShellSessionDependencies } from "./local-shell-session";
import type { Cluster } from "../../../common/cluster/cluster";
import type WebSocket from "ws";
import createKubectlInjectable from "../../kubectl/create-kubectl.injectable";
import downloadKubectlBinariesInjectable from "../../../common/user-store/download-kubectl-binaries.injectable";
import resolvedShellInjectable from "../../../common/user-store/resolved-shell-injectable";
import kubectlBinariesPathInjectable from "../../../common/user-store/kubectl-binaries-path.injectable";

interface InstantiationParameter {
  webSocket: WebSocket;
  cluster: Cluster;
  tabId: string;
}

const localShellSessionInjectable = getInjectable({
  instantiate: (di, { cluster, tabId, webSocket }: InstantiationParameter) => {
    const dependencies: LocalShellSessionDependencies = {
      downloadKubectlBinaries: di.inject(downloadKubectlBinariesInjectable),
      resolvedShell: di.inject(resolvedShellInjectable),
      kubectlBinariesPath: di.inject(kubectlBinariesPathInjectable),
    };

    const createKubectl = di.inject(createKubectlInjectable);
    const kubectl = createKubectl(cluster.version);

    return new LocalShellSession(kubectl, webSocket, cluster, tabId, dependencies);
  },

  lifecycle: lifecycleEnum.transient,
});

export default localShellSessionInjectable;
