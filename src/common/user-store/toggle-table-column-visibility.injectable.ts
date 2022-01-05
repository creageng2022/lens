/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import userStoreInjectable from "./user-store.injectable";

const toggleTableColumnVisibilityInjectable = getInjectable({
  instantiate: (di) => di.inject(userStoreInjectable).toggleTableColumnVisibility,
  lifecycle: lifecycleEnum.singleton,
});

export default toggleTableColumnVisibilityInjectable;
