/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { Terminal, TerminalDependencies } from "./terminal";
import type { TabId } from "../store";
import type { TerminalApi } from "../../../api/terminal-api";
import dockStoreInjectable from "../store.injectable";
import terminalColorsInjectable from "../../../themes/terminal-colors.injectable";
import terminalCopyOnSelectInjectable from "../../../../common/user-preferences/terminal-copy-on-select.injectable";
import terminalConfigInjectable from "../../../../common/user-preferences/terminal-config.injectable";

const createTerminalInjectable = getInjectable({
  instantiate: (di) => {
    const dependencies: TerminalDependencies = {
      dockStore: di.inject(dockStoreInjectable),
      terminalColors: di.inject(terminalColorsInjectable),
      terminalCopyOnSelect: di.inject(terminalCopyOnSelectInjectable),
      terminalConfig: di.inject(terminalConfigInjectable),
    };

    return (tabId: TabId, api: TerminalApi) => new Terminal(dependencies, tabId, api);
  },

  lifecycle: lifecycleEnum.singleton,
});

export default createTerminalInjectable;
