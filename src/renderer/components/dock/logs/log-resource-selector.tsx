/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./log-resource-selector.scss";

import React, { useEffect } from "react";
import { observer } from "mobx-react";

import { Pod } from "../../../../common/k8s-api/endpoints";
import { Badge } from "../../badge";
import { Select, SelectOption } from "../../select";
import type { LogTabData } from "../log-tab/store";
import type { PodStore } from "../../+pods/store";
import type { TabId } from "../store";
import { withInjectables } from "@ogre-tools/injectable-react";
import podStoreInjectable from "../../+pods/store.injectable";
import logTabManagerInjectable from "./log-tab-manager.injectable";
import reloadLogsInjectable from "./reload-logs.injectable";

export interface LogResourceSelectorProps {
  tabId: TabId
  tabData: LogTabData
  save: (data: Partial<LogTabData>) => void
}

export interface LogTabManager {
  renameTab: (tabId: TabId) => void;
}

interface Dependencies {
  logTabManager: LogTabManager;
  podStore: PodStore;
  reloadLogs: () => Promise<void>;
}

const NonInjectedLogResourceSelector = observer(({ podStore, tabId, tabData, save, reloadLogs, logTabManager }: Dependencies & LogResourceSelectorProps) => {
  const { selectedPod, selectedContainer, pods } = tabData;
  const pod = new Pod(selectedPod);
  const containers = pod.getContainers();
  const initContainers = pod.getInitContainers();

  const onContainerChange = (option: SelectOption) => {
    save({
      selectedContainer: containers
        .concat(initContainers)
        .find(container => container.name === option.value),
    });

    reloadLogs();
  };

  const onPodChange = (option: SelectOption) => {
    const selectedPod = podStore.getByName(option.value, pod.getNs());

    save({ selectedPod });
    logTabManager.renameTab(tabId);
  };

  const getSelectOptions = (items: string[]) => {
    return items.map(item => {
      return {
        value: item,
        label: item,
      };
    });
  };

  const containerSelectOptions = [
    {
      label: `Containers`,
      options: getSelectOptions(containers.map(container => container.name)),
    },
    {
      label: `Init Containers`,
      options: getSelectOptions(initContainers.map(container => container.name)),
    },
  ];

  const podSelectOptions = [
    {
      label: pod.getOwnerRefs()[0]?.name,
      options: getSelectOptions(pods.map(pod => pod.metadata.name)),
    },
  ];

  useEffect(() => {
    reloadLogs();
  }, [selectedPod]);

  return (
    <div className="LogResourceSelector flex gaps align-center">
      <span>Namespace</span> <Badge data-testid="namespace-badge" label={pod.getNs()} />
      <span>Pod</span>
      <Select
        options={podSelectOptions}
        value={{ label: pod.getName(), value: pod.getName() }}
        onChange={onPodChange}
        autoConvertOptions={false}
        className="pod-selector"
      />
      <span>Container</span>
      <Select
        options={containerSelectOptions}
        value={{ label: selectedContainer.name, value: selectedContainer.name }}
        onChange={onContainerChange}
        autoConvertOptions={false}
        className="container-selector"
      />
    </div>
  );
});

export const LogResourceSelector = withInjectables<Dependencies, LogResourceSelectorProps>(NonInjectedLogResourceSelector, {
  getProps: (di, props) => ({
    logTabManager: di.inject(logTabManagerInjectable),
    podStore: di.inject(podStoreInjectable),
    reloadLogs: di.inject(reloadLogsInjectable),
    ...props,
  }),
});
