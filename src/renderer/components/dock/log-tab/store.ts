/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { IComputedValue, reaction } from "mobx";

import { IPodContainer, Pod } from "../../../../common/k8s-api/endpoints";
import type { WorkloadKubeObject } from "../../../../common/k8s-api/workload-kube-object";
import logger from "../../../../common/logger";
import { DockTabStore, DockTabStoreDependencies } from "../dock-tab/store";
import { DockTabCreate, DockTabCreateSpecific, DockTabData, TabId, TabKind } from "../store";

export interface LogTabData {
  pods: Pod[];
  selectedPod: Pod;
  selectedContainer: IPodContainer
  showTimestamps?: boolean
  previous?: boolean
}

interface PodLogsTabData {
  selectedPod: Pod
  selectedContainer: IPodContainer
}

interface WorkloadLogsTabData {
  workload: WorkloadKubeObject
}

export interface LogTabStoreDependencies extends DockTabStoreDependencies<LogTabData> {
  pods: IComputedValue<Pod[]>;
  getPodsByOwnerId: (id: string) => Pod[];
  renameDockTab: (tabId: TabId, name: string) => void;
  createDockTab: (rawTabDesc: DockTabCreate, addNumber?: boolean) => DockTabData;
  closeDockTab: (tabId: TabId) => void;
  uniqueId: (prefix?: string) => string;
}

export class LogTabStore extends DockTabStore<LogTabData> {
  constructor(protected readonly dependencies: LogTabStoreDependencies) {
    super(dependencies);

    reaction(() => [...this.dependencies.pods.get()], () => this.updateTabsData());
  }

  createPodTab({ selectedPod, selectedContainer }: PodLogsTabData): string {
    const podOwner = selectedPod.getOwnerRefs()[0];
    const pods = this.dependencies.getPodsByOwnerId(podOwner?.uid);

    return this.createLogsTab(`Pod ${selectedPod.getName()}`, {
      pods: pods.length ? pods : [selectedPod],
      selectedPod,
      selectedContainer,
    });
  }

  createWorkloadTab({ workload }: WorkloadLogsTabData): void {
    const pods = this.dependencies.getPodsByOwnerId(workload.getId());

    if (!pods.length) return;

    const selectedPod = pods[0];
    const selectedContainer = selectedPod.getAllContainers()[0];
    const title = `${workload.kind} ${selectedPod.getName()}`;

    this.createLogsTab(title, {
      pods,
      selectedPod,
      selectedContainer,
    });
  }

  renameTab(tabId: string) {
    const { selectedPod } = this.getData(tabId);

    this.dependencies.renameDockTab(tabId, `Pod ${selectedPod.metadata.name}`);
  }

  private createDockTab(tabParams: DockTabCreateSpecific) {
    this.dependencies.createDockTab({
      ...tabParams,
      kind: TabKind.POD_LOGS,
    }, false);
  }

  private createLogsTab(title: string, data: LogTabData): string {
    const id = this.dependencies.uniqueId("log-tab-");

    this.createDockTab({ id, title });
    this.setData(id, {
      ...data,
      showTimestamps: false,
      previous: false,
    });

    return id;
  }

  private updateTabsData() {
    for (const [tabId, tabData] of this.data) {
      try {
        if (!tabData.selectedPod) {
          tabData.selectedPod = tabData.pods[0];
        }

        const pod = tabData.selectedPod instanceof Pod
          ? tabData.selectedPod
          : new Pod(tabData.selectedPod);
        const pods = this.dependencies.getPodsByOwnerId(pod.getOwnerRefs()[0]?.uid);
        const isSelectedPodInList = pods.find(item => item.getId() == pod.getId());
        const selectedPod = isSelectedPodInList ? pod : pods[0];
        const selectedContainer = isSelectedPodInList ? tabData.selectedContainer : pod.getAllContainers()[0];

        if (pods.length > 0) {
          this.setData(tabId, {
            ...tabData,
            selectedPod,
            selectedContainer,
            pods,
          });

          this.renameTab(tabId);
        } else {
          this.closeTab(tabId);
        }
      } catch (error) {
        logger.error(`[LOG-TAB-STORE]: failed to set data for tabId=${tabId} deleting`, error);
        this.data.delete(tabId);
      }
    }
  }

  private closeTab(tabId: string) {
    this.clearData(tabId);
    this.dependencies.closeDockTab(tabId);
  }
}
