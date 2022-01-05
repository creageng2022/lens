/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createResourceStorageInjectable from "./storage.injectable";
import { CreateResourceStore } from "./store";

const createResourceStoreInjectable = getInjectable({
  instantiate: di => new CreateResourceStore({
    storage: di.inject(createResourceStorageInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default createResourceStoreInjectable;
