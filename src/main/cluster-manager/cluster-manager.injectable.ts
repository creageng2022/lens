/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { ClusterStore } from "../../common/cluster-store";
import catalogEntityRegistryInjectable from "../catalog/entity-registry.injectable";
import { ClusterManager } from "./cluster-manager";

const clusterManagerInjectable = getInjectable({
  instantiate: (di) => new ClusterManager({
    clusterStore: ClusterStore.getInstance(),
    entityRegistry: di.inject(catalogEntityRegistryInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default clusterManagerInjectable;
