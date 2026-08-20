import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ShoppingBag, HelpCircle, User, Building, ShieldCheck } from 'lucide-react';

export default function Sitemap() {
  const sections = [
    {
      title: 'Shop & Categories',
      icon: <ShoppingBag size={20} className="text-info" />,
      links: [
        { label: 'All Products Catalog', url: '/products' },
        { label: 'True Wireless Earbuds', url: '/products?category=earbuds' },
        { label: 'Wireless Headphones', url: '/products?category=headphones' },
        { label: 'Wireless Neckbands', url: '/products?category=neckbands' },
        { label: 'Bluetooth Speakers', url: '/products?category=speakers' },
        { label: 'Wired & Gaming Gear', url: '/products?category=gaming' },
        { label: 'Daily Deals & Offers', url: '/daily-deals' },
        { label: 'Gifting Store', url: '/gifting' },
        { label: 'BeatBox Studio', url: '/studio' },
        { label: 'Compare Products', url: '/compare' },
      ]
    },
    {
      title: 'Support & Help',
      icon: <HelpCircle size={20} className="text-success" />,
      links: [
        { label: 'Customer Support Home', url: '/support' },
        { label: 'Track Your Orders', url: '/orders' },
        { label: 'Warranty Claim Submission', url: '/warranty' },
        { label: 'Return & Exchange Policy', url: '/returns' },
        { label: 'FAQs & User Guides', url: '/faq' },
      ]
    },
    {
      title: 'Company & Programs',
      icon: <Building size={20} className="text-accent" />,
      links: [
        { label: 'About BeatBox', url: '/about' },
        { label: 'Corporate Gifting & Bulk Orders', url: '/corporate' },
        { label: 'Personalisation & Engraving', url: '/personalisation' },
        { label: 'Refer & Earn Rewards', url: '/refer' },
        { label: 'Careers & Join Us', url: '/careers' },
      ]
    },
    {
      title: 'Account & Settings',
      icon: <User size={20} className="text-warning" />,
      links: [
        { label: 'User Account Profile', url: '/settings' },
        { label: 'Saved Shipping Addresses', url: '/addresses' },
        { label: 'Order History & Invoices', url: '/orders' },
        { label: 'Wishlist & Saved Items', url: '/wishlist' },
        { label: 'Shopping Cart', url: '/cart' },
      ]
    },
    {
      title: 'Legal & Policies',
      icon: <ShieldCheck size={20} className="text-primary" />,
      links: [
        { label: 'Privacy Policy', url: '/privacy-policy' },
        { label: 'Terms of Service', url: '/terms-of-service' },
        { label: 'Sitemap', url: '/sitemap' },
      ]
    }
  ];

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-info mb-3">
            <Map size={36} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            BeatBox <span className="gradient-text">Sitemap</span>
          </h1>
          <p className="text-theme-muted lead max-w-xl mx-auto">
            Easily navigate to any product category, support service, account tool, or company page.
          </p>
        </div>

        {/* SITEMAP GRID */}
        <div className="row g-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-4">
              <div className="p-4 rounded-4 h-100" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--bb-border)' }}>
                  {sec.icon}
                  <h5 className="fw-bold text-theme-title mb-0">{sec.title}</h5>
                </div>

                <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link 
                        to={link.url} 
                        className="text-theme-muted text-decoration-none hover-text-primary transition-all d-block py-1"
                      >
                        → {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
