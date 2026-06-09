import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Headphones, Gamepad2, Mic, Activity, RefreshCw, ShoppingCart } from 'lucide-react';

import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { PRODUCTS } from '../data/products';

const QUESTIONS = [
  {
    id: 1,
    question: "Where do you listen the most?",
    subtitle: "Help us understand your environment.",
    options: [
      { id: 'gym', label: 'Gym / Workout', icon: <Activity size={32} /> },
      { id: 'commute', label: 'Commute / Travel', icon: <RefreshCw size={32} /> },
      { id: 'gaming', label: 'Gaming Room', icon: <Gamepad2 size={32} /> },
      { id: 'office', label: 'Office / Calls', icon: <Mic size={32} /> }
    ]
  },
  {
    id: 2,
    question: "What's your preferred style?",
    subtitle: "Comfort is key.",
    options: [
      { id: 'tws', label: 'True Wireless Earbuds', icon: <Sparkles size={32} /> },
      { id: 'overear', label: 'Over-Ear Headphones', icon: <Headphones size={32} /> },
      { id: 'neckband', label: 'Neckband', icon: <Activity size={32} /> }
    ]
  },
  {
    id: 3,
    question: "What matters most to you?",
    subtitle: "Pick your priority.",
    options: [
      { id: 'bass', label: 'Deep Bass', icon: <Activity size={32} /> },
      { id: 'battery', label: 'Long Battery Life', icon: <RefreshCw size={32} /> },
      { id: 'anc', label: 'Active Noise Cancellation', icon: <Headphones size={32} /> },
      { id: 'latency', label: 'Low Latency', icon: <Gamepad2 size={32} /> }
    ]
  }
];

