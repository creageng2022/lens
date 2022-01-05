/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import logsStoreInjectable from "./store.injectable";

const reloadLogsInjectable = getInjectable({
  instantiate: (di) => di.inject(logsStoreInjectable).reload,
  lifecycle: lifecycleEnum.singleton,
});

export default reloadLogsInjectable;
