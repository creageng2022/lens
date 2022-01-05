/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./upgrade-chart.scss";

import React, { useEffect, useState } from "react";
import { computed, observable, reaction } from "mobx";
import { observer } from "mobx-react";
import { cssNames } from "../../../utils";
import type { DockTabData } from "../store";
import { InfoPanel } from "../info-panel/info-panel";
import { Spinner } from "../../spinner";
import type { ReleaseStore } from "../../+helm-releases/store";
import { Badge } from "../../badge";
import { EditorPanel } from "../editor/editor-panel";
import { helmChartStore, IChartVersion } from "../../+helm-charts/helm-chart.store";
import type { HelmRelease } from "../../../../common/k8s-api/endpoints/helm-release.api";
import { Select, SelectOption } from "../../select";
import type { UpgradeChartStore } from "./store";
import { withInjectables } from "@ogre-tools/injectable-react";
import upgradeChartStoreInjectable from "./store.injectable";
import type { DockTabStore } from "../dock-tab/store";
import upgradeChartValuesInjectable from "./values.injectable";
import releaseStoreInjectable from "../../+helm-releases/store.injectable";

export interface UpgradeChartProps {
  className?: string;
  tab: DockTabData;
}

interface Dependencies {
  upgradeChartStore: UpgradeChartStore;
  upgradeChartValues: DockTabStore<string>;
  releaseStore: ReleaseStore;
}

const NonInjectedUpgradeChart = observer(({ releaseStore, upgradeChartStore, tab, className, upgradeChartValues }: Dependencies & UpgradeChartProps) => {
  const [error, setError] = useState("");
  const [versions] = useState(observable.array<IChartVersion>());
  const [version, setVersion] = useState<IChartVersion | undefined>();

  const compRelease = computed(() => {
    const tabData = upgradeChartStore.getData(tab.id);

    if (!tabData) {
      return null;
    }

    return releaseStore.getByName(tabData.releaseName);
  });
  const loadVersions = async (release: null | HelmRelease) => {
    if (!release) {
      return;
    }

    setVersion(undefined);
    versions.clear();

    versions.replace(await helmChartStore.getVersions(release.getChart()));
    setVersion(versions[0]);
  };

  useEffect(() => reaction(
    () => compRelease.get(),
    loadVersions,
    {
      fireImmediately: true,
    },
  ), []);

  const onChange = (value: string) => {
    setError("");
    upgradeChartValues.setData(tab.id, value);
  };

  const onError = (error: Error | string) => {
    setError(error.toString());
  };

  const release = compRelease.get();
  const releaseName = release.getName();
  const releaseNs = release.getNs();
  const currentVersion = release.getVersion();
  const value = upgradeChartValues.getData(tab.id);

  if (!release || upgradeChartStore.isLoading() || !version) {
    return <Spinner center />;
  }

  const upgrade = async () => {
    if (error) {
      return null;
    }

    await releaseStore.update(releaseName, releaseNs, {
      chart: release.getChart(),
      values: value,
      repo: version.repo,
      version: version.version,
    });

    return (
      <p>
        Release <b>{releaseName}</b> successfully upgraded to version <b>{version}</b>
      </p>
    );
  };

  const formatVersionLabel = ({ value }: SelectOption<IChartVersion>) => {
    const chartName = release.getChart();
    const { repo, version } = value;

    return `${repo}/${chartName}-${version}`;
  };

  const controlsAndInfo = (
    <div className="upgrade flex gaps align-center">
      <span>Release</span> <Badge label={releaseName} />
      <span>Namespace</span> <Badge label={releaseNs} />
      <span>Version</span> <Badge label={currentVersion} />
      <span>Upgrade version</span>
      <Select
        className="chart-version"
        menuPlacement="top"
        themeName="outlined"
        value={version}
        options={versions}
        formatOptionLabel={formatVersionLabel}
        onChange={({ value }: SelectOption) => setVersion(value)}
      />
    </div>
  );

  return (
    <div className={cssNames("UpgradeChart flex column", className)}>
      <InfoPanel
        tabId={tab.id}
        error={error}
        submit={upgrade}
        submitLabel="Upgrade"
        submittingMessage="Updating.."
        controls={controlsAndInfo}
      />
      <EditorPanel
        tabId={tab.id}
        value={value}
        onChange={onChange}
        onError={onError}
      />
    </div>
  );
});

export const UpgradeChart = withInjectables<Dependencies, UpgradeChartProps>(NonInjectedUpgradeChart, {
  getProps: (di, props) => ({
    upgradeChartStore: di.inject(upgradeChartStoreInjectable),
    upgradeChartValues: di.inject(upgradeChartValuesInjectable),
    releaseStore: di.inject(releaseStoreInjectable),
    ...props,
  }),
});
