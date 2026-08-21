import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchAddresses } from '../redux/profileSlice';
import { addressService } from '../services/addressService';
import { toast } from 'react-hot-toast';
import { MapPin, Plus, Edit2, Trash2, CheckCircle, ShieldCheck, ArrowLeft, Building, Home, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number starting with 6-9'),
  addressLine1: z.string().min(5, 'Address Line 1 must be at least 5 characters'),
  addressLine2: z.string().optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{6}$/, 'PIN code must be exactly 6 digits'),
  isDefault: z.boolean().default(false)
});

export default function Addresses() {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.profile);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: false
    }
  });

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    reset({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: addresses?.length === 0
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (addr) => {
    setEditingAddress(addr);
    reset({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault || false
    });
    setShowFormModal(true);
  };

  const onSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.userAddressId || editingAddress.id, {
          ...data,
          country: 'India'
        });
        toast.success('Address updated successfully!');
      } else {
        await addressService.addAddress({
          ...data,
          country: 'India'
        });
        toast.success('New address saved!');
      }
      setShowFormModal(false);
      reset();
      dispatch(fetchAddresses());
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save address. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.deleteAddress(id);
      toast.success('Address deleted successfully.');
      dispatch(fetchAddresses());
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete address.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      toast.success('Default delivery address updated.');
      dispatch(fetchAddresses());
    } catch (err) {
      console.error(err);
      toast.error('Failed to update default address.');
    }
  };

  return (
    <div className="min-vh-100 pb-5" style={{ backgroundColor: 'var(--bb-bg-navy)', paddingTop: '100px' }}>
      <div className="container px-3 px-lg-5 max-w-5xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom" style={{ borderColor: 'var(--bb-border)' }}>
          <div>
            <Link to="/settings" className="text-theme-muted text-decoration-none small d-flex align-items-center gap-1 mb-2 hover-text-primary">
              <ArrowLeft size={14} /> Back to Settings
            </Link>
            <h2 className="fw-black text-theme-title mb-0 d-flex align-items-center gap-2">
              <MapPin className="text-info" size={28} /> Saved Addresses
            </h2>
          </div>
          <button 
            onClick={handleOpenAddModal} 
            className="btn btn-glow rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {/* Content Body */}
        {loading && addresses?.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading addresses...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger rounded-4 p-4 text-center">
            <p className="mb-0 fw-semibold">{error}</p>
            <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => dispatch(fetchAddresses())}>
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {addresses?.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="p-4 rounded-circle d-inline-flex mb-3" style={{ background: 'var(--bb-surface-2)', border: '1px solid var(--bb-border)' }}>
                  <MapPin size={48} className="text-theme-muted opacity-50" />
                </div>
                <h4 className="fw-bold text-theme-title mb-2">No Saved Addresses Found</h4>
                <p className="text-theme-muted mb-4 max-w-md mx-auto">
                  Save your shipping addresses for a faster, seamless checkout experience.
                </p>
                <button 
                  onClick={handleOpenAddModal}
                  className="btn btn-glow rounded-pill px-4 py-2 fw-bold"
                >
                  + Add Your First Address
                </button>
              </div>
            ) : (
              addresses?.map((addr) => {
                const addressId = addr.userAddressId || addr.id;
                return (
                  <div key={addressId} className="col-12 col-md-6">
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-4 position-relative h-100 d-flex flex-column"
                      style={{ 
                        background: 'var(--bb-surface-2)', 
                        border: `1px solid ${addr.isDefault ? 'var(--bb-accent)' : 'var(--bb-border)'}`,
                        boxShadow: addr.isDefault ? '0 0 20px rgba(0, 243, 255, 0.15)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {/* Default Badge */}
                      {addr.isDefault && (
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-1 address-default-badge">
                            <CheckCircle size={12} /> Default Address
                          </span>
                        </div>
                      )}

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Home size={18} className="text-theme-muted" />
                        <h5 className="fw-black text-theme-title mb-0">{addr.fullName}</h5>
                      </div>

                      <p className="text-theme-muted small fw-semibold mb-3">📱 {addr.phone}</p>
                      
                      <div className="text-theme-title small flex-grow-1 lh-lg mb-4 p-3 rounded-3" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
                        <div>{addr.addressLine1}</div>
                        {addr.addressLine2 && <div>{addr.addressLine2}</div>}
                        <div className="fw-bold mt-1">
                          {addr.city}, {addr.state} - <span className="text-info">{addr.postalCode}</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-3 border-top" style={{ borderColor: 'var(--bb-border)' }}>
                        {!addr.isDefault ? (
                          <button 
                            onClick={() => handleSetDefault(addressId)}
                            className="btn btn-sm text-info p-0 fw-bold border-0 d-flex align-items-center gap-1 hover-underline"
                          >
                            <Check size={14} /> Set as Default
                          </button>
                        ) : (
                          <span className="small text-success fw-bold d-flex align-items-center gap-1">
                            <ShieldCheck size={14} /> Active Delivery Target
                          </span>
                        )}

                        <div className="d-flex align-items-center gap-2 ms-auto">
                          <button 
                            onClick={() => handleOpenEditModal(addr)}
                            className="btn btn-sm btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center text-theme-title"
                            title="Edit Address"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(addressId)}
                            className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                            title="Delete Address"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Modal Form for Add/Edit */}
        <AnimatePresence>
          {showFormModal && (
            <div className="position-fixed inset-0 d-flex align-items-center justify-content-center p-3" style={{ background: 'rgba(0,0,0,0.75)', zIndex: 10500, backdropFilter: 'blur(5px)', top: 0, left: 0, right: 0, bottom: 0 }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 p-md-5 rounded-4 w-100 max-w-2xl position-relative"
                style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' }}
              >
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom" style={{ borderColor: 'var(--bb-border)' }}>
                  <h4 className="fw-black text-theme-title mb-0">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h4>
                  <button 
                    onClick={() => setShowFormModal(false)}
                    className="btn-close btn-close-white shadow-none"
                    aria-label="Close modal"
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-theme-muted small fw-semibold">Full Name *</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="John Doe"
                        {...register('fullName')}
                      />
                      {errors.fullName && <p className="text-danger mt-1 mb-0 small">{errors.fullName.message}</p>}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-theme-muted small fw-semibold">Phone Number *</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="9876543210"
                        {...register('phone')}
                      />
                      {errors.phone && <p className="text-danger mt-1 mb-0 small">{errors.phone.message}</p>}
                    </div>

                    <div className="col-12">
                      <label className="form-label text-theme-muted small fw-semibold">Address Line 1 (Flat, House No., Building) *</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="123 Neon Beats Ave"
                        {...register('addressLine1')}
                      />
                      {errors.addressLine1 && <p className="text-danger mt-1 mb-0 small">{errors.addressLine1.message}</p>}
                    </div>

                    <div className="col-12">
                      <label className="form-label text-theme-muted small fw-semibold">Address Line 2 (Street, Area, Landmark)</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="Near Cyber Tower"
                        {...register('addressLine2')}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-theme-muted small fw-semibold">City *</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="Mumbai"
                        {...register('city')}
                      />
                      {errors.city && <p className="text-danger mt-1 mb-0 small">{errors.city.message}</p>}
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-theme-muted small fw-semibold">State *</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="Maharashtra"
                        {...register('state')}
                      />
                      {errors.state && <p className="text-danger mt-1 mb-0 small">{errors.state.message}</p>}
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-theme-muted small fw-semibold">PIN Code *</label>
                      <input 
                        className="form-control checkout-input" 
                        placeholder="400001"
                        {...register('postalCode')}
                      />
                      {errors.postalCode && <p className="text-danger mt-1 mb-0 small">{errors.postalCode.message}</p>}
                    </div>

                    <div className="col-12 mt-3">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="isDefaultCheckbox" 
                          {...register('isDefault')}
                        />
                        <label className="form-check-label text-theme-title small fw-bold" htmlFor="isDefaultCheckbox">
                          Set as Default Shipping Address
                        </label>
                      </div>
                    </div>

                    <div className="col-12 mt-4 d-flex justify-content-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setShowFormModal(false)}
                        className="btn btn-outline-secondary rounded-pill px-4"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={actionLoading}
                        className="btn btn-glow rounded-pill px-5 fw-bold"
                      >
                        {actionLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
