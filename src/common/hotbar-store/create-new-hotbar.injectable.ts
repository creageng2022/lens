/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import hotbarManagerInjectable from "./store.injectable";

const createNewHotbarInjectable = getInjectable({
  instantiate: (di) => di.inject(hotbarManagerInjectable).add,
  lifecycle: lifecycleEnum.singleton,
});

export default createNewHotbarInjectable;
