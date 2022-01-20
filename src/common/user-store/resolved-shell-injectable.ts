/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import userStoreInjectable from "./store.injectable";

const resolvedShellInjectable = getInjectable({
  instantiate: (di) => di.inject(userStoreInjectable).resolvedShell,
  lifecycle: lifecycleEnum.singleton,
});

export default resolvedShellInjectable;
