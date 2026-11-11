/**
 * findaz-synchro.js
 * Manages Synchro Escrow Holds and Property Registrations / Approvals in LocalStorage.
 * Ensures consistent IDs, verifiable records, and automatic synchronization across:
 * - Admin Dashboard (admin.html)
 * - Landlord Registration & Management (owner-dashboard.html)
 * - Tenant Marketplace & Category Listings (index.html, apartments.html, listing.html, etc.)
 */

(function () {
  const ESCROW_STORAGE_KEY = 'findaz_synchro_escrows';
  const PROPERTIES_STORAGE_KEY = 'findaz_registered_properties';

  // Seed baseline data if not present
  function getSeedProperties() {
    return [
      {
        id: 'PROP-NAI-001',
        name: 'Marigold Court',
        category: 'apartments',
        location: 'Kilimani, Nairobi · 1.2 km away',
        priceKES: 12000,
        unitsCount: 10,
        vacantCount: 6,
        landlordName: 'James M. (LL-88201)',
        landlordPhone: '+254 712 345 678',
        cadastralTitleNo: 'NAIROBI/BLOCK88/104A',
        imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=420&fit=crop',
        description: 'Quiet gated apartment block with reliable water, backup generator and on-site caretaker.',
        status: 'approved',
        registeredAt: '2026-10-15T08:00:00Z',
        approvedAt: '2026-10-16T10:30:00Z'
      },
      {
        id: 'PROP-KIA-002',
        name: 'Riverside Bedsitters',
        category: 'bedsitters',
        location: 'Ruaka, Kiambu · 3.8 km away',
        priceKES: 6500,
        unitsCount: 5,
        vacantCount: 2,
        landlordName: 'Waweru N. (LL-77142)',
        landlordPhone: '+254 720 884 512',
        cadastralTitleNo: 'KIAMBU/RUAKA/5592',
        imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=420&fit=crop',
        description: 'Compact self-contained units with backup borehole and fast access to Ruaka town.',
        status: 'approved',
        registeredAt: '2026-10-20T09:15:00Z',
        approvedAt: '2026-10-21T14:00:00Z'
      },
      {
        id: 'PROP-NAI-003',
        name: 'Amani Court',
        category: 'courts',
        location: 'Buruburu, Nairobi · 2.1 km away',
        priceKES: 7000,
        unitsCount: 6,
        vacantCount: 4,
        landlordName: 'Grace A. (LL-44109)',
        landlordPhone: '+254 733 221 456',
        cadastralTitleNo: 'NAIROBI/BURU/3312B',
        imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=420&fit=crop',
        description: 'Courtyard community setting with shared compound security and dedicated caretaker.',
        status: 'approved',
        registeredAt: '2026-10-25T11:00:00Z',
        approvedAt: '2026-10-26T16:20:00Z'
      },
      {
        id: 'PROP-KAJ-004',
        name: '3-bed House, Rongai',
        category: 'rentals',
        location: 'Rongai, Kajiado · 14 km away',
        priceKES: 22000,
        unitsCount: 1,
        vacantCount: 1,
        landlordName: 'Peter K. (LL-99301)',
        landlordPhone: '+254 701 556 823',
        cadastralTitleNo: 'KAJIADO/RONGAI/9981',
        imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=420&fit=crop',
        description: 'Standalone gated family house with own compound and perimeter wall.',
        status: 'approved',
        registeredAt: '2026-11-01T13:40:00Z',
        approvedAt: '2026-11-02T09:10:00Z'
      },
      {
        id: 'PROP-NAI-005',
        name: 'Green Ridge Maisonette',
        category: 'rentals',
        location: 'Lavington, Nairobi',
        priceKES: 38000,
        unitsCount: 2,
        vacantCount: 1,
        landlordName: 'Kariuki M. (LL-60211)',
        landlordPhone: '+254 711 990 022',
        cadastralTitleNo: 'NAIROBI/LAV/7821',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=420&fit=crop',
        description: 'Newly registered modern maisonette. Awaiting physical field inspection.',
        status: 'pending_approval',
        registeredAt: '2026-11-10T14:00:00Z'
      }
    ];
  }

  function getSeedEscrows() {
    return [
      {
        id: 'ESC-NAI-8921',
        tenantName: 'Grace Wanjiku',
        tenantPhone: '+254 700 882 119',
        landlordId: 'LL-88201',
        landlordName: 'James M.',
        landlordPhone: '+254 712 345 678',
        propertyId: 'PROP-NAI-001',
        propertyName: 'Marigold Court',
        unitId: 'UNIT-NAI-001-A2',
        amountKES: 12000,
        paymentChannel: 'M-Pesa Synchro Escrow (Paybill 400200)',
        mpesaRef: 'QHG992104A',
        createdAt: '2026-11-09T14:22:00Z',
        status: 'site_verified',
        inspectionNotes: 'Field officer confirmed unit existence, vacant keys with caretaker, and water connection active.',
        inspectorName: 'Officer Daniel O. (NyumbaLink Field Unit)',
        verifiedAt: '2026-11-10T09:15:00Z'
      },
      {
        id: 'ESC-KIA-4402',
        tenantName: 'Kevin Mutua',
        tenantPhone: '+254 714 551 092',
        landlordId: 'LL-77142',
        landlordName: 'Waweru N.',
        landlordPhone: '+254 720 884 512',
        propertyId: 'PROP-KIA-002',
        propertyName: 'Riverside Bedsitters',
        unitId: 'UNIT-KIA-002-U1',
        amountKES: 6500,
        paymentChannel: 'M-Pesa Synchro Escrow (Till 993015)',
        mpesaRef: 'QHH120988B',
        createdAt: '2026-11-11T05:10:00Z',
        status: 'held_in_synchro',
        inspectionNotes: 'Field officer dispatched. Waiting for physical unit handover verification before releasing.',
        inspectorName: 'Pending assignment'
      },
      {
        id: 'ESC-BUR-3310',
        tenantName: 'Amina Hassan',
        tenantPhone: '+254 722 341 908',
        landlordId: 'LL-44109',
        landlordName: 'Grace A.',
        landlordPhone: '+254 733 221 456',
        propertyId: 'PROP-NAI-003',
        propertyName: 'Amani Court',
        unitId: 'UNIT-NAI-003-U2',
        amountKES: 7000,
        paymentChannel: 'M-Pesa Synchro Escrow (Paybill 550100)',
        mpesaRef: 'QHF881023C',
        createdAt: '2026-11-05T10:00:00Z',
        status: 'released_to_landlord',
        inspectionNotes: 'Verified on-site Nov 6. Tenant moved in; deposit released to landlord M-Pesa.',
        inspectorName: 'Officer Ruth K.',
        verifiedAt: '2026-11-06T11:00:00Z',
        releasedAt: '2026-11-06T11:30:00Z'
      }
    ];
  }

  window.SynchroService = {
    getProperties: function () {
      const raw = localStorage.getItem(PROPERTIES_STORAGE_KEY);
      if (!raw) {
        const seed = getSeedProperties();
        localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      try {
        return JSON.parse(raw);
      } catch (e) {
        return getSeedProperties();
      }
    },

    saveProperties: function (list) {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(list));
    },

    getApprovedProperties: function (categoryFilter) {
      const all = this.getProperties();
      const approved = all.filter(p => p.status === 'approved');
      if (!categoryFilter) return approved;
      return approved.filter(p => p.category === categoryFilter);
    },

    registerProperty: function (data) {
      const list = this.getProperties();
      const nextNum = list.length + 1;
      const id = 'PROP-REG-' + String(nextNum).padStart(3, '0');
      const newProp = {
        id: id,
        name: data.name,
        category: data.category || 'apartments',
        location: data.location,
        priceKES: Number(data.priceKES),
        unitsCount: Number(data.unitsCount || 1),
        vacantCount: Number(data.vacantCount || data.unitsCount || 1),
        landlordName: data.landlordName || 'Registered Owner',
        landlordPhone: data.landlordPhone,
        cadastralTitleNo: data.cadastralTitleNo,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=420&fit=crop',
        description: data.description,
        status: 'pending_approval',
        registeredAt: new Date().toISOString()
      };
      list.unshift(newProp);
      this.saveProperties(list);
      return newProp;
    },

    approveProperty: function (propId) {
      const list = this.getProperties();
      const item = list.find(p => p.id === propId);
      if (item) {
        item.status = 'approved';
        item.approvedAt = new Date().toISOString();
        this.saveProperties(list);
      }
      return item;
    },

    rejectProperty: function (propId, reason) {
      const list = this.getProperties();
      const item = list.find(p => p.id === propId);
      if (item) {
        item.status = 'rejected';
        item.rejectionReason = reason || 'Cadastral title or structural documentation incomplete.';
        this.saveProperties(list);
      }
      return item;
    },

    // Escrow methods
    getEscrows: function () {
      const raw = localStorage.getItem(ESCROW_STORAGE_KEY);
      if (!raw) {
        const seed = getSeedEscrows();
        localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(seed));
        return seed;
      }
      try {
        return JSON.parse(raw);
      } catch (e) {
        return getSeedEscrows();
      }
    },

    saveEscrows: function (list) {
      localStorage.setItem(ESCROW_STORAGE_KEY, JSON.stringify(list));
    },

    createEscrowHold: function (data) {
      const list = this.getEscrows();
      const nextNum = Math.floor(1000 + Math.random() * 9000);
      const id = 'ESC-SYN-' + nextNum;
      const hold = {
        id: id,
        tenantName: data.tenantName,
        tenantPhone: data.tenantPhone || '+254 7•• ••• •••',
        landlordId: data.landlordId || 'LL-88201',
        landlordName: data.landlordName || 'James M. (Landlord)',
        landlordPhone: data.landlordPhone || '+254 712 345 678',
        propertyId: data.propertyId || 'PROP-NAI-001',
        propertyName: data.propertyName || 'Marigold Court',
        unitId: data.unitId || 'Unit A2',
        amountKES: Number(data.amountKES),
        paymentChannel: data.paymentChannel || 'M-Pesa Synchro Escrow Account',
        mpesaRef: 'QHJ' + Math.floor(100000 + Math.random() * 900000) + 'X',
        createdAt: new Date().toISOString(),
        status: 'held_in_synchro',
        inspectionNotes: 'Funds successfully quarantined in Synchro Account. Scheduled for physical verification.'
      };
      list.unshift(hold);
      this.saveEscrows(list);
      return hold;
    },

    certifyPropertyExistence: function (escrowId, notes, inspectorName) {
      const list = this.getEscrows();
      const hold = list.find(e => e.id === escrowId);
      if (hold) {
        hold.status = 'site_verified';
        hold.inspectionNotes = notes || 'Admin verified physical location, structure existence, and caretaker presence.';
        hold.inspectorName = inspectorName || 'Admin / Cadastral Officer';
        hold.verifiedAt = new Date().toISOString();
        this.saveEscrows(list);
      }
      return hold;
    },

    releaseToLandlord: function (escrowId) {
      const list = this.getEscrows();
      const hold = list.find(e => e.id === escrowId);
      if (hold && hold.status === 'site_verified') {
        hold.status = 'released_to_landlord';
        hold.releasedAt = new Date().toISOString();
        this.saveEscrows(list);
        return { success: true, hold: hold };
      }
      return { success: false, reason: 'Property existence must be verified before releasing tenant funds.' };
    },

    refundToTenant: function (escrowId, reason) {
      const list = this.getEscrows();
      const hold = list.find(e => e.id === escrowId);
      if (hold && hold.status !== 'released_to_landlord') {
        hold.status = 'refunded_to_tenant';
        hold.inspectionNotes = 'Refunded: ' + (reason || 'Physical inspection failed or landlord misrepresented property.');
        this.saveEscrows(list);
        return { success: true, hold: hold };
      }
      return { success: false, reason: 'Cannot refund; funds already disbursed.' };
    }
  };
})();
