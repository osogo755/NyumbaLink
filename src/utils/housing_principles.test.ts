import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateApplicationRules, computeTotalMoveIn, calculateMaintenanceSLAHours } from './housing_principles';

test('evaluateApplicationRules handles deterministic income ratio check', () => {
  const goodApp = {
    applicantName: 'Grace Wanjiku',
    nationalId: '29482710',
    unitId: 'UNIT-NAI-001-A2',
    monthlyIncomeKES: 45000,
    rentKES: 12000
  };
  const result = evaluateApplicationRules(goodApp);
  assert.equal(result.isRuleEligible, true);
  assert.equal(result.requiresHumanReview, true);
  assert.ok(result.rentToIncomeRatio < 0.35);
});

test('evaluateApplicationRules flags high-rent burden for human appeal review', () => {
  const borderlineApp = {
    applicantName: 'John Otieno',
    nationalId: '31892011',
    unitId: 'UNIT-NAI-001-A2',
    monthlyIncomeKES: 20000,
    rentKES: 12000
  };
  const result = evaluateApplicationRules(borderlineApp);
  assert.equal(result.isRuleEligible, false);
  assert.equal(result.requiresHumanReview, true);
});

test('computeTotalMoveIn calculates transparent move-in total with zero hidden fees', () => {
  const total = computeTotalMoveIn(12000, 12000, 1100);
  assert.equal(total, 25100);
});

test('calculateMaintenanceSLAHours enforces deterministic SLAs', () => {
  assert.equal(calculateMaintenanceSLAHours('emergency'), 4);
  assert.equal(calculateMaintenanceSLAHours('high'), 24);
  assert.equal(calculateMaintenanceSLAHours('standard'), 72);
});

import { releaseEscrowRules, approvePropertyRules, SynchroEscrowHold, RegisteredProperty } from './housing_principles';

test('releaseEscrowRules blocks premature release if unverified', () => {
  const hold: SynchroEscrowHold = {
    id: 'ESC-TEST-1',
    tenantName: 'Grace Wanjiku',
    tenantPhone: '+254 700 123 456',
    landlordId: 'LL-88201',
    landlordName: 'James M.',
    landlordPhone: '+254 712 345 678',
    propertyId: 'PROP-NAI-001',
    propertyName: 'Marigold Court',
    unitId: 'UNIT-A2',
    amountKES: 12000,
    paymentChannel: 'M-Pesa Paybill (Synchro Escrow)',
    mpesaRef: 'QHG892110',
    createdAt: '2026-11-11T06:00:00Z',
    status: 'held_in_synchro'
  };

  const check1 = releaseEscrowRules(hold);
  assert.equal(check1.canRelease, false);
  assert.match(check1.reason, /certification is required/);

  // Once site verified
  hold.status = 'site_verified';
  const check2 = releaseEscrowRules(hold);
  assert.equal(check2.canRelease, true);
});

test('approvePropertyRules checks title deed parcel and pricing', () => {
  const prop1: RegisteredProperty = {
    id: 'PROP-TEST-1',
    name: 'Kileleshwa Ridge',
    category: 'apartments',
    location: 'Kileleshwa, Nairobi',
    priceKES: 18000,
    unitsCount: 12,
    landlordName: 'David K.',
    landlordPhone: '+254 722 000 111',
    cadastralTitleNo: 'NAIROBI/BLOCK88/902',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=420&fit=crop',
    description: 'Modern units with backup borehole.',
    status: 'pending_approval',
    registeredAt: '2026-11-11T06:00:00Z'
  };

  const app1 = approvePropertyRules(prop1);
  assert.equal(app1.canApprove, true);

  const propMissingTitle: RegisteredProperty = { ...prop1, cadastralTitleNo: '' };
  const app2 = approvePropertyRules(propMissingTitle);
  assert.equal(app2.canApprove, false);
});

import { determineDestinationRoute, canAccessAdmin, UserRole, AuthSession } from './housing_principles';

test('determineDestinationRoute routes each role to their private dashboard', () => {
  assert.equal(determineDestinationRoute('tenant'), 'account.html?type=customer');
  assert.equal(determineDestinationRoute('landlord'), 'owner-dashboard.html');
  assert.equal(determineDestinationRoute('admin'), 'admin.html');
  assert.equal(determineDestinationRoute('tenant', 'admin@gmail.com'), 'admin.html');
});

test('canAccessAdmin restricts unauthorized users', () => {
  const tenantSession: AuthSession = {
    identifier: '0700882119',
    role: 'tenant',
    signedInAt: '2026-11-11T07:00:00Z'
  };
  assert.equal(canAccessAdmin(tenantSession), false);

  const landlordSession: AuthSession = {
    identifier: '0712345678',
    role: 'landlord',
    signedInAt: '2026-11-11T07:00:00Z'
  };
  assert.equal(canAccessAdmin(landlordSession), false);

  const adminSession: AuthSession = {
    identifier: 'admin@gmail.com',
    role: 'admin',
    signedInAt: '2026-11-11T07:00:00Z'
  };
  assert.equal(canAccessAdmin(adminSession), true);
  assert.equal(canAccessAdmin(null), false);
});
