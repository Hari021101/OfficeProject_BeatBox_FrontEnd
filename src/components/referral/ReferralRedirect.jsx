import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import referralService from '../../services/referralService';

export default function ReferralRedirect() {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function processReferral() {
      if (!code) {
        navigate('/products', { replace: true });
        return;
      }

      const cleanCode = code.trim().toUpperCase();
      localStorage.setItem('bb_referral_code', cleanCode);

      try {
        const val = await referralService.validateCode(cleanCode);
        if (val.isValid) {
          toast.success(`Referral Code ${cleanCode} Applied! Enjoy ₹500 off your first purchase 🎉`, {
            duration: 5000,
            icon: '🎁'
          });

          // If logged in, apply right away
          const token = localStorage.getItem('bb_token');
          if (token) {
            await referralService.applyReferral(cleanCode);
          }
        } else {
          toast.error(val.message || 'Invalid or expired referral code.');
        }
      } catch (err) {
        console.error('Referral processing error:', err);
      } finally {
        navigate('/products', { replace: true });
      }
    }

    processReferral();
  }, [code, navigate]);

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4" style={{ backgroundColor: 'var(--bb-bg-navy)', color: 'var(--bb-text)' }}>
      <div className="spinner-border text-info mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Applying referral code...</span>
      </div>
      <h4 className="fw-bold text-theme-title">Applying Referral Discount...</h4>
      <p className="text-theme-muted">Redirecting you to the BeatBox catalog...</p>
    </div>
  );
}
