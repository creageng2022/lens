/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import k8sRequestInjectable from "../k8s-api/k8s-request.injectable";
import { ClusterIdDetector } from "./cluster-id-detector";
import { DetectorRegistry } from "./detector-registry";
import { DistributionDetector } from "./distribution-detector";
import { LastSeenDetector } from "./last-seen-detector";
import { NodesCountDetector } from "./nodes-count-detector";
import { VersionDetector } from "./version-detector";

const detectorRegistryInjectable = getInjectable({
  instantiate: (di) => {
    const registry = new DetectorRegistry({
      k8sRequest: di.inject(k8sRequestInjectable),
    });

    registry.add(ClusterIdDetector);
    registry.add(LastSeenDetector);
    registry.add(VersionDetector);
    registry.add(DistributionDetector);
    registry.add(NodesCountDetector);

    return registry;
  },
  lifecycle: lifecycleEnum.singleton,
});

export default detectorRegistryInjectable;
