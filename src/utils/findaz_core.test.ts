import test from 'node:test';
import assert from 'node:assert/strict';
import { haversineDistance, formatKES, getRentalCategoryTarget } from './findaz_core';

test('haversineDistance calculates accurate distance between rental properties', () => {
  const dist = haversineDistance(-1.2921, 36.7820, -1.2673, 36.8065);
  assert.ok(dist > 3.0 && dist < 4.5, );
});

test('formatKES formats Kenyan Shilling currency correctly', () => {
  assert.equal(formatKES(12000), 'KSh 12,000');
  assert.equal(formatKES(6500), 'KSh 6,500');
  assert.equal(formatKES(22000), 'KSh 22,000');
});

test('getRentalCategoryTarget matches rental categories accurately', () => {
  assert.equal(getRentalCategoryTarget('student bedsitter in ruaka'), 'bedsitters.html');
  assert.equal(getRentalCategoryTarget('standalone 3-bedroom house in rongai'), 'rentals.html');
  assert.equal(getRentalCategoryTarget('amani court courtyard units'), 'courts.html');
  assert.equal(getRentalCategoryTarget('kilimani 2-bedroom apartment'), 'apartments.html');
});
