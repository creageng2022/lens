/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { bind } from "../../../utils";
import { DockTabCreate, DockTabCreateSpecific, DockTabData, TabKind } from "../store";
import dockStoreInjectable from "../store.injectable";

interface Dependencies {
  createDockTab: (rawTabDesc: DockTabCreate, addNumber?: boolean) => DockTabData;
}

function newCreateResourceTab({ createDockTab }: Dependencies, tabParams: DockTabCreateSpecific = {}) {
  return createDockTab({
    title: "Create resource",
    ...tabParams,
    kind: TabKind.CREATE_RESOURCE,
  });
}

const newCreateResourceTabInjectable = getInjectable({
  instantiate: di => bind(newCreateResourceTab, null, {
    createDockTab: di.inject(dockStoreInjectable).createTab,
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default newCreateResourceTabInjectable;
