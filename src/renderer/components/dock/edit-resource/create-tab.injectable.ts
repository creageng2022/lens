/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { KubeObject } from "../../../../common/k8s-api/kube-object";
import { bind } from "../../../utils";
import { DockStore, DockTabCreateSpecific, TabKind } from "../store";
import dockStoreInjectable from "../store.injectable";
import type { EditResourceStore } from "./store";
import editResourceStoreInjectable from "./store.injectable";

interface Dependencies {
  editResourceStore: EditResourceStore;
  dockStore: DockStore;
}

function createEditResourceTab({ editResourceStore, dockStore }: Dependencies, object: KubeObject, tabParams: DockTabCreateSpecific = {}) {
  // use existing tab if already opened
  let tab = editResourceStore.getTabByResource(object);

  if (tab) {
    dockStore.open();
    dockStore.selectTab(tab.id);
  }

  // or create new tab
  if (!tab) {
    tab = dockStore.createTab({
      title: `${object.kind}: ${object.getName()}`,
      ...tabParams,
      kind: TabKind.EDIT_RESOURCE,
    }, false);
    editResourceStore.setData(tab.id, {
      resource: object.selfLink,
    });
  }

  return tab;
}

const newEditResourceTabInjectable = getInjectable({
  instantiate: di => bind(createEditResourceTab, null, {
    editResourceStore: di.inject(editResourceStoreInjectable),
    dockStore: di.inject(dockStoreInjectable),
  }),
  lifecycle: lifecycleEnum.singleton,
});

export default newEditResourceTabInjectable;
