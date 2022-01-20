/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React, { useEffect } from "react";
import { Route, Router, Switch } from "react-router";
import { history } from "../../navigation";
import { ClusterManager } from "../../components/cluster-manager";
import { ErrorBoundary } from "../../components/error-boundary";
import { Notifications } from "../../components/notifications";
import { ConfirmDialog } from "../../components/confirm-dialog";
import { CommandContainer } from "../../components/command-palette/command-container";
import { ipcRenderer } from "electron";
import { IpcRendererNavigationEvents } from "../../navigation/events";
import { observer } from "mobx-react";

export const RootFrame = observer(() => {
  useEffect(() => {
    ipcRenderer.send(IpcRendererNavigationEvents.LOADED);
  }, []);

  return (
    <Router history={history}>
      <ErrorBoundary>
        <Switch>
          <Route component={ClusterManager} />
        </Switch>
      </ErrorBoundary>
      <Notifications />
      <ConfirmDialog />
      <CommandContainer />
    </Router>
  );
});
