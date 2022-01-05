/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import type { HelmRelease } from "../../../common/k8s-api/endpoints/helm-release.api";
import { cssNames, noop } from "../../utils";
import type { ReleaseStore } from "./store";
import { MenuActions, MenuActionsProps } from "../menu/menu-actions";
import { MenuItem } from "../menu";
import { Icon } from "../icon";
import { withInjectables } from "@ogre-tools/injectable-react";
import newUpgradeChartTabInjectable from "../dock/upgrade-chart/create-tab.injectable";
import { observer } from "mobx-react";
import releaseStoreInjectable from "./store.injectable";
import openHelmReleaseRollbackDialogInjectable from "./rollback-dialog-open.injectable";

export interface HelmReleaseMenuProps extends MenuActionsProps {
  release: HelmRelease | null | undefined;
  hideDetails?: () => void;
}

interface Dependencies {
  newUpgradeChartTab: (release: HelmRelease) => void;
  releaseStore: ReleaseStore;
  openRollbackReleaseDialog: (release: HelmRelease) => void;
}

const NonInjectedHelmReleaseMenu = observer(({
  newUpgradeChartTab,
  release,
  hideDetails = noop,
  releaseStore,
  openRollbackReleaseDialog,
  toolbar,
  className,
  ...menuProps
}: Dependencies & HelmReleaseMenuProps) => {
  if (!release) {
    return null;
  }

  const remove = () => releaseStore.remove(release);
  const upgrade = () => {
    newUpgradeChartTab(release);
    hideDetails();
  };
  const rollback = () => openRollbackReleaseDialog(release);

  return (
    <MenuActions
      {...menuProps}
      className={cssNames("HelmReleaseMenu", className)}
      removeAction={remove}
      removeConfirmationMessage={() => <p>Remove Helm Release <b>{release.name}</b>?</p>}
    >
      {release.getRevision() > 1 && (
        <MenuItem onClick={rollback}>
          <Icon material="history" interactive={toolbar} tooltip="Rollback"/>
          <span className="title">Rollback</span>
        </MenuItem>
      )}
      <MenuItem onClick={upgrade}>
        <Icon material="refresh" interactive={toolbar} tooltip="Upgrade"/>
        <span className="title">Upgrade</span>
      </MenuItem>
    </MenuActions>
  );
});

export const HelmReleaseMenu = withInjectables<Dependencies, HelmReleaseMenuProps>(NonInjectedHelmReleaseMenu, {
  getProps: (di, props) => ({
    newUpgradeChartTab: di.inject(newUpgradeChartTabInjectable),
    releaseStore: di.inject(releaseStoreInjectable),
    openRollbackReleaseDialog: di.inject(openHelmReleaseRollbackDialogInjectable),
    ...props,
  }),
});
