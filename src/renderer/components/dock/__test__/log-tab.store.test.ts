/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { PodStore } from "../../+pods/store";
import { deploymentPod1, deploymentPod2, deploymentPod3, dockerPod } from "./pod.mock";
import type { LogTabStore } from "../log-tab/store";
import type { ConfigurableDependencyInjectionContainer } from "@ogre-tools/injectable";
import { getDiForUnitTesting } from "../../../getDiForUnitTesting";
import logTabStoreInjectable from "../log-tab/store.injectable";
import podStoreInjectable from "../../+pods/store.injectable";
import type { DockTabCreate, DockTabData, TabId } from "../store";
import closeDockTabInjectable from "../close-tab.injectable";
import createDockTabInjectable from "../create-tab.injectable";
import renameDockTabInjectable from "../rename-tab.injectable";
import logTabStorageInjectable from "../log-tab/storage.injectable";

describe("log tab store", () => {
  let di: ConfigurableDependencyInjectionContainer;
  let logTabStore: LogTabStore;
  let podStore: PodStore;
  let renameDockTab: jest.Mock<void, [tabId: TabId, name: string]>;
  let createDockTab: jest.Mock<DockTabData, [rawTabDesc: DockTabCreate, addNumber?: boolean]>;
  let closeDockTab: jest.Mock<void, [tabId: TabId]>;

  beforeEach(() => {
    di = getDiForUnitTesting();

    renameDockTab = jest.fn();
    createDockTab = jest.fn();
    closeDockTab = jest.fn();

    di.override(renameDockTabInjectable, () => renameDockTab);
    di.override(createDockTabInjectable, () => createDockTab);
    di.override(closeDockTabInjectable, () => closeDockTab);
    di.override(logTabStorageInjectable, () => undefined);

    logTabStore = di.inject(logTabStoreInjectable);
    podStore = di.inject(podStoreInjectable);

    podStore.items.replace([
      dockerPod,
      deploymentPod1,
      deploymentPod2,
    ]);
  });

  it("creates log tab without sibling pods", () => {
    const selectedPod = dockerPod;
    const selectedContainer = selectedPod.getAllContainers()[0];

    const id = logTabStore.createPodTab({
      selectedPod,
      selectedContainer,
    });

    expect(logTabStore.getData(id)).toEqual({
      pods: [selectedPod],
      selectedPod,
      selectedContainer,
      showTimestamps: false,
      previous: false,
    });
  });

  it("creates log tab with sibling pods", () => {
    const selectedPod = deploymentPod1;
    const siblingPod = deploymentPod2;
    const selectedContainer = selectedPod.getInitContainers()[0];

    const id = logTabStore.createPodTab({
      selectedPod,
      selectedContainer,
    });

    expect(logTabStore.getData(id)).toEqual({
      pods: [selectedPod, siblingPod],
      selectedPod,
      selectedContainer,
      showTimestamps: false,
      previous: false,
    });
  });

  it("removes item from pods list if pod deleted from store", () => {
    const selectedPod = deploymentPod1;
    const selectedContainer = selectedPod.getInitContainers()[0];

    const id = logTabStore.createPodTab({
      selectedPod,
      selectedContainer,
    });

    podStore.items.pop();

    expect(logTabStore.getData(id)).toEqual({
      pods: [selectedPod],
      selectedPod,
      selectedContainer,
      showTimestamps: false,
      previous: false,
    });
  });

  it("adds item into pods list if new sibling pod added to store", () => {
    const selectedPod = deploymentPod1;
    const selectedContainer = deploymentPod1.getInitContainers()[0];

    const id = logTabStore.createPodTab({
      selectedPod,
      selectedContainer,
    });

    podStore.items.push(deploymentPod3);

    expect(logTabStore.getData(id)).toEqual({
      pods: [selectedPod, deploymentPod2, deploymentPod3],
      selectedPod,
      selectedContainer,
      showTimestamps: false,
      previous: false,
    });
  });
});
