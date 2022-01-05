/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { CatalogEntity } from "../../common/catalog";
import { ClusterStore } from "../../common/cluster-store";
import type { Cluster } from "../../main/cluster";
import activeEntityInjectable from "./active-entity.injectable";

interface Dependencies {
  activeEntity: CatalogEntity | undefined | null;
}

function activeClusterEntity({ activeEntity }: Dependencies): Cluster | undefined {
  return ClusterStore.getInstance().getById(activeEntity?.getId());
}

const activeClusterEntityInjectable = getInjectable({
  instantiate: (di) => activeClusterEntity({
    activeEntity: di.inject(activeEntityInjectable).get(),
  }),
  lifecycle: lifecycleEnum.transient,
});

export default activeClusterEntityInjectable;
