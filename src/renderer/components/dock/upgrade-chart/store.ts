/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { action, autorun, computed, IReactionDisposer, makeObservable, reaction } from "mobx";
import { getReleaseValues, HelmRelease } from "../../../../common/k8s-api/endpoints/helm-release.api";
import { iter } from "../../../utils";
import { DockTabStore, DockTabStoreDependencies } from "../dock-tab/store";
import { DockStore, DockTabData, TabId, TabKind } from "../store";
import type { IAsyncComputed } from "@ogre-tools/injectable-react";

export interface IChartUpgradeData {
  releaseName: string;
  releaseNamespace: string;
}

export interface UpgradeChartStoreDependencies extends DockTabStoreDependencies<IChartUpgradeData> {
  releases: IAsyncComputed<HelmRelease[]>;
  valuesStore: DockTabStore<string>;
  dockStore: DockStore;
}

export class UpgradeChartStore extends DockTabStore<IChartUpgradeData> {
  private watchers = new Map<string, IReactionDisposer>();

  @computed private get releaseNameReverseLookup(): Map<string, string> {
    return new Map(iter.map(this.data, ([id, { releaseName }]) => [releaseName, id]));
  }

  constructor(protected readonly dependencies: UpgradeChartStoreDependencies) {
    super(dependencies);

    makeObservable(this);

    autorun(() => {
      const { selectedTab, isOpen } = this.dependencies.dockStore;

      if (selectedTab?.kind === TabKind.UPGRADE_CHART && isOpen) {
        this.loadData(selectedTab.id);
      }
    }, { delay: 250 });

    autorun(() => {
      const objects = [...this.data.values()];

      objects.forEach(({ releaseName }) => this.createReleaseWatcher(releaseName));
    });
  }

  private createReleaseWatcher(releaseName: string) {
    if (this.watchers.get(releaseName)) {
      return;
    }
    const dispose = reaction(() => {
      const release = this.dependencies.releases.value.get().find(release => release.getName() === releaseName);

      return release?.getRevision(); // watch changes only by revision
    },
    release => {
      const releaseTab = this.getTabByRelease(releaseName);

      if (!releaseTab) {
        return;
      }

      // auto-reload values if was loaded before
      if (release) {
        if (this.dependencies.dockStore.selectedTab === releaseTab && this.dependencies.valuesStore.getData(releaseTab.id)) {
          this.loadValues(releaseTab.id);
        }
      }
      // clean up watcher, close tab if release not exists / was removed
      else {
        dispose();
        this.watchers.delete(releaseName);
        this.dependencies.dockStore.closeTab(releaseTab.id);
      }
    });

    this.watchers.set(releaseName, dispose);
  }

  isLoading(tabId = this.dependencies.dockStore.selectedTabId) {
    const values = this.dependencies.valuesStore.getData(tabId);

    return values === undefined;
  }

  @action
  async loadData(tabId: TabId) {
    const values = this.dependencies.valuesStore.getData(tabId);

    await Promise.all([
      !values && this.loadValues(tabId),
    ]);
  }

  @action
  async loadValues(tabId: TabId) {
    this.dependencies.valuesStore.clearData(tabId); // reset
    const { releaseName, releaseNamespace } = this.getData(tabId);
    const values = await getReleaseValues(releaseName, releaseNamespace, true);

    this.dependencies.valuesStore.setData(tabId, values);
  }

  getTabByRelease(releaseName: string): DockTabData {
    return this.dependencies.dockStore.getTabById(this.releaseNameReverseLookup.get(releaseName));
  }
}
