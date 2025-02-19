/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import createStorageInjectable from "../../../utils/create-storage/create-storage.injectable";

export interface SidebarStorageState {
  width: number;
  expanded: {
    [itemId: string]: boolean;
  }
}

export const defaultSidebarWidth = 200;

const sidebarStorageInjectable = getInjectable({
  instantiate: (di) => {
    const createStorage = di.inject(createStorageInjectable);

    return createStorage("sidebar", {
      width: defaultSidebarWidth,
      expanded: {},
    });
  },

  lifecycle: lifecycleEnum.singleton,
});

export default sidebarStorageInjectable;
