// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { ButtonText, View } from '../../enums/enums';
import { NotificationPopup } from '../NotificationPopup/NotificationPopup';
import {
  closePopup,
  setTargetView,
} from '../../state/actions/view-actions/view-actions';
import {
  navigateToTargetResourceOrAttribution,
  saveTemporaryPackageInfoAndNavigateToTargetView,
  unlinkAttributionAndSavePackageInfoAndNavigateToTargetView,
} from '../../state/actions/popup-actions/popup-actions';
import {
  getAttributionIdToSaveTo,
  getIsSavingDisabled,
  getManualAttributionsToResources,
} from '../../state/selectors/all-views-resource-selectors';
import { hasAttributionMultipleResources } from '../../util/has-attribution-multiple-resources';
import { getSelectedView } from '../../state/selectors/view-selector';
import { setTargetSelectedAttributionId } from '../../state/actions/resource-actions/attribution-view-simple-actions';
import { setTargetSelectedResourceId } from '../../state/actions/resource-actions/audit-view-simple-actions';

export function NotSavedPopup(): ReactElement {
  const dispatch = useAppDispatch();
  const currentAttributionId = useAppSelector(getAttributionIdToSaveTo);
  const attributionsToResources = useAppSelector(
    getManualAttributionsToResources
  );
  const view = useAppSelector(getSelectedView);
  const isSavingDisabled = useAppSelector(getIsSavingDisabled);
  console.log('notsavedpopup: ');
  const showSaveGloballyButton =
    view === View.Audit &&
    hasAttributionMultipleResources(
      currentAttributionId,
      attributionsToResources
    );

  function handleSaveClick(): void {
    dispatch(unlinkAttributionAndSavePackageInfoAndNavigateToTargetView());
  }

  function handleSaveGloballyClick(): void {
    dispatch(saveTemporaryPackageInfoAndNavigateToTargetView());
  }

  function handleUndoClick(): void {
    dispatch(navigateToTargetResourceOrAttribution());
  }

  function handleCancelClick(): void {
    dispatch(setTargetView(null));
    dispatch(setTargetSelectedResourceId(''));
    dispatch(setTargetSelectedAttributionId(''));
    dispatch(closePopup());
  }

  const content = `There are unsaved changes. ${
    isSavingDisabled ? 'Unable to save.' : ''
  }`;

  return (
    <NotificationPopup
      content={content}
      header={'Warning'}
      leftButtonText={ButtonText.Save}
      isLeftButtonDisabled={isSavingDisabled}
      onLeftButtonClick={
        showSaveGloballyButton ? handleSaveClick : handleSaveGloballyClick
      }
      centerLeftButtonText={
        showSaveGloballyButton ? ButtonText.SaveGlobally : undefined
      }
      isCenterLeftButtonDisabled={isSavingDisabled}
      onCenterLeftButtonClick={
        showSaveGloballyButton ? handleSaveGloballyClick : undefined
      }
      centerRightButtonText={ButtonText.Undo}
      onCenterRightButtonClick={handleUndoClick}
      rightButtonText={ButtonText.Cancel}
      onRightButtonClick={handleCancelClick}
      isOpen={true}
    />
  );
}
