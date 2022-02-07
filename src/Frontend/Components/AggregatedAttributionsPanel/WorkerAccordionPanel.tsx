// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement, useMemo, useState } from 'react';
import {
  AttributionIdWithCount,
  Attributions,
} from '../../../shared/shared-types';
import { AccordionPanel } from './AccordionPanel';
import { PanelData } from '../ResourceDetailsTabs/resource-details-tabs-helpers';
import { PackagePanelTitle } from '../../enums/enums';

interface WorkerAccordionPanelProps {
  title: PackagePanelTitle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workerArgs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAttributionIdsWithCount(workerArgs: any): Array<AttributionIdWithCount>;
  attributions: Attributions;
  worker: Worker;
  isAddToPackageEnabled: boolean;
}

export function WorkerAccordionPanel(
  props: WorkerAccordionPanelProps
): ReactElement {
  const [attributionIdsWithCount, setAttributionIdsWithCount] = useState<
    Array<AttributionIdWithCount>
  >([]);

  useMemo(() => {
    let active = true;
    setAttributionIdsWithCount([]);

    loadAttributionIdsWithCount();
    // @ts-ignore
    return (): never => {
      active = false;
    };

    // eslint-disable-next-line @typescript-eslint/require-await
    async function loadAttributionIdsWithCount(): Promise<void> {
      // WebWorkers can fail for different reasons, e.g. because they run out
      // of memory with huge input files or because Jest does not support
      // them. When they fail the accordion is calculated on main. The error
      // message is logged in the console.
      try {
        const worker = props.worker;
        worker.postMessage(props.workerArgs);

        if (!active) {
          return;
        }

        // @ts-ignore
        worker.onmessage = ({ data: { output } }): void => {
          setAttributionIdsWithCount(output);
        };
      } catch (error) {
        console.log(`Error in ResourceDetailsTab ${props.title}: `, error);

        const output = props.getAttributionIdsWithCount(props.workerArgs);

        if (!active) {
          return;
        }

        setAttributionIdsWithCount(output);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.workerArgs,
    props.worker,
    props.getAttributionIdsWithCount,
    props.attributions,
    props.title,
  ]);

  const panelData: PanelData = {
    title: props.title,
    attributionIdsWithCount,
    attributions: props.attributions,
  };

  return (
    <AccordionPanel
      panelData={panelData}
      isAddToPackageEnabled={props.isAddToPackageEnabled}
    />
  );
}
