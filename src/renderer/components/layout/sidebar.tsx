/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./sidebar.module.scss";
import type { TabLayoutRoute } from "./tab-layout";

import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { cssNames } from "../../utils";
import { Icon } from "../icon";
import { Workloads } from "../+workloads";
import { UserManagement } from "../+user-management";
import { Storage } from "../+storage";
import { Network } from "../+network";
import type { CustomResourceDefinitionStore } from "../+custom-resource-definitions/store";
import { CustomResources } from "../+custom-resource-definitions/custom-resources";
import { isActiveRoute } from "../../navigation";
import { isAllowedResource } from "../../../common/utils/allowed-resource";
import { Spinner } from "../spinner";
import { ClusterPageMenuRegistration, ClusterPageMenuRegistry, ClusterPageRegistry, getExtensionPageUrl } from "../../../extensions/registries";
import { SidebarItem } from "./sidebar-item";
import { Apps } from "../+apps";
import * as routes from "../../../common/routes";
import { Config } from "../+config";
import { SidebarCluster } from "./sidebar-cluster";
import { withInjectables } from "@ogre-tools/injectable-react";
import crdStoreInjectable from "../+custom-resource-definitions/store.injectable";
import type { KubernetesCluster } from "../../../common/catalog-entities";
import activeEntityInjectable from "../../catalog/active-entity.injectable";
import type { IComputedValue } from "mobx";
import type { KubeWatchApi } from "../../kube-watch-api/kube-watch-api";
import kubeWatchApiInjectable from "../../kube-watch-api/kube-watch-api.injectable";

export interface SidebarProps {
  className?: string;
}

interface Dependencies {
  kubeWatchApi: KubeWatchApi;
  crdStore: CustomResourceDefinitionStore;
  clusterEntity: IComputedValue<KubernetesCluster>;
  clusterPageMenuRegistry: ClusterPageMenuRegistry;
  clusterPageRegistry: ClusterPageRegistry;
}

