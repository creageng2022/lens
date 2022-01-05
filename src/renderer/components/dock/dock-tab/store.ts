/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { makeObservable, observable, reaction } from "mobx";
import { autoBind, StorageLayer, toJS } from "../../../utils";
import type { TabId } from "../store";

export interface DockTabStoreDependencies<T> {
  storage?: StorageLayer<DockTabStorageState<T>>;
}

export type DockTabStorageState<T> = Record<TabId, T>;

export interface DockTabStorageLayer<T> {
  isReady: (tabId: TabId) => boolean;
  getData: (tabId: TabId) => T;
  setData: (tabId: TabId, data: T) => void;
  clearData: (tabId: TabId) => void;
}

export class DockTabStore<T> implements DockTabStorageLayer<T> {
  @observable protected data = observable.map<TabId, T>();

  constructor(protected readonly dependencies: DockTabStoreDependencies<T>) {
    makeObservable(this);
    autoBind(this);

    const { storage } = this.dependencies;

    if (storage) {
      this.data.replace(storage.get());
      reaction(() => this.toJSON(), data => storage.set(data));
    }
  }

  protected finalizeDataForSave(data: T): T {
    return data;
  }

  protected toJSON(): DockTabStorageState<T> {
    const deepCopy = toJS(this.data);

    deepCopy.forEach((tabData, key) => {
      deepCopy.set(key, this.finalizeDataForSave(tabData));
    });

    return Object.fromEntries<T>(deepCopy);
  }

  isReady = (tabId: TabId): boolean => this.getData(tabId) !== undefined;
  getData = (tabId: TabId) => this.data.get(tabId);

  setData = (tabId: TabId, data: T): void => {
    this.data.set(tabId, data);
  };

  clearData = (tabId: TabId): void => {
    this.data.delete(tabId);
  };

  reset = () => {
    this.data.clear();
    this.dependencies.storage?.reset();
  };
}
