import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Gift, ShieldCheck, UserPlus, LogIn, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import referralService from '../../services/referralService';

export default function ReferralRedirect() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    async function processReferral() {
      if (!code) {
        navigate('/products', { replace: true });
        return;
      }

      const cleanCode = code.trim().toUpperCase();
      localStorage.setItem('bb_referral_code', cleanCode);

      try {
        setLoading(true);
        const val = await referralService.validateCode(cleanCode);
        setValidation(val);
      } catch (err) {
        console.error('Referral validation error:', err);
        setValidation({
          isValid: false,
          message: 'Unable to validate referral code.'
        });
      } finally {
        setLoading(false);
      }
    }

    processReferral();
  }, [code, navigate]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4" style={{ backgroundColor: 'var(--bb-bg-navy)', color: 'var(--bb-text)' }}>
        <div className="spinner-border text-info mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Validating referral invitation...</span>
        </div>
        <h4 className="fw-bold text-theme-title">Verifying Referral Invitation...</h4>
        <p className="text-theme-muted">Connecting with BeatBox referral engine...</p>
      </div>
    );
  }

  const isInvalid = !validation || !validation.isValid;

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ backgroundColor: 'var(--bb-bg-navy)', color: 'var(--bb-text)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Glow Orbs */}
      <div className="position-absolute" style={{ top: '10%', left: '15%', width: '400px', height: '400px', background: 'var(--bb-primary-glow)', filter: 'blur(150px)', opacity: 0.35, pointerEvents: 'none' }} />
      <div className="position-absolute" style={{ bottom: '10%', right: '15%', width: '400px', height: '400px', background: 'var(--bb-accent-glow)', filter: 'blur(150px)', opacity: 0.35, pointerEvents: 'none' }} />

      <div className="container max-w-600 position-relative z-1">
        <div className="p-4 p-md-5 rounded-4 text-center" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 20px 40px var(--bb-shadow)' }}>
          
          {isInvalid ? (
            <div>
              <div className="d-inline-flex p-3 rounded-circle mb-3 bg-danger-subtle text-danger border border-danger-subtle">
                <AlertCircle size={36} />
              </div>
              <h2 className="fw-black text-theme-title mb-2">Referral Invitation Notice</h2>
              <p className="text-theme-muted fs-6 mb-4">{validation?.message || 'This referral code is invalid or has expired.'}</p>
              
              <button 
                onClick={() => navigate('/products')}
                className="btn btn-glow fw-bold rounded-pill px-4 py-2.5"
              >
                Explore BeatBox Products <ArrowRight size={18} className="ms-1" />
              </button>
            </div>
          ) : (
            <div>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(0, 243, 255, 0.1)', border: '1px solid rgba(0, 243, 255, 0.3)', color: 'var(--bb-accent)' }}>
                <Sparkles size={16} />
                <span className="fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>BEATBOX REFERRAL INVITE</span>
              </div>

              <h2 className="fw-black text-theme-title mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
                You're Invited to BeatBox!
              </h2>

              <p className="text-theme-muted fs-6 mb-4">
                Your friend <strong className="text-theme-title">{validation.referrerName}</strong> invited you to shop premium wireless audio gear.
              </p>

              {/* Benefit Card */}
              <div className="p-4 rounded-4 mb-4" style={{ background: 'var(--bb-surface-2)', border: '1px dashed var(--bb-accent)' }}>
                <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-2" style={{ background: 'rgba(57,255,20,0.15)', color: '#39ff14' }}>
                  <Gift size={28} />
                </div>
                <div className="fw-black fs-2" style={{ color: 'var(--bb-accent)' }}>₹500 OFF</div>
                <div className="fw-semibold text-theme-title mt-1">On Your First Eligible Purchase</div>
                <div className="text-theme-muted extra-small mt-1" style={{ fontSize: '0.8rem' }}>Create your account or log in to link your referral discount code <code className="px-2 py-0.5 rounded bg-dark text-info">{validation.code}</code></div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-column gap-3 mb-3">
                <Link 
                  to={`/register?ref=${validation.code}`}
                  className="btn btn-glow fw-bold rounded-pill py-3 px-4 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                  style={{ fontSize: '1.05rem' }}
                >
                  <UserPlus size={20} /> Create Account to Claim ₹500
                </Link>

                <Link 
                  to={`/login?ref=${validation.code}`}
                  className="btn btn-outline-secondary fw-bold rounded-pill py-2.5 px-4 text-theme-title text-decoration-none d-flex align-items-center justify-content-center gap-2"
                  style={{ borderColor: 'var(--bb-border)' }}
                >
                  <LogIn size={18} /> Already have an account? Log In
                </Link>
              </div>

              <div className="text-theme-muted extra-small d-flex align-items-center justify-content-center gap-1 mt-3" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} className="text-success" /> Verified BeatBox Referral Engine • Reward applies upon first qualifying checkout
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
