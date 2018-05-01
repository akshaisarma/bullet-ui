/*
 *  Copyright 2016, Yahoo Inc.
 *  Licensed under the terms of the Apache License, Version 2.0.
 *  See the LICENSE file associated with the project for terms.
 */
import { module, test } from 'qunit';
import RESULTS from '../fixtures/results';
import COLUMNS from '../fixtures/columns';
import { setupForAcceptanceTest } from '../helpers/setup-for-acceptance-test';
import { visit, click, fillIn, triggerEvent } from '@ember/test-helpers';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import $ from 'jquery';

module('Acceptance | query summarization', function(hooks) {
  setupForAcceptanceTest(hooks, [RESULTS.SINGLE], COLUMNS.BASIC);

  test('it summarizes a blank query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.SINGLE], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.save-button');
    await visit('queries');

    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(), 'Fields:  All');
  });

  test('it summarizes a query with filters', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.SINGLE], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.filter-container button[data-add=\'rule\']');
    await click('.filter-container button[data-add=\'group\']');
    await click('.filter-container .rules-group-container .rules-group-container button[data-add=\'rule\']');
    // Both the top level and nested filter should be filled out now
    $('.filter-container .rule-filter-container select').val('complex_map_column').trigger('change');
    await click('.save-button');
    await visit('queries');

    assert.equal($('.query-description .filter-summary-text').text().trim(),
      'Filters:  complex_map_column IS NULL AND ( complex_map_column IS NULL AND complex_map_column IS NULL )');
    assert.equal($('.query-description .fields-summary-text').text().trim(), 'Fields:  All');
  });

  test('it summarizes a query with raw fields', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.SINGLE], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-container .raw-sub-options #select');

    await selectChoose($('.projections-container .field-selection-container .field-selection')[0], 'complex_map_column.*');
    await fillIn(
      $('.projections-container .field-selection-container:eq(0) .field-selection .column-subfield input')[0],
      'foo'
    );
    await triggerEvent(
      $('.projections-container .field-selection-container:eq(0) .field-selection .column-subfield input')[0],
      'blur'
    );
    await fillIn('.projections-container .field-selection-container .field-name input', 'new_name');

    await click('.output-container .projections-container .add-projection');
    await selectChoose($('.projections-container .field-selection-container .field-selection')[1], 'simple_column');
    await click('.output-container .projections-container .add-projection');
    await selectChoose($('.projections-container .field-selection-container .field-selection')[2], 'complex_map_column.*');
    await fillIn(
      $('.projections-container .field-selection-container:eq(2) .field-selection .column-subfield input')[0],
      'bar'
    );
    await triggerEvent(
      $('.projections-container .field-selection-container:eq(2) .field-selection .column-subfield input')[0],
      'blur'
    );

    await click('.save-button');
    await visit('queries');

    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  new_name, simple_column, complex_map_column.bar');
  });

  test('it summarizes a count distinct query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.COUNT_DISTINCT], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #count-distinct');
    await click('.output-container .fields-selection-container .add-field');
    await click('.output-container .fields-selection-container .add-field');
    await selectChoose($('.output-container .field-selection-container .field-selection')[0], 'simple_column');
    await selectChoose($('.output-container .field-selection-container .field-selection')[1], 'complex_map_column');
    await fillIn('.output-container .count-distinct-display-name input', 'cnt');
    await click('.save-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  Count Distinct ON (simple_column, complex_map_column)');
  });

  test('it summarizes a distinct query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.GROUP], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #grouped-data');

    await click('.groups-container .add-group');
    await selectChoose($('.groups-container .field-selection-container .field-selection')[0], 'complex_map_column.*');
    await fillIn($('.groups-container .field-selection-container:eq(0) .field-selection .column-subfield input')[0], 'foo');
    await triggerEvent($('.groups-container .field-selection-container:eq(0) .field-selection .column-subfield input')[0], 'blur');

    await click('.groups-container .add-group');
    await selectChoose($('.groups-container .field-selection-container .field-selection')[1], 'simple_column');
    await fillIn($('.groups-container .field-selection-container:eq(1) .field-name input')[0], 'bar');

    await click('.save-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  complex_map_column.foo, bar');
  });

  test('it summarizes a group all query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.GROUP], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #grouped-data');

    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[0], 'Count');

    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[1], 'Average');
    await selectChoose($('.output-container .metrics-container .field-selection-container .field-selection')[0], 'simple_column');
    await fillIn($('.output-container .metrics-container .field-selection-container:eq(1) .field-name input')[0], 'avg_s');

    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[2], 'Average');
    await selectChoose($('.output-container .metrics-container .field-selection-container .field-selection')[1], 'simple_column');

    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[3], 'Sum');
    await selectChoose($('.output-container .metrics-container .field-selection-container .field-selection')[2], 'simple_column');

    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[4], 'Minimum');
    await selectChoose($('.output-container .metrics-container .field-selection-container .field-selection')[3], 'simple_column');

    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[5], 'Maximum');
    await selectChoose($('.output-container .metrics-container .field-selection-container .field-selection')[4], 'simple_column');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  Count(*), avg_s, Average(simple_column), Sum(simple_column), ' +
                 'Minimum(simple_column), Maximum(simple_column)');
  });

  test('it summarizes a grouped data query with groups first', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.GROUP], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #grouped-data');

    await click('.groups-container .add-group');
    await selectChoose($('.groups-container .field-selection-container .field-selection')[0], 'complex_map_column.*');
    await fillIn($('.groups-container .field-selection-container:eq(0) .field-selection .column-subfield input')[0], 'foo');
    await triggerEvent($('.groups-container .field-selection-container:eq(0) .field-selection .column-subfield input')[0], 'blur');

    await click('.groups-container .add-group');
    await selectChoose($('.groups-container .field-selection-container .field-selection')[1], 'simple_column');
    await fillIn($('.groups-container .field-selection-container:eq(1) .field-name input')[0], 'bar');

    await click('.output-container .metrics-container .add-metric');
    await click('.output-container .metrics-container .add-metric');
    await selectChoose($('.output-container .metrics-container .field-selection-container .metrics-selection')[0], 'Count');
    await selectChoose($('.output-container .metrics-container .metrics-selection')[1], 'Average');
    await selectChoose($('.output-container .metrics-container .field-selection-container .field-selection')[0], 'simple_column');
    await fillIn($('.output-container .metrics-container .field-selection-container:eq(1) .field-name input')[0], 'avg_bar');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  complex_map_column.foo, bar, Count(*), avg_bar');
  });

  test('it summarizes a quantile distribution query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.DISTRIBUTION], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #distribution');

    await selectChoose('.output-container .field-selection-container .field-selection', 'complex_map_column.*');
    await fillIn('.output-container .field-selection-container .field-selection .column-subfield input', 'foo');
    await triggerEvent('.output-container .field-selection-container .field-selection .column-subfield input', 'blur');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  Quantile ON complex_map_column.foo');
  });

  test('it summarizes a frequency distribution query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.DISTRIBUTION], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #distribution');
    await click('.distribution-type-options #frequency');

    await selectChoose('.output-container .field-selection-container .field-selection', 'simple_column');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  Frequency ON simple_column');
  });

  test('it summarizes a cumulative frequency distribution query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.DISTRIBUTION], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #distribution');
    await click('.distribution-type-options #cumulative');

    await selectChoose('.output-container .field-selection-container .field-selection', 'simple_column');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  Cumulative Frequency ON simple_column');
  });

  test('it summarizes a top k query', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.TOP_K], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #top-k');

    await selectChoose('.output-container .field-selection-container .field-selection', 'simple_column');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  TOP 1 OF (simple_column)');
  });

  test('it summarizes a top k query with multiple fields', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.TOP_K], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #top-k');

    await click('.output-container .add-field');
    await selectChoose($('.output-container .field-selection-container .field-selection')[0], 'simple_column');
    await selectChoose($('.output-container .field-selection-container .field-selection')[1], 'complex_map_column.*');
    await fillIn($('.output-container .field-selection-container:eq(1) .field-selection .column-subfield input')[0], 'foo');
    await triggerEvent($('.output-container .field-selection-container:eq(1) .field-selection .column-subfield input')[0], 'blur');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  TOP 1 OF (simple_column, complex_map_column.foo)');
  });

  test('it summarizes a top k query with custom k and threshold', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.TOP_K], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #top-k');

    await click('.output-container .add-field');
    await selectChoose($('.output-container .field-selection-container .field-selection')[0], 'simple_column');
    await selectChoose($('.output-container .field-selection-container .field-selection')[1], 'complex_map_column.*');
    await fillIn($('.output-container .field-selection-container:eq(1) .field-selection .column-subfield input')[0], 'foo');
    await triggerEvent($('.output-container .field-selection-container:eq(1) .field-selection .column-subfield input')[0], 'blur');

    await fillIn('.output-container .top-k-size input', '15');
    await fillIn('.output-container .top-k-min-count input', '1500');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  TOP 15 OF (simple_column, complex_map_column.foo) HAVING Count >= 1500');
  });

  test('it summarizes a top k query with custom k, threshold and name', async function(assert) {
    assert.expect(2);
    this.mockedAPI.mock([RESULTS.TOP_K], COLUMNS.BASIC);

    await visit('/queries/new');
    await click('.output-options #top-k');

    await click('.output-container .add-field');
    await selectChoose($('.output-container .field-selection-container .field-selection')[0], 'simple_column');
    await selectChoose($('.output-container .field-selection-container .field-selection')[1], 'complex_map_column.*');
    await fillIn($('.output-container .field-selection-container:eq(1) .field-selection .column-subfield input')[0], 'foo');
    await triggerEvent($('.output-container .field-selection-container:eq(1) .field-selection .column-subfield input')[0], 'blur');

    await fillIn('.output-container .top-k-size input', '15');
    await fillIn('.output-container .top-k-min-count input', '1500');
    await fillIn('.output-container .top-k-display-name input', 'cnt');

    await click('.submit-button');
    await visit('queries');
    assert.equal($('.query-description .filter-summary-text').text().trim(), 'Filters:  None');
    assert.equal($('.query-description .fields-summary-text').text().trim(),
      'Fields:  TOP 15 OF (simple_column, complex_map_column.foo) HAVING cnt >= 1500');
  });
});
