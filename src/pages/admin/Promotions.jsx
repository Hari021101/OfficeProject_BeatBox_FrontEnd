import React, { useState } from 'react'
import { Tag, Plus, CheckCircle, Clock, XCircle } from 'lucide-react'
import DataTable from '../../components/admin/DataTable'

const MOCK_PROMOS = [
  { id: '1', code: 'SUMMER50', type: 'Percentage', value: '50%', status: 'Active', usage: '342 / 1000', expires: '2026-08-31' },
  { id: '2', code: 'WELCOME10', type: 'Percentage', value: '10%', status: 'Active', usage: '1042 / ∞', expires: 'Never' },
  { id: '3', code: 'FREESHIP', type: 'Shipping', value: 'Free', status: 'Expired', usage: '500 / 500', expires: '2026-05-01' },
  { id: '4', code: 'FLAT500', type: 'Fixed', value: '₹500', status: 'Scheduled', usage: '0 / 100', expires: '2026-12-31' },
]

export default function Promotions() {
  const columns = [
    { key: 'code', label: 'Coupon Code', sortable: true, render: (row) => <span className="fw-black text-theme-title text-accent px-2 py-1 bg-accent bg-opacity-10 rounded">{row.code}</span> },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'value', label: 'Discount', sortable: true, render: (row) => <span className="fw-bold text-theme-title">{row.value}</span> },
    { key: 'usage', label: 'Usage', sortable: false },
    { key: 'expires', label: 'Expires', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (row) => {
        let color = 'text-success';
        let Icon = CheckCircle;
        if (row.status === 'Expired') { color = 'text-danger'; Icon = XCircle; }
        if (row.status === 'Scheduled') { color = 'text-warning'; Icon = Clock; }
        return (
          <span className={`badge bg-opacity-25 d-flex align-items-center gap-1 ${color} bg-${color.split('-')[1]}`} style={{ width: 'fit-content' }}>
            <Icon size={12} /> {row.status}
          </span>
        )
      } 
    }
  ]

  return (
    <div className="py-2 animate__animated animate__fadeIn">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-black text-theme-title mb-1">Promotions Engine</h2>
          <p className="text-theme-muted mb-0">Create and manage marketing campaigns and discounts.</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Active Campaigns</h6>
            <h3 className="fw-black text-accent mb-0">2</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Total Discount Value</h6>
            <h3 className="fw-black text-success mb-0">₹1,24,500</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 p-4" style={{ background: 'var(--bb-surface)', borderRadius: '16px' }}>
            <h6 className="text-theme-muted fw-bold text-uppercase mb-2">Coupons Redeemed</h6>
            <h3 className="fw-black text-info mb-0">1,384</h3>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns}
        data={MOCK_PROMOS}
        searchPlaceholder="Search coupons..."
        searchableFields={['code', 'status', 'type']}
        onAdd={() => alert('Coupon Creator UI coming soon!')}
        addLabel="Create Coupon"
      />
    </div>
  )
}
