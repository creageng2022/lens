/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { Cluster } from "../../common/cluster/cluster";
import directoryForTempInjectable from "../../common/app-paths/directory-for-temp.injectable";
import { KubeconfigManager } from "./kubeconfig-manager";
import getProxyPortInjectable from "../lens-proxy/get-proxy-port.injectable";

const createKubeconfigManagerInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies = {
      directoryForTemp: di.inject(directoryForTempInjectable),
      proxyPort: di.inject(getProxyPortInjectable),
    };

    return (cluster: Cluster) => new KubeconfigManager(dependencies, cluster);
  },

  lifecycle: lifecycleEnum.singleton,
});

export default createKubeconfigManagerInjectable;
