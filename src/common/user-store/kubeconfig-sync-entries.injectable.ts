/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import userStoreInjectable from "./store.injectable";

const kubeconfigSyncEntriesInjectable = getInjectable({
  instantiate: (di) => di.inject(userStoreInjectable).syncKubeconfigEntries,
  lifecycle: lifecycleEnum.singleton,
});

export default kubeconfigSyncEntriesInjectable;
