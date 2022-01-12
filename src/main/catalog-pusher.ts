/**
 * Copyright (c) 2021 OpenLens Authors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { computed, reaction } from "mobx";
import { broadcastMessage, ipcMainOn } from "../common/ipc";
import type { CatalogEntityRegistry } from "./catalog";
import "../common/catalog-entities/kubernetes-cluster";
import { disposer, toJS } from "../common/utils";
import { debounce } from "lodash";
import type { CatalogEntity, CatalogEntityData, CatalogEntityKindData } from "../common/catalog";
import { EntityPreferencesStore } from "../common/entity-preferences-store";
import { CatalogIpcEvents } from "../common/ipc/catalog";

function changesDueToPreferences({ metadata, spec, status, kind, apiVersion }: CatalogEntity): CatalogEntityData & CatalogEntityKindData {
  const preferences = EntityPreferencesStore.getInstance().preferences.get(metadata.uid) ?? {};

  if (preferences.shortName) {
    metadata.shortName ||= preferences.shortName;
  }

  return { metadata, spec, status, kind, apiVersion };
}

const broadcaster = debounce((items: (CatalogEntityData & CatalogEntityKindData)[]) => {
  broadcastMessage(CatalogIpcEvents.ITEMS, items);
}, 1_000, { leading: true, trailing: true });

export function pushCatalogToRenderer(catalog: CatalogEntityRegistry) {
  const entityData = computed(() => toJS(catalog.items.map(changesDueToPreferences)));

  return disposer(
    ipcMainOn(CatalogIpcEvents.INIT, () => broadcaster(entityData.get())),
    reaction(() => entityData.get(), broadcaster, {
      fireImmediately: true,
    }),
  );
}
