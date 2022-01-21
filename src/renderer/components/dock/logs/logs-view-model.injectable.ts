/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import logTabStoreInjectable from "./tab-store.injectable";
import { LogsViewModel } from "./logs-view-model";
import type { TabId } from "../dock-store/dock.store";
import logStoreInjectable from "./store.injectable";

export interface InstantiateArgs {
  tabId: TabId;
}

const logsViewModelInjectable = getInjectable({
  instantiate: (di, { tabId }: InstantiateArgs) => new LogsViewModel(tabId, {
    logTabStore: di.inject(logTabStoreInjectable),
    logStore: di.inject(logStoreInjectable),
  }),
  lifecycle: lifecycleEnum.transient,
});

export default logsViewModelInjectable;
