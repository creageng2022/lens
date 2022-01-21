/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { LogTabData, LogTabStore } from "./tab.store";
import type { LogStore } from "./store";
import { computed } from "mobx";
import type { TabId } from "../dock-store/dock.store";
import { SearchStore } from "../../../search-store/search-store";

interface Dependencies {
  logTabStore: LogTabStore
  logStore: LogStore
}

export class LogsViewModel {
  constructor(protected tabId: TabId, private dependencies: Dependencies) {}

  readonly logs = computed(() => this.dependencies.logStore.getLogsByTabId(this.tabId));
  readonly logsWithoutTimestamps = computed(() => this.dependencies.logStore.getLogsWithoutTimestampsByTabId(this.tabId));
  readonly timestampSplitLogs = computed(() => this.dependencies.logStore.getTimestampSplitLogsByTabId(this.tabId));
  readonly logTabData = computed(() => this.dependencies.logTabStore.getData(this.tabId));
  readonly searchStore = new SearchStore();

  updateLogTabData = (newTabs: Partial<LogTabData>) => {
    this.dependencies.logTabStore.setData(this.tabId, { ...this.logTabData.get(), ...newTabs });
  };

  loadLogs = () => this.dependencies.logStore.load(this.tabId);
  reloadLogs = () => this.dependencies.logStore.reload(this.tabId);

  updateTabName = () => {
    this.dependencies.logTabStore.updateTabName(this.tabId);
  };
}