export default function SoundMatch() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const dispatch = useDispatch();

  const handleOptionSelect = (questionId, optionId) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      analyzeResults(newAnswers);
    }
  };

  const analyzeResults = (finalAnswers) => {
    setIsAnalyzing(true);
    
    // Simple mock logic to select a product based on answers
    setTimeout(() => {
      let recommendedProductId = 2; // Default Rockerz Wireless 450
      
      if (finalAnswers[1] === 'gaming' || finalAnswers[3] === 'latency') {
        recommendedProductId = 3; // Airdopes Cyber 141
      } else if (finalAnswers[1] === 'gym' || finalAnswers[2] === 'neckband') {
        recommendedProductId = 7; // Trip Athletic Neon
      } else if (finalAnswers[3] === 'anc' || finalAnswers[2] === 'tws') {
        recommendedProductId = 4; // BeatBox Smart Capsule
      } else if (finalAnswers[1] === 'commute' && finalAnswers[2] === 'overear') {
        recommendedProductId = 1; // Rockerz Pro ANC 550
      }

      const match = PRODUCTS.find(p => p.id === recommendedProductId) || PRODUCTS[0];
      setResult(match);
      setIsAnalyzing(false);
    }, 2000); // 2 second fake analysis delay
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const handleAddToCart = () => {
    if (result) {
      dispatch(addToCart({
        id: result.id,
        name: result.name,
        price: result.price,
        image: result.imageKey, // Note: Make sure cart handles this properly
        quantity: 1
      }));
      toast.success(`${result.name} added to cart!`);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-5 d-flex flex-column align-items-center position-relative overflow-hidden" style={{ background: 'var(--bb-bg-navy)' }}>
      {/* Background Effects */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0, opacity: 0.5, pointerEvents: 'none' }}>
        <div className="bg-glow-orb" style={{ width: '400px', height: '400px', background: 'var(--bb-primary-glow)', top: '-10%', left: '-10%', filter: 'blur(120px)' }}></div>
        <div className="bg-glow-orb" style={{ width: '500px', height: '500px', background: 'var(--bb-accent-glow)', bottom: '-20%', right: '-10%', filter: 'blur(150px)' }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 10, maxWidth: '800px', marginTop: '80px' }}>
        
        {/* Header */}
        <div className="text-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge px-3 py-2 mb-3" style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--bb-primary)', border: '1px solid rgba(0,243,255,0.2)' }}>
              <Sparkles size={14} className="me-2" />
              AI Sound Profiler
            </span>
            <h1 className="display-4 fw-black text-white mb-3" style={{ letterSpacing: '-1px' }}>
              Find Your <span className="gradient-text">Perfect Sound</span>
            </h1>
            <p className="lead" style={{ color: 'var(--bb-text-muted)' }}>
              Answer three quick questions and we'll match you with the ultimate BeatBox gear.
            </p>
          </motion.div>
        </div>

        {/* Main Quiz Area */}
        <div className="glass-card p-5" style={{ minHeight: '450px', background: 'var(--bb-surface)' }}>
          <AnimatePresence mode="wait">
            {!isAnalyzing && !result && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="d-flex flex-column h-100"
              >
                {/* Progress Bar */}
                <div className="w-100 mb-5">
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                    <span>{Math.round(((currentStep) / QUESTIONS.length) * 100)}%</span>
                  </div>
                  <div className="progress" style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div 
                      className="progress-bar"
                      initial={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                      animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                      style={{ background: 'var(--bb-gradient-primary)' }}
                    />
                  </div>
                </div>

                <div className="text-center mb-5">
                  <h2 className="fw-bold text-white mb-2">{QUESTIONS[currentStep].question}</h2>
                  <p style={{ color: 'var(--bb-text-muted)' }}>{QUESTIONS[currentStep].subtitle}</p>
                </div>

                <div className="row g-4 mt-auto">
                  {QUESTIONS[currentStep].options.map((option) => (
                    <div className="col-md-6" key={option.id}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOptionSelect(QUESTIONS[currentStep].id, option.id)}
                        className={`btn w-100 h-100 p-4 text-start position-relative overflow-hidden
                          ${answers[QUESTIONS[currentStep].id] === option.id ? 'active-option' : 'glass-btn'}
                        `}
                        style={{
                          background: answers[QUESTIONS[currentStep].id] === option.id ? 'rgba(0, 243, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${answers[QUESTIONS[currentStep].id] === option.id ? 'var(--bb-primary)' : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '16px',
                          color: 'var(--bb-text-primary)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="d-flex align-items-center gap-4">
                          <div 
                            className="p-3 rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              background: answers[QUESTIONS[currentStep].id] === option.id ? 'var(--bb-primary)' : 'rgba(255,255,255,0.05)',
                              color: answers[QUESTIONS[currentStep].id] === option.id ? '#000' : 'var(--bb-primary)'
                            }}
                          >
                            {option.icon}
                          </div>
                          <span className="fw-bold fs-5">{option.label}</span>
                        </div>
                      </motion.button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="d-flex flex-column align-items-center justify-content-center h-100 py-5"
              >
                <div className="spinner-border text-primary mb-4" style={{ width: '4rem', height: '4rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h3 className="fw-bold text-white mb-2">Analyzing your profile...</h3>
                <p style={{ color: 'var(--bb-text-muted)' }}>Matching with our catalog for the perfect fit.</p>
              </motion.div>
            )}

            {result && !isAnalyzing && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-4">
                  <span className="badge bg-success px-3 py-2 mb-3">100% Match</span>
                  <h2 className="fw-bold text-white mb-1">We Found Your Perfect BeatBox!</h2>
                  <p style={{ color: 'var(--bb-text-muted)' }}>Based on your lifestyle and preferences.</p>
                </div>

                <div className="row justify-content-center align-items-center g-5 text-start mt-2">
                  <div className="col-md-5 text-center">
                    <motion.div 
                      className="position-relative d-inline-block"
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                       {/* Note: since imageKey needs to be mapped to real import, in a real scenario we'd use a component or context. 
                           For this UI we will just use a generic placeholder or the image key mapped if possible.
                           Since we don't have direct access to IMAGE_MAP here easily without modifying other files,
                           we'll just use a styled div or a placeholder img. */}
                      <div className="product-image-container rounded-circle shadow-lg" style={{ background: 'radial-gradient(circle, rgba(0,243,255,0.2) 0%, rgba(0,0,0,0) 70%)', padding: '30px' }}>
                        <img 
                          src={`/src/assets/${result.imageKey === 'heroHeadphones' ? 'hero_headphones.png' : 
                                result.imageKey === 'heroEarbuds' ? 'hero_earbuds.png' : 
                                result.imageKey === 'gamingHeadset' ? 'gaming_headset.png' :
                                result.imageKey === 'smartEarbuds' ? 'smart_earbuds.png' :
                                result.imageKey === 'wirelessNeckband' ? 'wireless_neckband.png' : 'hero_headphones.png'}`} 
                          alt={result.name} 
                          style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=BeatBox+Audio' }}
                        />
                      </div>
                    </motion.div>
                  </div>
                  <div className="col-md-7">
                    <h3 className="fw-black text-white display-6 mb-2">{result.name}</h3>
                    <p className="text-primary fw-bold fs-5 mb-4">₹{result.price.toLocaleString()} <span className="text-muted text-decoration-line-through small ms-2">₹{result.oldPrice.toLocaleString()}</span></p>
                    
                    <p className="mb-4" style={{ color: 'var(--bb-text-muted)', lineHeight: '1.6' }}>
                      {result.description}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-5">
                      {result.highlights && result.highlights.slice(0, 3).map((h, i) => (
                        <span key={i} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--bb-text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    <div className="d-flex gap-3">
                      <button onClick={handleAddToCart} className="btn btn-glow flex-grow-1 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: '12px' }}>
                        <ShoppingCart size={20} /> Add to Cart
                      </button>
                      <button onClick={resetQuiz} className="btn btn-outline-light py-3 px-4 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <RefreshCw size={20} /> Retake
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
