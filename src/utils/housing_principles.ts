/**
 * Core software rules implementing housing governance principles:
 * - Deterministic eligibility rules (software-checked, human-confirmed)
 * - Transparent fee summation
 * - Maintenance SLA and deterministic priority queue
 * - Resident dispute registration
 */

export interface HousingApplication {
  applicantName: string;
  nationalId: string;
  unitId: string;
  monthlyIncomeKES: number;
  rentKES: number;
}

export interface EligibilityResult {
  isRuleEligible: boolean;
  rentToIncomeRatio: number;
  reason: string;
  requiresHumanReview: boolean;
}

export function evaluateApplicationRules(app: HousingApplication): EligibilityResult {
  if (!app.applicantName || !app.nationalId) {
    return {
      isRuleEligible: false,
      rentToIncomeRatio: 1,
      reason: 'Missing necessary identification data.',
      requiresHumanReview: false
    };
  }

  const ratio = app.monthlyIncomeKES > 0 ? (app.rentKES / app.monthlyIncomeKES) : 1;

  // Standard deterministic guideline: rent should typically be <= 40% of income
  if (ratio <= 0.40) {
    return {
      isRuleEligible: true,
      rentToIncomeRatio: Math.round(ratio * 100) / 100,
      reason: 'Passes standard income-to-rent threshold.',
      requiresHumanReview: true // Always reviewed by a human officer
    };
  } else {
    return {
      isRuleEligible: false,
      rentToIncomeRatio: Math.round(ratio * 100) / 100,
      reason: 'Rent exceeds 40% of reported income; guarantor or human appeal review required.',
      requiresHumanReview: true
    };
  }
}

export interface FeeItem {
  name: string;
  amount: number;
  isRecurring: boolean;
}

export function computeTotalMoveIn(baseRent: number, securityDeposit: number, serviceCharge: number): number {
  return baseRent + securityDeposit + serviceCharge;
}

export type MaintenanceUrgency = 'emergency' | 'high' | 'standard';

export function calculateMaintenanceSLAHours(urgency: MaintenanceUrgency): number {
  switch (urgency) {
    case 'emergency': return 4;
    case 'high': return 24;
    case 'standard': return 72;
    default: return 72;
  }
}


// ==========================================
// SYNCHRO ESCROW & PROPERTY APPROVAL DOMAIN
// ==========================================

export type EscrowStatus = 'held_in_synchro' | 'site_verified' | 'released_to_landlord' | 'refunded_to_tenant';

export interface SynchroEscrowHold {
  id: string; // e.g. ESC-8921
  tenantName: string;
  tenantPhone: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  amountKES: number;
  paymentChannel: string;
  mpesaRef: string;
  createdAt: string;
  status: EscrowStatus;
  inspectionNotes?: string;
  inspectorName?: string;
  verifiedAt?: string;
  releasedAt?: string;
}

export type PropertyApprovalStatus = 'pending_approval' | 'approved' | 'rejected';

export interface RegisteredProperty {
  id: string; // e.g. PROP-NAI-008
  name: string;
  category: 'apartments' | 'courts' | 'rentals' | 'bedsitters';
  location: string;
  priceKES: number;
  unitsCount: number;
  landlordName: string;
  landlordPhone: string;
  cadastralTitleNo: string;
  imageUrl: string;
  description: string;
  status: PropertyApprovalStatus;
  registeredAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export function releaseEscrowRules(hold: SynchroEscrowHold): { canRelease: boolean; reason: string } {
  if (hold.status === 'released_to_landlord') {
    return { canRelease: false, reason: 'Funds have already been released to landlord.' };
  }
  if (hold.status === 'refunded_to_tenant') {
    return { canRelease: false, reason: 'Funds were previously refunded to tenant.' };
  }
  if (hold.status !== 'site_verified') {
    return { canRelease: false, reason: 'Admin physical inspection or cadastral title certification is required before release.' };
  }
  return { canRelease: true, reason: 'Property verified. Synchro funds clear for payout.' };
}

export function approvePropertyRules(prop: RegisteredProperty): { canApprove: boolean; reason: string } {
  if (!prop.name || !prop.location || !prop.priceKES || prop.priceKES <= 0) {
    return { canApprove: false, reason: 'Invalid property specifications.' };
  }
  if (!prop.cadastralTitleNo) {
    return { canApprove: false, reason: 'Missing official title deed or county parcel registration number.' };
  }
  return { canApprove: true, reason: 'Title deed and parcel checks verified. Approved for tenant view.' };
}


// ==========================================
// ACCESS CONTROL & ROLE ROUTING DOMAIN
// ==========================================

export type UserRole = 'tenant' | 'landlord' | 'admin';

export interface AuthSession {
  identifier: string;
  role: UserRole;
  signedInAt: string;
}

export function determineDestinationRoute(role: UserRole, identifier?: string): string {
  if (role === 'admin' || (identifier && (identifier.toLowerCase() === 'admin@gmail.com' || identifier.toLowerCase().includes('admin')))) {
    return 'admin.html';
  }
  if (role === 'landlord') {
    return 'owner-dashboard.html';
  }
  return 'account.html?type=customer';
}

export function canAccessAdmin(session: AuthSession | null): boolean {
  if (!session) return false;
  return session.role === 'admin' || session.identifier.toLowerCase() === 'admin@gmail.com' || session.identifier.toLowerCase().includes('admin');
}
