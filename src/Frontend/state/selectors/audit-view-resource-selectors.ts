// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { PanelPackage, State } from '../../types/types';
import { PackagePanelTitle } from '../../enums/enums';
import { Attributions, PackageInfo } from '../../../shared/shared-types';
import { getFilteredAttributionsById } from '../../util/get-filtered-attributions-by-id';
import { getClosestParentAttributionIds } from '../../util/get-closest-parent-attributions';
import {
  getManualAttributions,
  getResourcesToManualAttributions,
} from './all-views-resource-selectors';
import { getAttributionBreakpointCheckForState } from '../../util/is-attribution-breakpoint';

export function getSelectedResourceId(state: State): string {
  return state.resourceState.auditView.selectedResourceId;
}

export function getTargetSelectedResourceId(state: State): string {
  return state.resourceState.auditView.targetSelectedResourceId;
}

export function getExpandedIds(state: State): Array<string> {
  return state.resourceState.auditView.expandedIds;
}

export function getDisplayedPackage(state: State): PanelPackage | null {
  return state.resourceState.auditView.displayedPanelPackage;
}

export function getResolvedExternalAttributions(state: State): Set<string> {
  return state.resourceState.auditView.resolvedExternalAttributions;
}

export function getAttributionIdsOfSelectedResourceClosestParent(
  state: State
): Array<string> {
  const selectedResourceId = getSelectedResourceId(state);
  const resourcesToManualAttributions = getResourcesToManualAttributions(state);

  return getClosestParentAttributionIds(
    selectedResourceId,
    resourcesToManualAttributions,
    getAttributionBreakpointCheckForState(state)
  );
}

function getAttributionsOfSelectedResourceClosestParent(
  state: State
): Attributions {
  const attributionIdsOfClosestParent: Array<string> =
    getAttributionIdsOfSelectedResourceClosestParent(state);
  const manualAttributions: Attributions = getManualAttributions(state);

  return getFilteredAttributionsById(
    attributionIdsOfClosestParent,
    manualAttributions
  );
}

export function getAttributionIdsOfSelectedResource(
  state: State
): Array<string> {
  const selectedResourceId = getSelectedResourceId(state);
  const resourcesToManualAttributions = getResourcesToManualAttributions(state);
  if (selectedResourceId in resourcesToManualAttributions) {
    return resourcesToManualAttributions[selectedResourceId];
  }

  return [];
}

export function getAttributionsOfSelectedResource(state: State): Attributions {
  const attributionIdsOfSelectedResource: Array<string> =
    getAttributionIdsOfSelectedResource(state);
  const manualAttributions: Attributions = getManualAttributions(state);

  return getFilteredAttributionsById(
    attributionIdsOfSelectedResource,
    manualAttributions
  );
}

export function getAttributionsOfSelectedResourceOrClosestParent(
  state: State
): Attributions {
  const attributionsOfSelectedResource: Attributions =
    getAttributionsOfSelectedResource(state);
  return Object.keys(attributionsOfSelectedResource).length > 0
    ? attributionsOfSelectedResource
    : getAttributionsOfSelectedResourceClosestParent(state);
}

export function getAttributionIdOfDisplayedPackageInManualPanel(
  state: State
): string | null {
  return state.resourceState.auditView.displayedPanelPackage?.panel ===
    PackagePanelTitle.ManualPackages
    ? state.resourceState.auditView.displayedPanelPackage.attributionId
    : null;
}

export function getAttributionOfDisplayedPackageInManualPanel(
  state: State
): PackageInfo {
  const attributionId: string | null =
    getAttributionIdOfDisplayedPackageInManualPanel(state);
  if (attributionId) {
    const manualAttributions: Attributions = getManualAttributions(state);
    return manualAttributions[attributionId];
  }

  return {};
}
