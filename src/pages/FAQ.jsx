import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, ShieldCheck, Truck, RotateCcw, Headphones, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    category: 'Orders & Shipping',
    icon: <Truck size={20} className="text-info" />,
    questions: [
      {
        q: 'How long will delivery take?',
        a: 'Orders are typically processed within 24 hours. Express shipping delivers to major metro cities in 2-3 business days and rest of India in 4-6 business days.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, you will receive a tracking link via SMS and email. You can also view real-time tracking under My Account -> Orders.'
      },
      {
        q: 'Are shipping charges extra?',
        a: 'We offer FREE express shipping across India on all prepaid orders and orders above ₹499.'
      }
    ]
  },
  {
    category: 'Warranty & Claims',
    icon: <ShieldCheck size={20} className="text-success" />,
    questions: [
      {
        q: 'What is covered under the 1-Year Warranty?',
        a: 'Our 1-year brand warranty covers manufacturing defects, battery issues, driver failure, and bluetooth connectivity faults under normal usage.'
      },
      {
        q: 'How do I claim my product warranty?',
        a: 'You can initiate a claim directly from our Warranty Claim page or by emailing beatbox80555@gmail.com with your invoice copy and a brief video of the issue.'
      }
    ]
  },
  {
    category: 'Returns & Replacement',
    icon: <RotateCcw size={20} className="text-warning" />,
    questions: [
      {
        q: 'What is the 7-day replacement policy?',
        a: 'If you receive a defective or damaged product, you can request a hassle-free replacement within 7 days of delivery.'
      },
      {
        q: 'How do I return a product?',
        a: 'Navigate to your Orders tab, select the order, and click "Request Replacement/Return", or reach out to email support.'
      }
    ]
  },
  {
    category: 'Payment & Offers',
    icon: <CreditCard size={20} className="text-primary" />,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI, Credit/Debit Cards, Net Banking, Wallet payments, and Cash on Delivery (COD).'
      },
      {
        q: 'Is Cash on Delivery available?',
        a: 'Yes, Cash on Delivery is available for most pin codes across India.'
      }
    ]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIdx, setOpenIdx] = useState(null);

  const handleToggle = (key) => {
    setOpenIdx(openIdx === key ? null : key);
  };

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-glow-subtle text-info mb-3">
            <HelpCircle size={32} />
          </div>
          <h1 className="display-5 fw-black text-theme-title mb-3">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-theme-muted lead max-w-xl mx-auto mb-4">
            Everything you need to know about BeatBox products, orders, shipping, and warranty.
          </p>

          {/* Search Box */}
          <div className="position-relative max-w-lg mx-auto">
            <input 
              type="text" 
              className="form-control checkout-input ps-5 py-3 rounded-pill" 
              placeholder="Search questions (e.g. warranty, shipping, COD)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="position-absolute top-50 translate-middle-y start-0 ms-3 text-theme-muted" />
          </div>
        </div>

        {/* ACCORDION GROUPS */}
        <div className="d-flex flex-column gap-4">
          {FAQ_DATA.map((group, groupIdx) => {
            const filteredQuestions = group.questions.filter(
              item => item.q.toLowerCase().includes(searchTerm.toLowerCase()) || item.a.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (searchTerm && filteredQuestions.length === 0) return null;

            return (
              <div key={groupIdx} className="p-4 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--bb-border)' }}>
                  {group.icon}
                  <h4 className="fw-bold text-theme-title mb-0">{group.category}</h4>
                </div>

                <div className="d-flex flex-column gap-3">
                  {filteredQuestions.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`;
                    const isOpen = openIdx === key;

                    return (
                      <div 
                        key={key} 
                        className="rounded-3 overflow-hidden" 
                        style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}
                      >
                        <button 
                          onClick={() => handleToggle(key)}
                          className="w-100 p-3 text-start bg-transparent border-0 d-flex align-items-center justify-content-between text-theme-title fw-bold"
                          style={{ cursor: 'pointer' }}
                        >
                          <span style={{ fontSize: '0.95rem' }}>{item.q}</span>
                          <ChevronDown size={18} className={`transition-all ${isOpen ? 'rotate-180 text-info' : 'text-theme-muted'}`} />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-3 pb-3 text-theme-muted small border-top"
                              style={{ borderColor: 'var(--bb-border)', lineHeight: '1.7' }}
                            >
                              <div className="pt-2">{item.a}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* STILL HAVE QUESTIONS */}
        <div className="mt-5 text-center p-4 rounded-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
          <h5 className="fw-bold text-theme-title mb-2">Still have questions?</h5>
          <p className="text-theme-muted small mb-3">Our support team is available 24/7 to assist you.</p>
          <Link to="/support" className="btn btn-outline-info rounded-pill px-4 fw-bold">
            Contact Customer Support
          </Link>
        </div>

      </div>
    </div>
  );
}
