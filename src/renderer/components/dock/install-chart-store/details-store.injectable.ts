/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { IReleaseUpdateDetails } from "../../../../common/k8s-api/endpoints";
import { DockTabStore } from "../dock-tab/store";

const installChartDetailsStoreInjectable = getInjectable({
  instantiate: () => new DockTabStore<IReleaseUpdateDetails>({}),
  lifecycle: lifecycleEnum.singleton,
});

export default installChartDetailsStoreInjectable;