const NonInjectedSidebar = observer(({ crdStore, kubeWatchApi, clusterEntity, className, clusterPageMenuRegistry, clusterPageRegistry }: Dependencies & SidebarProps) => {
  useEffect(() => kubeWatchApi.subscribeStores([
    crdStore,
  ]), []);

  const renderCustomResources = () => {
    if (crdStore.isLoading) {
      return (
        <div className="flex justify-center">
          <Spinner/>
        </div>
      );
    }

    return Object.entries(crdStore.groups).map(([group, crds]) => {
      const id = `crd-group:${group}`;
      const crdGroupsPageUrl = routes.crdURL({ query: { groups: group }});

      return (
        <SidebarItem key={id} id={id} text={group} url={crdGroupsPageUrl}>
          {crds.map((crd) => (
            <SidebarItem
              key={crd.getResourceApiBase()}
              id={`crd-resource:${crd.getResourceApiBase()}`}
              url={crd.getResourceUrl()}
              text={crd.getResourceKind()}
            />
          ))}
        </SidebarItem>
      );
    });
  };

  const renderTreeFromTabRoutes = (tabRoutes: TabLayoutRoute[] = []): React.ReactNode => {
    if (!tabRoutes.length) {
      return null;
    }

    return tabRoutes.map(({ title, routePath, url = routePath, exact = true }) => {
      const subMenuItemId = `tab-route-item-${url}`;

      return (
        <SidebarItem
          key={subMenuItemId}
          id={subMenuItemId}
          url={url}
          text={title}
          isActive={isActiveRoute({ path: routePath, exact })}
        />
      );
    });
  };

  const getTabLayoutRoutes = (menu: ClusterPageMenuRegistration): TabLayoutRoute[] => {
    if (!menu.id) {
      return [];
    }

    const routes: TabLayoutRoute[] = [];
    const subMenus = clusterPageMenuRegistry.getSubItems(menu);

    for (const subMenu of subMenus) {
      const page = clusterPageRegistry.getByPageTarget(subMenu.target);

      if (!page) {
        continue;
      }

      const { extensionId, id: pageId, url, components } = page;

      if (subMenu.components.Icon) {
        console.warn(
          "ClusterPageMenuRegistration has components.Icon defined and a valid parentId. Icon will not be displayed",
          {
            id: subMenu.id,
            parentId: subMenu.parentId,
            target: subMenu.target,
          },
        );
      }

      routes.push({
        routePath: url,
        url: getExtensionPageUrl({ extensionId, pageId, params: subMenu.target.params }),
        title: subMenu.title,
        component: components.Page,
      });
    }

    return routes;
  };

  const renderRegisteredMenus = () => {
    return clusterPageMenuRegistry.getRootItems().map((menuItem, index) => {
      const registeredPage = clusterPageRegistry.getByPageTarget(menuItem.target);
      const tabRoutes = getTabLayoutRoutes(menuItem);
      const id = `registered-item-${index}`;
      let pageUrl: string;
      let isActive = false;

      if (registeredPage) {
        const { extensionId, id: pageId } = registeredPage;

        pageUrl = getExtensionPageUrl({ extensionId, pageId, params: menuItem.target.params });
        isActive = isActiveRoute(registeredPage.url);
      } else if (tabRoutes.length > 0) {
        pageUrl = tabRoutes[0].url;
        isActive = isActiveRoute(tabRoutes.map((tab) => tab.routePath));
      } else {
        return null;
      }

      return (
        <SidebarItem
          key={id}
          id={id}
          url={pageUrl}
          isActive={isActive}
          text={menuItem.title}
          icon={<menuItem.components.Icon/>}
        >
          {renderTreeFromTabRoutes(tabRoutes)}
        </SidebarItem>
      );
    });
  };

  return (
    <div className={cssNames("flex flex-col", className)} data-testid="cluster-sidebar">
      <SidebarCluster clusterEntity={clusterEntity.get()}/>
      <div className={styles.sidebarNav}>
        <SidebarItem
          id="cluster"
          text="Cluster"
          isActive={isActiveRoute(routes.clusterRoute)}
          isHidden={!isAllowedResource("nodes")}
          url={routes.clusterURL()}
          icon={<Icon svg="kube"/>}
        />
        <SidebarItem
          id="nodes"
          text="Nodes"
          isActive={isActiveRoute(routes.nodesRoute)}
          isHidden={!isAllowedResource("nodes")}
          url={routes.nodesURL()}
          icon={<Icon svg="nodes"/>}
        />
        <SidebarItem
          id="workloads"
          text="Workloads"
          isActive={isActiveRoute(routes.workloadsRoute)}
          isHidden={Workloads.tabRoutes.length == 0}
          url={routes.workloadsURL()}
          icon={<Icon svg="workloads"/>}
        >
          {renderTreeFromTabRoutes(Workloads.tabRoutes)}
        </SidebarItem>
        <SidebarItem
          id="config"
          text="Configuration"
          isActive={isActiveRoute(routes.configRoute)}
          isHidden={Config.tabRoutes.length == 0}
          url={routes.configURL()}
          icon={<Icon material="list"/>}
        >
          {renderTreeFromTabRoutes(Config.tabRoutes)}
        </SidebarItem>
        <SidebarItem
          id="networks"
          text="Network"
          isActive={isActiveRoute(routes.networkRoute)}
          isHidden={Network.tabRoutes.length == 0}
          url={routes.networkURL()}
          icon={<Icon material="device_hub"/>}
        >
          {renderTreeFromTabRoutes(Network.tabRoutes)}
        </SidebarItem>
        <SidebarItem
          id="storage"
          text="Storage"
          isActive={isActiveRoute(routes.storageRoute)}
          isHidden={Storage.tabRoutes.length == 0}
          url={routes.storageURL()}
          icon={<Icon svg="storage"/>}
        >
          {renderTreeFromTabRoutes(Storage.tabRoutes)}
        </SidebarItem>
        <SidebarItem
          id="namespaces"
          text="Namespaces"
          isActive={isActiveRoute(routes.namespacesRoute)}
          isHidden={!isAllowedResource("namespaces")}
          url={routes.namespacesURL()}
          icon={<Icon material="layers"/>}
        />
        <SidebarItem
          id="events"
          text="Events"
          isActive={isActiveRoute(routes.eventRoute)}
          isHidden={!isAllowedResource("events")}
          url={routes.eventsURL()}
          icon={<Icon material="access_time"/>}
        />
        <SidebarItem
          id="apps"
          text="Apps" // helm charts
          isActive={isActiveRoute(routes.appsRoute)}
          url={routes.appsURL()}
          icon={<Icon material="apps"/>}
        >
          {renderTreeFromTabRoutes(Apps.tabRoutes)}
        </SidebarItem>
        <SidebarItem
          id="users"
          text="Access Control"
          isActive={isActiveRoute(routes.usersManagementRoute)}
          isHidden={UserManagement.tabRoutes.length === 0}
          url={routes.usersManagementURL()}
          icon={<Icon material="security"/>}
        >
          {renderTreeFromTabRoutes(UserManagement.tabRoutes)}
        </SidebarItem>
        <SidebarItem
          id="custom-resources"
          text="Custom Resources"
          url={routes.crdURL()}
          isActive={isActiveRoute(routes.crdRoute)}
          isHidden={!isAllowedResource("customresourcedefinitions")}
          icon={<Icon material="extension"/>}
        >
          {renderTreeFromTabRoutes(CustomResources.tabRoutes)}
          {renderCustomResources()}
        </SidebarItem>
        {renderRegisteredMenus()}
      </div>
    </div>
  );
});

export const Sidebar = withInjectables<Dependencies, SidebarProps>(NonInjectedSidebar, {
  getProps: (di, props) => ({
    crdStore: di.inject(crdStoreInjectable),
    kubeWatchApi: di.inject(kubeWatchApiInjectable),
    clusterEntity: di.inject(activeEntityInjectable) as IComputedValue<KubernetesCluster>,
    clusterPageMenuRegistry: ClusterPageMenuRegistry.getInstance(),
    clusterPageRegistry: ClusterPageRegistry.getInstance(),
    ...props,
  }),
});
