// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import {
  Attributions,
  Resources,
  ResourcesToAttributions,
  ResourcesWithAttributedChildren,
} from '../../../shared/shared-types';
import { PathPredicate } from '../../types/types';
import React, { ReactElement } from 'react';
import { StyledTreeItemLabel } from '../StyledTreeItemLabel/StyledTreeItemLabel';
import { getClosestParentAttributions } from '../../util/get-closest-parent-attributions';

export function getTreeItemLabel(
  resourceName: string,
  resource: Resources | 1,
  nodeId: string,
  resourcesToManualAttributions: ResourcesToAttributions,
  resourcesToExternalAttributions: ResourcesToAttributions,
  manualAttributions: Attributions,
  resourcesWithExternalAttributedChildren: ResourcesWithAttributedChildren,
  resourcesWithManualAttributedChildren: ResourcesWithAttributedChildren,
  resolvedExternalAttributions: Set<string>,
  isAttributionBreakpoint: PathPredicate,
  isFileWithChildren: PathPredicate
): ReactElement {
  const canHaveChildren = resource !== 1;

  return (
    <StyledTreeItemLabel
      labelText={getDisplayName(resourceName)}
      canHaveChildren={canHaveChildren}
      hasManualAttribution={hasManualAttribution(
        nodeId,
        resourcesToManualAttributions
      )}
      hasExternalAttribution={hasExternalAttribution(
        nodeId,
        resourcesToExternalAttributions
      )}
      hasUnresolvedExternalAttribution={hasUnresolvedExternalAttribution(
        nodeId,
        resourcesToExternalAttributions,
        resolvedExternalAttributions
      )}
      hasParentWithManualAttribution={hasParentWithManualAttributionAndNoOwnAttribution(
        nodeId,
        manualAttributions,
        resourcesToManualAttributions,
        isAttributionBreakpoint
      )}
      containsExternalAttribution={containsExternalAttribution(
        nodeId,
        resourcesWithExternalAttributedChildren
      )}
      containsManualAttribution={containsManualAttribution(
        nodeId,
        resourcesWithManualAttributedChildren
      )}
      isAttributionBreakpoint={isAttributionBreakpoint(nodeId)}
      showFolderIcon={canHaveChildren && !isFileWithChildren(nodeId)}
      allChildrenhaveManualAttribution={
        canHaveChildren &&
        allChildrenhaveManualAttribution(
          resource,
          nodeId,
          resourcesWithManualAttributedChildren
        )
      }
    />
  );
}

function isRootResource(resourceName: string): boolean {
  return resourceName === '';
}

function getDisplayName(resourceName: string): string {
  return isRootResource(resourceName) ? '/' : resourceName;
}

function hasManualAttribution(
  nodeId: string,
  resourcesToManualAttributions: ResourcesToAttributions
): boolean {
  return nodeId in resourcesToManualAttributions;
}

function hasExternalAttribution(
  nodeId: string,
  resourcesToExternalAttributions: ResourcesToAttributions
): boolean {
  return nodeId in resourcesToExternalAttributions;
}

function hasUnresolvedExternalAttribution(
  nodeId: string,
  resourcesToExternalAttributions: ResourcesToAttributions,
  resolvedExternalAttributions: Set<string>
): boolean {
  return (
    nodeId in resourcesToExternalAttributions &&
    resourcesToExternalAttributions[nodeId].filter(
      (attribution) => !resolvedExternalAttributions.has(attribution)
    ).length > 0
  );
}

function containsExternalAttribution(
  nodeId: string,
  resourcesWithExternalAttributedChildren: ResourcesWithAttributedChildren
): boolean {
  return (
    resourcesWithExternalAttributedChildren &&
    nodeId in resourcesWithExternalAttributedChildren
  );
}

function containsManualAttribution(
  nodeId: string,
  resourcesWithManualAttributedChildren: ResourcesWithAttributedChildren
): boolean {
  return (
    resourcesWithManualAttributedChildren &&
    nodeId in resourcesWithManualAttributedChildren
  );
}

function hasParentWithManualAttribution(
  nodeId: string,
  manualAttributions: Attributions,
  resourcesToManualAttributions: ResourcesToAttributions,
  isAttributionBreakpoint: PathPredicate
): boolean {
  return (
    getClosestParentAttributions(
      nodeId,
      manualAttributions,
      resourcesToManualAttributions,
      isAttributionBreakpoint
    ) !== null
  );
}

function hasParentWithManualAttributionAndNoOwnAttribution(
  nodeId: string,
  manualAttributions: Attributions,
  resourcesToManualAttributions: ResourcesToAttributions,
  isAttributionBreakpoint: PathPredicate
): boolean {
  return (
    hasParentWithManualAttribution(
      nodeId,
      manualAttributions,
      resourcesToManualAttributions,
      isAttributionBreakpoint
    ) && !hasManualAttribution(nodeId, resourcesToManualAttributions)
  );
}

function allChildrenhaveManualAttribution(
  resource: Resources,
  nodeId: string,
  resourcesWithManualAttributedChildren: ResourcesWithAttributedChildren
): boolean {
  const children = Object.keys(resource);
  return (
    resourcesWithManualAttributedChildren &&
    children.every((child) => {
      child = resource[child] !== 1 ? nodeId + child + '/' : nodeId + child;
      return (
        (resourcesWithManualAttributedChildren[nodeId] &&
          resourcesWithManualAttributedChildren[nodeId].has(child)) ||
        child in resourcesWithManualAttributedChildren
      );
    })
  );
}
