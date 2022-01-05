/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./log-search.scss";

import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { SearchInput } from "../../input";
import type { LogSearchStore } from "./store";
import { Icon } from "../../icon";
import { withInjectables } from "@ogre-tools/injectable-react";
import logSearchStoreInjectable from "./store.injectable";

export interface LogSearchProps {
  onSearch: (query: string) => void
  toPrevOverlay: () => void
  toNextOverlay: () => void
  logs: string[];
}

interface Dependencies {
  logSearchStore: LogSearchStore;
}

const NonInjectedLogSearch = observer(({ logSearchStore, logs, onSearch, toPrevOverlay, toNextOverlay }: Dependencies & LogSearchProps) => {
  const { searchQuery, occurrences, activeFind, totalFinds } = logSearchStore;
  const jumpDisabled = !searchQuery || !occurrences.length;
  const findCounts = (
    <div className="find-count">
      {activeFind}/{totalFinds}
    </div>
  );

  const setSearch = (query: string) => {
    logSearchStore.onSearch(logs, query);
    onSearch(query);
  };

  const onPrevOverlay = () => {
    logSearchStore.setPrevOverlayActive();
    toPrevOverlay();
  };

  const onNextOverlay = () => {
    logSearchStore.setNextOverlayActive();
    toNextOverlay();
  };

  const onClear = () => {
    setSearch("");
  };

  const onKeyDown = (evt: React.KeyboardEvent<any>) => {
    if (evt.key === "Enter") {
      onNextOverlay();
    }
  };

  useEffect(() => {
    // Refresh search when logs changed
    logSearchStore.onSearch(logs);
  }, [logs]);

  return (
    <div className="LogSearch flex box grow justify-flex-end gaps align-center">
      <SearchInput
        value={searchQuery}
        onChange={setSearch}
        showClearIcon={true}
        contentRight={totalFinds > 0 && findCounts}
        onClear={onClear}
        onKeyDown={onKeyDown}
      />
      <Icon
        material="keyboard_arrow_up"
        tooltip="Previous"
        onClick={onPrevOverlay}
        disabled={jumpDisabled}
      />
      <Icon
        material="keyboard_arrow_down"
        tooltip="Next"
        onClick={onNextOverlay}
        disabled={jumpDisabled}
      />
    </div>
  );
});

export const LogSearch = withInjectables<Dependencies, LogSearchProps>(NonInjectedLogSearch, {
  getProps: (di, props) => ({
    logSearchStore: di.inject(logSearchStoreInjectable),
    ...props,
  }),
});
