import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Upload, Sliders, Activity, Headphones, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BeatBoxStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isBeatBoxEqEnabled, setIsBeatBoxEqEnabled] = useState(false);

  // Audio Context Refs
  const audioContextRef = useRef(null);
  const audioRef = useRef(null);
  const sourceRef = useRef(null);
  const analyzerRef = useRef(null);
  const bassFilterRef = useRef(null);
  const trebleFilterRef = useRef(null);
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // Initialize Web Audio API
  const initAudio = () => {
    if (audioContextRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;

      // Create EQ Filters (BeatBox Signature Sound: V-shaped EQ)
      bassFilterRef.current = audioContextRef.current.createBiquadFilter();
      bassFilterRef.current.type = 'lowshelf';
      bassFilterRef.current.frequency.value = 150; // Boost below 150Hz
      bassFilterRef.current.gain.value = 0; // Start flat

      trebleFilterRef.current = audioContextRef.current.createBiquadFilter();
      trebleFilterRef.current.type = 'highshelf';
      trebleFilterRef.current.frequency.value = 4000; // Boost above 4kHz
      trebleFilterRef.current.gain.value = 0; // Start flat

      // Connect nodes: Source -> Bass -> Treble -> Analyzer -> Destination
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(bassFilterRef.current);
      bassFilterRef.current.connect(trebleFilterRef.current);
      trebleFilterRef.current.connect(analyzerRef.current);
      analyzerRef.current.connect(audioContextRef.current.destination);

    } catch (err) {
      console.error("Web Audio API not supported", err);
      toast.error("Your browser doesn't support the Audio Visualizer.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload a valid audio file (MP3, WAV).');
        return;
      }
      const url = URL.createObjectURL(file);
      setAudioFile(url);
      setFileName(file.name);
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.load();
      }
      toast.success("Track loaded! Hit play to visualize.");
    }
  };

  const togglePlay = () => {
    if (!audioFile) {
      toast.error("Please upload a track first.");
      return;
    }

    if (!audioContextRef.current) {
      initAudio();
    }

    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      drawVisualizer();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleEq = () => {
    const newState = !isBeatBoxEqEnabled;
    setIsBeatBoxEqEnabled(newState);

    if (bassFilterRef.current && trebleFilterRef.current) {
      // Transition values smoothly
      const now = audioContextRef.current.currentTime;
      bassFilterRef.current.gain.setTargetAtTime(newState ? 12 : 0, now, 0.5); // +12dB Bass Boost
      trebleFilterRef.current.gain.setTargetAtTime(newState ? 6 : 0, now, 0.5);  // +6dB Treble Clarity
    }

    toast(newState ? "🔥 BeatBox Signature Bass Enabled!" : "🎵 Standard Audio Mode", {
      icon: newState ? '🚀' : '🎧',
      style: {
        background: '#0a0d14',
        color: newState ? '#00f3ff' : '#fff',
        border: `1px solid ${newState ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255,255,255,0.1)'}`
      }
    });
  };

  // Canvas Drawing Loop
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const renderFrame = () => {
      requestRef.current = requestAnimationFrame(renderFrame);
      analyzerRef.current.getByteFrequencyData(dataArray);

      // Clear canvas with theme-aware background
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.85)' : 'rgba(4, 7, 18, 0.8)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // Create vibrant gradients based on EQ state
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        if (isBeatBoxEqEnabled) {
          gradient.addColorStop(0, '#a820ff'); // Primary
          gradient.addColorStop(1, '#00f3ff'); // Accent
        } else {
          gradient.addColorStop(0, isLight ? '#64748b' : '#4b5563'); // Muted Grey
          gradient.addColorStop(1, isLight ? '#334155' : '#9ca3af');
        }

        ctx.fillStyle = gradient;

        // Draw bars originating from the vertical center
        const y = height - barHeight;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - 2, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        x += barWidth;
      }
    };

    renderFrame();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="min-vh-100 py-5 position-relative overflow-hidden studio-page-wrapper" style={{ background: 'var(--bb-bg-navy)', color: 'var(--bb-text)' }}>

      {/* Background Ambience */}
      <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ zIndex: 0, opacity: 0.6 }}>
        <div className="bg-glow-orb" style={{ width: 600, height: 600, background: 'var(--bb-primary-glow)', top: '-10%', left: '-10%', filter: 'blur(150px)' }} />
        <div className="bg-glow-orb" style={{ width: 500, height: 500, background: isBeatBoxEqEnabled ? 'var(--bb-accent-glow)' : 'rgba(255,255,255,0.05)', bottom: '-10%', right: '-5%', filter: 'blur(120px)', transition: 'background 1s ease' }} />
      </div>

      <div className="container position-relative" style={{ zIndex: 5, marginTop: '40px' }}>

        {/* Header Section */}
        <div className="text-center mb-5">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge rounded-pill px-3 py-2 mb-4 d-inline-block fw-bold corporate-hero-badge" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
              <Activity size={14} className="me-2" /> Interactive Experience
            </span>
            <h1 className="display-4 fw-black text-theme-title mb-3" style={{ letterSpacing: '-2px' }}>
              BeatBox <span className="gradient-text">Studio</span>
            </h1>
            <p className="lead mx-auto text-theme-muted" style={{ maxWidth: '600px' }}>
              Upload your favorite track and experience the difference. Toggle our signature EQ to hear the thunderous bass and crystal-clear highs we're famous for.
            </p>
          </motion.div>
        </div>

        {/* Studio Console Layout */}
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="card glass-card border-0 p-1 studio-main-console" style={{ borderRadius: '24px', background: 'var(--bb-studio-surface)', border: '1px solid var(--bb-studio-border)' }}>
              <div className="card-body p-4 p-md-5">

                {/* Visualizer Canvas Area */}
                <div
                  className="w-100 rounded-4 overflow-hidden mb-4 position-relative d-flex align-items-center justify-content-center studio-visualizer-container"
                  style={{
                    height: '350px',
                    border: `1px solid ${isBeatBoxEqEnabled ? 'var(--bb-accent)' : 'var(--bb-studio-border)'}`,
                    boxShadow: isBeatBoxEqEnabled ? '0 0 40px rgba(0,243,255,0.15) inset' : 'none',
                    transition: 'all 0.5s ease'
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    width={900}
                    height={350}
                    className="w-100 h-100"
                    style={{ filter: isBeatBoxEqEnabled ? 'drop-shadow(0 0 10px rgba(168,32,255,0.5))' : 'none' }}
                  />

                  {/* Empty State Overlay */}
                  {!audioFile && (
                    <div className="position-absolute text-center" style={{ zIndex: 10 }}>
                      <Activity size={48} className="mb-3 opacity-75" style={{ color: 'var(--bb-accent)' }} />
                      <h5 className="fw-bold mb-1 studio-empty-title">Awaiting Audio Signal...</h5>
                      <p className="small mb-0 studio-empty-description">Upload a track to begin visualization</p>
                    </div>
                  )}
                </div>

                {/* Control Deck */}
                <div className="row g-4 align-items-center p-4 rounded-4 studio-control-deck" style={{ background: 'var(--bb-studio-surface-secondary)', border: '1px solid var(--bb-studio-border)' }}>

                  {/* Left: Upload & Track Info */}
                  <div className="col-12 col-md-4">
                    <div className="d-flex align-items-center gap-3">
                      <label
                        className="btn rounded-circle p-3 d-flex align-items-center justify-content-center hover-scale studio-upload-btn"
                        style={{
                          width: '54px', height: '54px',
                          cursor: 'pointer',
                          border: '1px dashed var(--bb-studio-border)',
                          background: 'var(--bb-surface)',
                          color: 'var(--bb-text)'
                        }}
                        title="Upload Audio File"
                      >
                        <input type="file" accept="audio/*" className="d-none" onChange={handleFileUpload} />
                        <Upload size={20} />
                      </label>
                      <div className="overflow-hidden">
                        <h6 className="fw-bold text-theme-title mb-1 text-truncate studio-track-title">
                          {fileName || "No track loaded"}
                        </h6>
                        <span className="badge rounded-pill small fw-semibold studio-supported-badge" style={{ background: 'var(--bb-surface-2)', color: 'var(--bb-muted)', border: '1px solid var(--bb-border)' }}>
                          {audioFile ? 'Ready to play' : 'MP3, WAV supported'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Play Controls */}
                  <div className="col-12 col-md-4 d-flex justify-content-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlay}
                      className="btn btn-glow rounded-circle d-flex align-items-center justify-content-center studio-play-btn"
                      style={{
                        width: '72px', height: '72px',
                        background: isPlaying ? 'linear-gradient(135deg, #ff416c, #ff4b2b)' : 'linear-gradient(135deg, var(--bb-primary), var(--bb-accent))',
                        boxShadow: isPlaying ? '0 10px 20px rgba(255, 65, 108, 0.3)' : '0 10px 20px var(--bb-accent-glow)'
                      }}
                    >
                      {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ms-1" />}
                    </motion.button>
                  </div>

                  {/* Right: Signature EQ Toggle */}
                  <div className="col-12 col-md-4 d-flex justify-content-md-end justify-content-center">
                    <div
                      className={`p-3 rounded-4 transition-all d-flex align-items-center gap-3 cursor-pointer hover-scale studio-eq-card ${isBeatBoxEqEnabled ? 'eq-active' : 'eq-inactive'}`}
                      style={{
                        background: isBeatBoxEqEnabled ? 'var(--bb-info-bg)' : 'var(--bb-surface)',
                        border: `1px solid ${isBeatBoxEqEnabled ? 'var(--bb-accent)' : 'var(--bb-border)'}`,
                        cursor: 'pointer'
                      }}
                      onClick={toggleEq}
                    >
                      <div className={`p-2 rounded-circle studio-eq-icon-wrap ${isBeatBoxEqEnabled ? 'active' : ''}`} style={{ background: isBeatBoxEqEnabled ? 'var(--bb-accent)' : 'var(--bb-surface-2)', color: isBeatBoxEqEnabled ? '#000' : 'var(--bb-text)' }}>
                        {isBeatBoxEqEnabled ? <Sparkles size={20} /> : <Sliders size={20} />}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 studio-eq-title" style={{ fontSize: '0.9rem' }}>BeatBox EQ</h6>
                        <span className={`studio-eq-status ${isBeatBoxEqEnabled ? 'active' : ''}`} style={{ fontSize: '0.75rem', color: isBeatBoxEqEnabled ? 'var(--bb-accent)' : 'var(--bb-muted)' }}>
                          {isBeatBoxEqEnabled ? 'Bass Boost Active' : 'Flat Studio Profile'}
                        </span>
                      </div>

                      {/* Custom Toggle Switch UI */}
                      <div className={`ms-2 position-relative rounded-pill studio-toggle-track ${isBeatBoxEqEnabled ? 'active' : ''}`} style={{ width: '40px', height: '22px', background: isBeatBoxEqEnabled ? 'var(--bb-primary)' : 'var(--bb-border)' }}>
                        <motion.div
                          className="position-absolute bg-white rounded-circle shadow-sm studio-toggle-thumb"
                          initial={false}
                          animate={{ x: isBeatBoxEqEnabled ? 18 : 2 }}
                          style={{ width: '18px', height: '18px', top: '2px' }}
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Information Grid Below */}
        <div className="row g-4 mt-5 justify-content-center text-center">
          <div className="col-md-4">
            <div className="p-4 rounded-4 glass-card h-100 studio-feature-card" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <Headphones size={32} className="mb-3 studio-feature-icon" style={{ color: 'var(--bb-accent)' }} />
              <h5 className="fw-bold text-theme-title studio-feature-title">Dynamic Drivers</h5>
              <p className="text-theme-muted small mb-0 studio-feature-desc">Our 40mm and 50mm drivers push air efficiently to recreate the club experience.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 glass-card h-100 studio-feature-card" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <Sliders size={32} className="mb-3 studio-feature-icon" style={{ color: 'var(--bb-primary-light)' }} />
              <h5 className="fw-bold text-theme-title studio-feature-title">V-Shaped Tuning</h5>
              <p className="text-theme-muted small mb-0 studio-feature-desc">Engineered with boosted lows and soaring highs for energetic, punchy audio.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 rounded-4 glass-card h-100 studio-feature-card" style={{ background: 'var(--bb-surface)', border: '1px solid var(--bb-border)' }}>
              <Activity size={32} className="mb-3 studio-feature-icon" style={{ color: 'var(--bb-accent)' }} />
              <h5 className="fw-bold text-theme-title studio-feature-title">High-Fidelity DACs</h5>
              <p className="text-theme-muted small mb-0 studio-feature-desc">Premium digital-to-analog converters ensure zero distortion at peak volumes.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => { setIsPlaying(false); if (requestRef.current) cancelAnimationFrame(requestRef.current); }}
      />
    </div>
  );
}
