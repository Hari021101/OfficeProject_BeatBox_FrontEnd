import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, fetchAddresses, changePassword } from '../redux/profileSlice';
import { addressService } from '../services/addressService';
import { toast } from 'react-hot-toast';
import { User, MapPin, Shield, Plus, Edit2, Trash2, CheckCircle, Save } from 'lucide-react';

export default function Settings() {
  const dispatch = useDispatch();
  const { data: profile, addresses, loading } = useSelector(state => state.profile);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: ''
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', phone: '', isDefault: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: ''
  });

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({ fullName: profile.fullName || '', phoneNumber: profile.phoneNumber || '' });
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error(err || 'Failed to update profile');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await addressService.addAddress({ ...addressForm, country: 'India' });
      toast.success('Address added!');
      setShowAddressModal(false);
      dispatch(fetchAddresses());
      setAddressForm({ fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', phone: '', isDefault: false });
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.deleteAddress(id);
        toast.success('Address deleted');
        dispatch(fetchAddresses());
      } catch (err) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      toast.success('Default address updated');
      dispatch(fetchAddresses());
    } catch (err) {
      toast.error('Failed to update default address');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      toast.success('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      toast.error(err || 'Failed to update password');
    }
  };

  if (loading && !profile) {
    return <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: 'var(--bb-bg-navy)' }}><div className="spinner-border text-info" /></div>;
  }

  return (
    <div className="min-vh-100 pb-5 pt-4" style={{ backgroundColor: 'var(--bb-bg-navy)' }}>
      <div className="container-fluid px-3 px-lg-5">
        
        <div className="row g-4 max-w-6xl mx-auto">
          {/* Sidebar Tabs */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="p-3 rounded-4 sticky-top" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', top: 120 }}>
              <div className="d-flex align-items-center gap-3 mb-4 p-2">
                <div className="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 50, height: 50, fontSize: '1.2rem', background: 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))' }}>
                  {profile?.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h6 className="fw-bold text-theme-title mb-0">{profile?.fullName || 'User'}</h6>
                  <p className="text-theme-muted small mb-0">{profile?.email}</p>
                </div>
              </div>

              <div className="d-flex flex-row flex-md-column gap-2 overflow-auto">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`btn d-flex align-items-center gap-3 text-start px-3 py-3 border-0 rounded-3 fw-semibold ${activeTab === 'profile' ? 'bg-glow-subtle' : ''}`}
                  style={{ color: activeTab === 'profile' ? 'var(--bb-accent)' : 'var(--bb-title-color)', background: activeTab === 'profile' ? 'var(--bb-surface-2)' : 'transparent', whiteSpace: 'nowrap' }}
                >
                  <User size={18} /> Personal Info
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`btn d-flex align-items-center gap-3 text-start px-3 py-3 border-0 rounded-3 fw-semibold ${activeTab === 'addresses' ? 'bg-glow-subtle' : ''}`}
                  style={{ color: activeTab === 'addresses' ? 'var(--bb-accent)' : 'var(--bb-title-color)', background: activeTab === 'addresses' ? 'var(--bb-surface-2)' : 'transparent', whiteSpace: 'nowrap' }}
                >
                  <MapPin size={18} /> Saved Addresses
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`btn d-flex align-items-center gap-3 text-start px-3 py-3 border-0 rounded-3 fw-semibold ${activeTab === 'security' ? 'bg-glow-subtle' : ''}`}
                  style={{ color: activeTab === 'security' ? 'var(--bb-accent)' : 'var(--bb-title-color)', background: activeTab === 'security' ? 'var(--bb-surface-2)' : 'transparent', whiteSpace: 'nowrap' }}
                >
                  <Shield size={18} /> Security
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-12 col-md-8 col-lg-9">
            <AnimatePresence mode="wait">
              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="p-4 p-md-5 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-black text-theme-title mb-0">Personal Information</h4>
                      <button onClick={() => setIsEditing(!isEditing)} className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold d-flex align-items-center gap-2">
                        {isEditing ? <><User size={14} /> Cancel</> : <><Edit2 size={14} /> Edit</>}
                      </button>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                      <div className="row g-4">
                        <div className="col-12 col-md-6">
                          <label className="form-label text-theme-muted small fw-semibold">Full Name</label>
                          <input 
                            className="form-control checkout-input" 
                            value={formData.fullName} 
                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                            disabled={!isEditing} 
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label text-theme-muted small fw-semibold">Phone Number</label>
                          <input 
                            className="form-control checkout-input" 
                            value={formData.phoneNumber} 
                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                            disabled={!isEditing} 
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label text-theme-muted small fw-semibold">Email Address</label>
                          <input className="form-control checkout-input" value={profile?.email || ''} disabled />
                          <div className="form-text text-theme-muted" style={{ fontSize: '0.75rem' }}>Email cannot be changed.</div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-end">
                          <button type="submit" className="btn btn-glow px-4 py-2 fw-bold d-flex align-items-center gap-2" style={{ borderRadius: 10 }}>
                            <Save size={16} /> Save Changes
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </motion.div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="p-4 p-md-5 rounded-4 mb-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="fw-black text-theme-title mb-0">Saved Addresses</h4>
                      <button onClick={() => setShowAddressModal(!showAddressModal)} className="btn btn-glow btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2">
                        {showAddressModal ? 'Cancel' : <><Plus size={16} /> Add New</>}
                      </button>
                    </div>

                    {showAddressModal && (
                      <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-5 p-4 rounded-4" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-accent)' }} onSubmit={handleAddressSubmit}>
                        <h6 className="fw-bold text-theme-title mb-3 text-info">Add New Address</h6>
                        <div className="row g-3">
                          <div className="col-12 col-md-6">
                            <input className="form-control checkout-input" placeholder="Full Name" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
                          </div>
                          <div className="col-12 col-md-6">
                            <input className="form-control checkout-input" placeholder="Phone Number" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                          </div>
                          <div className="col-12">
                            <input className="form-control checkout-input" placeholder="Address Line 1" required value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} />
                          </div>
                          <div className="col-12">
                            <input className="form-control checkout-input" placeholder="Address Line 2 (Optional)" value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} />
                          </div>
                          <div className="col-12 col-md-4">
                            <input className="form-control checkout-input" placeholder="City" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                          </div>
                          <div className="col-12 col-md-4">
                            <input className="form-control checkout-input" placeholder="State" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                          </div>
                          <div className="col-12 col-md-4">
                            <input className="form-control checkout-input" placeholder="PIN Code" required value={addressForm.postalCode} onChange={e => setAddressForm({...addressForm, postalCode: e.target.value})} />
                          </div>
                          <div className="col-12">
                            <div className="form-check mt-2">
                              <input className="form-check-input" type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} />
                              <label className="form-check-label text-theme-title small fw-bold" htmlFor="isDefault">Set as Default Address</label>
                            </div>
                          </div>
                          <div className="col-12 mt-3">
                            <button type="submit" className="btn btn-glow px-4 py-2 fw-bold w-100" style={{ borderRadius: 10 }}>Save Address</button>
                          </div>
                        </div>
                      </motion.form>
                    )}

                    <div className="row g-3">
                      {addresses?.length === 0 ? (
                        <div className="col-12 text-center py-5">
                          <MapPin size={40} className="text-theme-muted mb-3 opacity-50" />
                          <p className="text-theme-muted fw-semibold">No addresses saved yet.</p>
                        </div>
                      ) : (
                        addresses?.map(addr => (
                          <div key={addr.userAddressId} className="col-12 col-lg-6">
                            <div className="p-3 p-md-4 rounded-4 position-relative h-100 d-flex flex-column" style={{ background: 'var(--bb-surface-2)', border: `1px solid ${addr.isDefault ? 'var(--bb-accent)' : 'var(--bb-border)'}` }}>
                              {addr.isDefault && (
                                <span className="badge bg-glow-subtle position-absolute top-0 end-0 m-3 d-flex align-items-center gap-1 px-2 py-1" style={{ color: 'var(--bb-accent)' }}>
                                  <CheckCircle size={12} /> Default
                                </span>
                              )}
                              <h6 className="fw-black text-theme-title mb-1">{addr.fullName}</h6>
                              <p className="text-theme-muted small mb-3">{addr.phone}</p>
                              
                              <p className="text-theme-title small mb-0 flex-grow-1">
                                {addr.addressLine1}<br/>
                                {addr.addressLine2 && <>{addr.addressLine2}<br/></>}
                                {addr.city}, {addr.state} - {addr.postalCode}
                              </p>

                              <div className="d-flex align-items-center gap-3 mt-4 pt-3 border-top border-secondary border-opacity-25">
                                {!addr.isDefault && (
                                  <button onClick={() => handleSetDefault(addr.userAddressId)} className="btn btn-sm text-info p-0 fw-bold border-0" style={{ fontSize: '0.8rem' }}>Set Default</button>
                                )}
                                <button onClick={() => handleDeleteAddress(addr.userAddressId)} className="btn btn-sm text-danger p-0 fw-bold border-0 ms-auto d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <div className="p-4 p-md-5 rounded-4" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                    <h4 className="fw-black text-theme-title mb-4">Security Settings</h4>
                    <p className="text-theme-muted mb-4">Manage your password and security preferences.</p>
                    
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="row g-4 max-w-2xl">
                        <div className="col-12 col-md-8">
                          <label className="form-label text-theme-muted small fw-semibold">Current Password</label>
                          <input 
                            type="password"
                            className="form-control checkout-input" 
                            required
                            value={passwordForm.currentPassword}
                            onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          />
                        </div>
                        <div className="col-12 col-md-8">
                          <label className="form-label text-theme-muted small fw-semibold">New Password</label>
                          <input 
                            type="password"
                            className="form-control checkout-input" 
                            required
                            value={passwordForm.newPassword}
                            onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          />
                        </div>
                        <div className="col-12 col-md-8">
                          <label className="form-label text-theme-muted small fw-semibold">Confirm New Password</label>
                          <input 
                            type="password"
                            className="form-control checkout-input" 
                            required
                            value={passwordForm.confirmNewPassword}
                            onChange={e => setPasswordForm({...passwordForm, confirmNewPassword: e.target.value})}
                          />
                        </div>
                        <div className="col-12 mt-4">
                          <button type="submit" className="btn btn-outline-info fw-bold py-2 px-4 rounded-3 d-flex align-items-center gap-2">
                            <Shield size={16} /> Update Password
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}