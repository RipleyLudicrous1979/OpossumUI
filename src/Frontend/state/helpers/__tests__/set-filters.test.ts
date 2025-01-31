// SPDX-FileCopyrightText: Facebook, Inc. and its affiliates
// SPDX-FileCopyrightText: TNG Technology Consulting GmbH <https://www.tngtech.com>
//
// SPDX-License-Identifier: Apache-2.0

import { FilterType } from '../../../enums/enums';
import { getFiltersToRemove, getUpdatedFilters } from '../set-filters';

describe('The getUpdatedFilters function', () => {
  test('adds non-existing filter', () => {
    const activeFilters = new Set([FilterType.OnlyFollowUp]);
    const expectedFilters = new Set([
      FilterType.OnlyFollowUp,
      FilterType.HideFirstParty,
    ]);
    expect(getUpdatedFilters(activeFilters, FilterType.HideFirstParty)).toEqual(
      expectedFilters
    );
  });

  test('remove existing filter', () => {
    const activeFilters = new Set([
      FilterType.OnlyFollowUp,
      FilterType.HideFirstParty,
    ]);
    const expectedFilters = new Set([FilterType.OnlyFollowUp]);
    expect(getUpdatedFilters(activeFilters, FilterType.HideFirstParty)).toEqual(
      expectedFilters
    );
  });
});

describe('The getFiltersToRemove function', () => {
  test('returns only first party filter when the new filter is hide first party', () => {
    const filtersToRemove = new Set([FilterType.OnlyFirstParty]);
    expect(getFiltersToRemove(FilterType.HideFirstParty)).toEqual(
      filtersToRemove
    );
  });

  test('returns hide first party filter when the new filter is only first party', () => {
    const filtersToRemove = new Set([FilterType.HideFirstParty]);
    expect(getFiltersToRemove(FilterType.OnlyFirstParty)).toEqual(
      filtersToRemove
    );
  });

  test('returns no filter when the new filter is only follow up', () => {
    const filtersToRemove = new Set();
    expect(getFiltersToRemove(FilterType.OnlyFollowUp)).toEqual(
      filtersToRemove
    );
  });
});
