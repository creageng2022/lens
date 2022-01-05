/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { computed } from "mobx";
import { HotbarStore } from "./store";

const activeHotbarInjectable = getInjectable({
  instantiate: () => {
    const hotbarStore = HotbarStore.getInstance();

    return computed(() => hotbarStore.getActive());
  },
  lifecycle: lifecycleEnum.singleton,
});

export default activeHotbarInjectable;
