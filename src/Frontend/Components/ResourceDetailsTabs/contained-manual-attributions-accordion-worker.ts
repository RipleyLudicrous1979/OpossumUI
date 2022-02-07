// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { getContainedManualPackages } from './resource-details-tabs-helpers';

self.onmessage = ({ data: { selectedResourceId, manualData } }): void => {
  const output = getContainedManualPackages({ selectedResourceId, manualData });

  self.postMessage({
    output,
  });
};
