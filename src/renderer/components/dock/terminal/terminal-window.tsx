/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./terminal-window.scss";

import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { cssNames, disposer } from "../../../utils";
import type { Terminal } from "./terminal";
import type { TerminalStore } from "./store";
import { ThemeStore } from "../../../theme-store/theme.store";
import { TabKind, TabId, DockStore } from "../store";
import { withInjectables } from "@ogre-tools/injectable-react";
import dockStoreInjectable from "../store.injectable";
import terminalStoreInjectable from "./store.injectable";

interface Dependencies {
  dockStore: DockStore;
  terminalStore: TerminalStore;
}

const NonInjectedTerminalWindow = observer(({ dockStore, terminalStore }: Dependencies) => {
  const element = useRef<HTMLDivElement>();
  const [terminal, setTerminal] = useState<Terminal | null>(null);

  const activate = (tabId: TabId) => {
    terminal?.detach(); // detach previous

    const newTerminal = terminalStore.getTerminal(tabId);

    setTerminal(newTerminal);
    newTerminal.attachTo(element.current);
  };

  useEffect(() => disposer(
    dockStore.onTabChange(({ tabId }) => activate(tabId), {
      tabKind: TabKind.TERMINAL,
      fireImmediately: true,
    }),

    // refresh terminal available space (cols/rows) when <Dock/> resized
    dockStore.onResize(() => terminal?.fitLazy(), {
      fireImmediately: true,
    }),
  ), []);

  return (
    <div
      className={cssNames("TerminalWindow", ThemeStore.getInstance().activeTheme.type)}
      ref={element}
    />
  );
});

export const TerminalWindow = withInjectables<Dependencies>(NonInjectedTerminalWindow, {
  getProps: (di, props) => ({
    dockStore: di.inject(dockStoreInjectable),
    terminalStore: di.inject(terminalStoreInjectable),
    ...props,
  }),
});
