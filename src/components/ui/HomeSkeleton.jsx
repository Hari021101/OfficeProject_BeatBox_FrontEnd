import React from 'react'

export function ExploreBestsellersSkeleton() {
  return (
    <section className="py-5 storefront-section position-relative overflow-hidden">
      <div className="container px-lg-5">
        <div className="text-center mb-5">
          <div className="skeleton-pulse mx-auto rounded" style={{ width: '220px', height: '36px', background: 'var(--bb-surface-2)' }}></div>
          <div className="skeleton-pulse mx-auto mt-2 rounded" style={{ width: '310px', height: '20px', background: 'var(--bb-surface-2)' }}></div>
        </div>
        <div className="row g-4 row-cols-2 row-cols-lg-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="col">
              <div className="rounded-4" style={{ height: '300px', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="skeleton-pulse w-100 h-50 rounded-top" style={{ background: 'var(--bb-surface-2)' }}></div>
                <div className="p-3">
                  <div className="skeleton-pulse rounded mb-2" style={{ width: '60%', height: '20px', background: 'var(--bb-surface-2)' }}></div>
                  <div className="skeleton-pulse rounded" style={{ width: '40%', height: '14px', background: 'var(--bb-surface-2)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BestSellersSkeleton() {
  return (
    <section className="py-5">
      <div className="container px-lg-5">
        <div className="mb-4">
          <div className="skeleton-pulse rounded mb-2" style={{ width: '180px', height: '32px', background: 'var(--bb-surface-2)' }}></div>
          <div className="skeleton-pulse rounded" style={{ width: '250px', height: '18px', background: 'var(--bb-surface-2)' }}></div>
        </div>
        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="col">
              <div className="rounded-4 p-3" style={{ height: '380px', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton-pulse rounded-3 flex-grow-1" style={{ background: 'var(--bb-surface-2)' }}></div>
                <div className="skeleton-pulse rounded" style={{ width: '80%', height: '20px', background: 'var(--bb-surface-2)' }}></div>
                <div className="skeleton-pulse rounded" style={{ width: '40%', height: '14px', background: 'var(--bb-surface-2)' }}></div>
                <div className="skeleton-pulse rounded-3" style={{ width: '100%', height: '40px', background: 'var(--bb-surface-2)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TrendingCategoriesSkeleton() {
  return (
    <section className="py-5">
      <div className="container px-lg-5">
        <div className="text-center mb-5">
          <div className="skeleton-pulse mx-auto rounded" style={{ width: '240px', height: '36px', background: 'var(--bb-surface-2)' }}></div>
          <div className="skeleton-pulse mx-auto mt-2 rounded" style={{ width: '320px', height: '18px', background: 'var(--bb-surface-2)' }}></div>
        </div>
        <div className="row g-4 row-cols-2 row-cols-md-5 justify-content-center">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="col">
              <div className="rounded-4 p-4 d-flex flex-column align-items-center gap-3" style={{ height: '220px', background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="skeleton-pulse rounded-circle" style={{ width: '90px', height: '90px', background: 'var(--bb-surface-2)' }}></div>
                <div className="skeleton-pulse rounded" style={{ width: '60px', height: '18px', background: 'var(--bb-surface-2)' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
