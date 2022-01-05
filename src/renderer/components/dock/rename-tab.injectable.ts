/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import dockStoreInjectable from "./store.injectable";

const renameDockTabInjectable = getInjectable({
  instantiate: (di) => di.inject(dockStoreInjectable).renameTab,
  lifecycle: lifecycleEnum.singleton,
});

export default renameDockTabInjectable;
