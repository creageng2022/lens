/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React, { useEffect, useRef, useState } from "react";
import { reaction } from "mobx";
import { observer } from "mobx-react";

import type { LogSearchStore } from "../log-search/store";
import { cssNames } from "../../../utils";
import type { DockTabData } from "../store";
import { InfoPanel } from "../info-panel/info-panel";
import { LogResourceSelector } from "./log-resource-selector";
import { LogList } from "./log-list";
import type { LogsStore } from "./store";
import { LogSearch } from "../log-search/log-search";
import { LogControls } from "./log-controls";
import type { LogTabStore } from "../log-tab/store";
import { withInjectables } from "@ogre-tools/injectable-react";
import logSearchStoreInjectable from "../log-search/store.injectable";
import logTabStoreInjectable from "../log-tab/store.injectable";
import logsStoreInjectable from "./store.injectable";

export interface LogsProps {
  className?: string
  tab: DockTabData
}

interface Dependencies {
  logSearchStore: LogSearchStore;
  logTabStore: LogTabStore;
  logsStore: LogsStore;
}

const NonInjectedLogs = observer(({ className, tab, logTabStore, logSearchStore, logsStore }: Dependencies & LogsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const logListElement = useRef<React.ElementRef<typeof LogList>>();

  const load = async () => {
    setIsLoading(true);
    await logsStore.load();
    setIsLoading(false);
  };
  const reload = async () => {
    logsStore.clearLogs(tab.id);
    await load();
  };
  const toOverlay = () => {
    const { activeOverlayLine } = logSearchStore;

    if (!logListElement.current || activeOverlayLine === undefined) return;
    // Scroll vertically
    logListElement.current.scrollToItem(activeOverlayLine, "center");
    // Scroll horizontally in timeout since virtual list need some time to prepare its contents
    setTimeout(() => {
      const overlay = document.querySelector(".PodLogs .list span.active");

      if (!overlay) return;
      overlay.scrollIntoViewIfNeeded();
    }, 100);
  };

  useEffect(() => reaction(
    () => tab.id,
    reload,
    { fireImmediately: true },
  ), []);

  const logs = logsStore.logs;
  const data = logTabStore.getData(tab.id);
  const resourceSelector = data
    ? (
      <InfoPanel
        tabId={tab.id}
        showSubmitClose={false}
        showButtons={false}
        showStatusPanel={false}
        controls={(
          <div className="flex gaps">
            <LogResourceSelector
              tabId={tab.id}
              tabData={data}
              save={newData => logTabStore.setData(tab.id, { ...data, ...newData })}
            />
            <LogSearch
              onSearch={toOverlay}
              logs={data.showTimestamps ? logsStore.logs : logsStore.logsWithoutTimestamps}
              toPrevOverlay={toOverlay}
              toNextOverlay={toOverlay}
            />
          </div>
        )}
      />
    )
    : null;

  return (
    <div className={cssNames("PodLogs flex column", className)}>
      {resourceSelector}
      <LogList
        logs={logs}
        id={tab.id}
        isLoading={isLoading}
        load={load}
        ref={logListElement}
      />
      <LogControls
        logs={logs}
        tabData={data}
        save={newData => logTabStore.setData(tab.id, { ...data, ...newData })}
      />
    </div>
  );
});

export const Logs = withInjectables<Dependencies, LogsProps>(NonInjectedLogs, {
  getProps: (di, props) => ({
    logSearchStore: di.inject(logSearchStoreInjectable),
    logTabStore: di.inject(logTabStoreInjectable),
    logsStore: di.inject(logsStoreInjectable),
    ...props,
  }),
});
