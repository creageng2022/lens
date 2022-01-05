/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import logTabStoreInjectable from "../log-tab/store.injectable";
import type { LogTabManager } from "./log-resource-selector";

const logTabManagerInjectable = getInjectable({
  instantiate: (di) => di.inject(logTabStoreInjectable) as LogTabManager,
  lifecycle: lifecycleEnum.singleton,
});

export default logTabManagerInjectable;
