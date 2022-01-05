/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { ClusterStore } from "../../common/cluster-store";
import { getHostedClusterId } from "../utils";

const currentClusterInjectable = getInjectable({
  instantiate: () => computed(() => ClusterStore.getInstance().getById(getHostedClusterId())),
  lifecycle: lifecycleEnum.singleton,
});

export default currentClusterInjectable;
