/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import userStoreInjectable from "./store.injectable";

const kubectlBinariesPathInjectable = getInjectable({
  instantiate: (di) => {
    const userStore = di.inject(userStoreInjectable);

    return computed(() => userStore.kubectlBinariesPath);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default kubectlBinariesPathInjectable;
