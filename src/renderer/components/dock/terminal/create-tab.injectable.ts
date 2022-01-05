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

function newTerminalTab({ createDockTab }: Dependencies, tabParams: DockTabCreateSpecific = {}) {
  return createDockTab({
    title: `Terminal`,
    ...tabParams,
    kind: TabKind.TERMINAL,
  });
}

const newTerminalTabInjectable = getInjectable({
  instantiate: (di) => bind(newTerminalTab, null, {
    createDockTab: di.inject(dockStoreInjectable).createTab,
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default newTerminalTabInjectable;
