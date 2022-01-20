// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import makeStyles from '@mui/styles/makeStyles';
import MuiTypography from '@mui/material/Typography';
import React, { ReactElement } from 'react';
import { Attributions } from '../../../shared/shared-types';
import { getAlphabeticalComparer } from '../../util/get-alphabetical-comparer';
import { FilteredList } from '../FilteredList/FilteredList';
import { PackageCard } from '../PackageCard/PackageCard';
import { ListCardConfig } from '../../types/types';
import { useCheckboxStyles } from '../../shared-styles';
import { View } from '../../enums/enums';

const useStyles = makeStyles({
  topElements: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: 5,
  },
});

interface AttributionListProps {
  attributions: Attributions;
  selectedAttributionId: string | null;
  attributionIdMarkedForReplacement: string;
  onCardClick(attributionId: string, isButton?: boolean): void;
  className?: string;
  maxHeight: number;
  title: string;
  topRightElement?: JSX.Element;
  filterElement?: JSX.Element;
  view: View;
}

export function AttributionList(props: AttributionListProps): ReactElement {
  const classes = { ...useCheckboxStyles(), ...useStyles() };
  const attributions = { ...props.attributions };
  const attributionIds: Array<string> = Object.keys({
    ...props.attributions,
  }).sort(getAlphabeticalComparer(attributions));

  function getAttributionCard(attributionId: string): ReactElement {
    const attribution = attributions[attributionId];

    function isSelected(): boolean {
      return attributionId === props.selectedAttributionId;
    }

    function isMarkedForReplacement(): boolean {
      return attributionId === props.attributionIdMarkedForReplacement;
    }

    function onClick(): void {
      props.onCardClick(attributionId);
    }

    const cardConfig: ListCardConfig = {
      isSelected: isSelected(),
      isMarkedForReplacement: isMarkedForReplacement(),
      isPreSelected: Boolean(attribution.preSelected),
      firstParty: attribution.firstParty,
      excludeFromNotice: attribution.excludeFromNotice,
      followUp: Boolean(attribution.followUp),
    };

    return (
      <PackageCard
        attributionId={attributionId}
        onClick={onClick}
        cardConfig={cardConfig}
        key={`AttributionCard-${attribution.packageName}-${attributionId}`}
        cardContent={{
          id: `attribution-list-${attributionId}`,
          name: attribution.packageName,
          packageVersion: attribution.packageVersion,
          copyright: attribution.copyright,
          licenseText: attribution.licenseText,
          comment: attribution.comment,
          url: attribution.url,
          licenseName: attribution.licenseName,
        }}
        hideResourceSpecificButtons={true}
        showCheckBox={true}
        view={props.view}
      />
    );
  }

  return (
    <div className={props.className}>
      <div className={classes.topElements}>
        <MuiTypography className={classes.title}>{props.title}</MuiTypography>
        {props.topRightElement}
      </div>
      {props.filterElement}
      <FilteredList
        attributions={props.attributions}
        attributionIds={attributionIds}
        getAttributionCard={getAttributionCard}
        max={{ height: props.maxHeight }}
        cardVerticalDistance={41}
      />
    </div>
  );
}
