// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement } from 'react';
import {
  AttributionIdWithCount,
  Attributions,
} from '../../../shared/shared-types';
import { AccordionPanel } from './AccordionPanel';
import { PanelData } from '../ResourceDetailsTabs/resource-details-tabs-helpers';
import { PackagePanelTitle } from '../../enums/enums';

interface SyncAccordionPanelProps {
  title: PackagePanelTitle;
  getAttributionIdsWithCount(): Array<AttributionIdWithCount>;
  attributions: Attributions;
  isAddToPackageEnabled: boolean;
}

export function SyncAccordionPanel(
  props: SyncAccordionPanelProps
): ReactElement {
  const panelData: PanelData = {
    title: props.title,
    attributionIdsWithCount: props.getAttributionIdsWithCount(),
    attributions: props.attributions,
  };

  return (
    <AccordionPanel
      panelData={panelData}
      isAddToPackageEnabled={props.isAddToPackageEnabled}
    />
  );
}
