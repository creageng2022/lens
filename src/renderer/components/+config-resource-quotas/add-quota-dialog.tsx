/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./add-quota-dialog.scss";

import React from "react";
import { computed, observable, makeObservable } from "mobx";
import { observer } from "mobx-react";
import { Dialog, DialogProps } from "../dialog";
import { Wizard, WizardStep } from "../wizard";
import { Input } from "../input";
import { systemName } from "../input/input_validators";
import { IResourceQuotaValues, resourceQuotaApi } from "../../../common/k8s-api/endpoints/resource-quota.api";
import { Select } from "../select";
import { Icon } from "../icon";
import { Button } from "../button";
import { Notifications } from "../notifications";
import { NamespaceSelect } from "../+namespaces/namespace-select";
import { SubTitle } from "../layout/sub-title";

interface Props extends DialogProps {
}

const dialogState = observable.object({
  isOpen: false,
});

@observer
export class AddQuotaDialog extends React.Component<Props> {
  static defaultQuotas: IResourceQuotaValues = {
    "limits.cpu": "",
    "limits.memory": "",
    "requests.cpu": "",
    "requests.memory": "",
    "requests.storage": "",
    "persistentvolumeclaims": "",
    "count/pods": "",
    "count/persistentvolumeclaims": "",
    "count/services": "",
    "count/secrets": "",
    "count/configmaps": "",
    "count/replicationcontrollers": "",
    "count/deployments.apps": "",
    "count/replicasets.apps": "",
    "count/statefulsets.apps": "",
    "count/jobs.batch": "",
    "count/cronjobs.batch": "",
    "count/deployments.extensions": "",
  };

  public defaultNamespace = "default";

  @observable quotaName = "";
  @observable quotaSelectValue = "";
  @observable quotaInputValue = "";
  @observable namespace = this.defaultNamespace;
  @observable quotas = AddQuotaDialog.defaultQuotas;

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  static open() {
    dialogState.isOpen = true;
  }

  static close() {
    dialogState.isOpen = false;
  }

  @computed get quotaEntries() {
    return Object.entries(this.quotas)
      .filter(([, value]) => !!value.trim());
  }

  @computed get quotaOptions() {
    return Object.keys(this.quotas).map(quota => {
      const isCompute = quota.endsWith(".cpu") || quota.endsWith(".memory");
      const isStorage = quota.endsWith(".storage") || quota === "persistentvolumeclaims";
      const isCount = quota.startsWith("count/");
      const icon = isCompute ? "memory" : isStorage ? "storage" : isCount ? "looks_one" : "";

      return {
        label: icon ? <span className="nobr"><Icon material={icon} /> {quota}</span> : quota,
        value: quota,
      };
    });
  }

  setQuota = () => {
    if (!this.quotaSelectValue) return;
    this.quotas[this.quotaSelectValue] = this.quotaInputValue;
    this.quotaInputValue = "";
  };

  close = () => {
    AddQuotaDialog.close();
  };

  reset = () => {
    this.quotaName = "";
    this.quotaSelectValue = "";
    this.quotaInputValue = "";
    this.namespace = this.defaultNamespace;
    this.quotas = AddQuotaDialog.defaultQuotas;
  };

  addQuota = async () => {
    try {
      const { quotaName, namespace } = this;
      const quotas = this.quotaEntries.reduce<IResourceQuotaValues>((quotas, [name, value]) => {
        quotas[name] = value;

        return quotas;
      }, {});

      await resourceQuotaApi.create({ namespace, name: quotaName }, {
        spec: {
          hard: quotas,
        },
      });
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  onInputQuota = (evt: React.KeyboardEvent) => {
    switch (evt.key) {
      case "Enter":
        this.setQuota();
        evt.preventDefault(); // don't submit form
        break;
    }
  };

  render() {
    const { ...dialogProps } = this.props;
    const header = <h5>Create ResourceQuota</h5>;

    return (
      <Dialog
        {...dialogProps}
        className="AddQuotaDialog"
        isOpen={dialogState.isOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep
            contentClass="flex gaps column"
            disabledNext={!this.namespace}
            nextLabel="Create"
            next={this.addQuota}
          >
            <div className="flex gaps">
              <Input
                required autoFocus
                placeholder="ResourceQuota name"
                trim
                validators={systemName}
                value={this.quotaName} onChange={v => this.quotaName = v.toLowerCase()}
                className="box grow"
              />
            </div>

            <SubTitle title="Namespace" />
            <NamespaceSelect
              value={this.namespace}
              placeholder="Namespace"
              themeName="light"
              className="box grow"
              onChange={({ value }) => this.namespace = value}
            />

            <SubTitle title="Values" />
            <div className="flex gaps align-center">
              <Select
                className="quota-select"
                themeName="light"
                placeholder="Select a quota.."
                options={this.quotaOptions}
                value={this.quotaSelectValue}
                onChange={({ value }) => this.quotaSelectValue = value}
              />
              <Input
                maxLength={10}
                placeholder="Value"
                value={this.quotaInputValue}
                onChange={v => this.quotaInputValue = v}
                onKeyDown={this.onInputQuota}
                className="box grow"
              />
              <Button round primary onClick={this.setQuota}>
                <Icon
                  material={this.quotas[this.quotaSelectValue] ? "edit" : "add"}
                  tooltip="Set quota"
                />
              </Button>
            </div>
            <div className="quota-entries">
              {this.quotaEntries.map(([quota, value]) => {
                return (
                  <div key={quota} className="quota gaps inline align-center">
                    <div className="name">{quota}</div>
                    <div className="value">{value}</div>
                    <Icon material="clear" onClick={() => this.quotas[quota] = ""} />
                  </div>
                );
              })}
            </div>
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
