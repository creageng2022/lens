/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { StorageLayer } from "../../utils";
import createStorageInjectable from "../../utils/create-storage/create-storage.injectable";
import { DockStorageState, DockStore, TabKind } from "./store";

let storage: StorageLayer<DockStorageState>;

const dockStoreInjectable = getInjectable({
  setup: async (di) => {
    storage = await di.inject(createStorageInjectable)<DockStorageState>("dock", {
      height: 300,
      tabs: [
        { id: "terminal", kind: TabKind.TERMINAL, title: "Terminal", pinned: false },
      ],
    });
  },
  instantiate: () => new DockStore({ storage }),
  lifecycle: lifecycleEnum.singleton,
});

export default dockStoreInjectable;
