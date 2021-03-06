/*
 *  Copyright 2018, Yahoo Inc.
 *  Licensed under the terms of the Apache License, Version 2.0.
 *  See the LICENSE file associated with the project for terms.
 */
import ENV from 'bullet-ui/config/environment';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | stomp websocket', function(hooks) {
  setupTest(hooks);

  test('it has the application url', function(assert) {
    let service = this.owner.lookup('service:stomp-websocket');
    service.set('settings', ENV.APP.SETTINGS);
    assert.ok(service);
    assert.equal(service.get('url'), `${ENV.APP.SETTINGS.queryHost}/${ENV.APP.SETTINGS.queryNamespace}/${ENV.APP.SETTINGS.queryPath}`);
  });

  test('it has the query stomp request channel', function(assert) {
    let service = this.owner.lookup('service:stomp-websocket');
    service.set('settings', ENV.APP.SETTINGS);
    assert.ok(service);
    assert.equal(service.get('queryStompRequestChannel'), ENV.APP.SETTINGS.queryStompRequestChannel);
  });

  test('it has the query stomp response channel', function(assert) {
    let service = this.owner.lookup('service:stomp-websocket');
    service.set('settings', ENV.APP.SETTINGS);
    assert.ok(service);
    assert.equal(service.get('queryStompResponseChannel'), ENV.APP.SETTINGS.queryStompResponseChannel);
  });
});
