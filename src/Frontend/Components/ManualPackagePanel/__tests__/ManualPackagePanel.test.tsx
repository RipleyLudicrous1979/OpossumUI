// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { renderComponentWithStore } from '../../../test-helpers/render-component-with-store';
import { ManualPackagePanel } from '../ManualPackagePanel';
import { getParsedInputFileEnrichedWithTestData } from '../../../test-helpers/general-test-helpers';
import { setSelectedResourceId } from '../../../state/actions/resource-actions/audit-view-simple-actions';
import { loadFromFile } from '../../../state/actions/resource-actions/load-actions';

describe('The ManualPackagePanel', () => {
  test('shows default and input attributions', () => {
    const mockOnOverride = jest.fn();
    const { store } = renderComponentWithStore(
      <ManualPackagePanel
        showParentAttributions={false}
        overrideParentMode={false}
        showAddNewAttributionButton={true}
        onOverrideParentClick={mockOnOverride}
      />
    );
    store.dispatch(
      loadFromFile(
        getParsedInputFileEnrichedWithTestData({
          resources: { file: 1 },
          manualAttributions: {
            uuid1: { packageName: 'React' },
            uuid2: { packageName: 'Angular' },
          },
          resourcesToManualAttributions: { '/file': ['uuid1'] },
        })
      )
    );
    store.dispatch(setSelectedResourceId('/file'));

    expect(screen.getByText('React'));
    expect(screen.getByText('Add new attribution'));
  });

  test('Shows hint and override button for parent attribution', () => {
    const mockOnOverride = jest.fn();
    renderComponentWithStore(
      <ManualPackagePanel
        showParentAttributions={true}
        overrideParentMode={false}
        showAddNewAttributionButton={true}
        onOverrideParentClick={mockOnOverride}
      />
    );
    const overrideButton = screen.queryByText('Override parent');
    expect(overrideButton).toBeInTheDocument();

    fireEvent.click(overrideButton as Element);
    expect(mockOnOverride).toBeCalled();
  });
});
