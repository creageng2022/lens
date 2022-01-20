/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import dockStoreInjectable from "../store.injectable";
import newTerminalTabInjectable from "./create-tab.injectable";
import createTerminalInjectable from "./create-terminal.injectable";
import { TerminalStore } from "./store";

const terminalStoreInjectable = getInjectable({
  instantiate: di => new TerminalStore({
    dockStore: di.inject(dockStoreInjectable),
    newTerminalTab: di.inject(newTerminalTabInjectable),
    createTerminal: di.inject(createTerminalInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default terminalStoreInjectable;
