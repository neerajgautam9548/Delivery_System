import { useState, useEffect } from 'react';
import api from '../services/api';
import useDeviceType from '../hooks/useDeviceType';
import useNetworkSpeed from '../hooks/useNetworkSpeed';
import { Smartphone, Monitor, Tablet, Wifi, WifiOff, Settings2, Activity, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const device = useDeviceType();
  const network = useNetworkSpeed();
  const [meta, setMeta] = useState({});
  const [previewContent, setPreviewContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Local state to manage overrides instantly for demo impact
  const [manualMode, setManualMode] = useState(false);
  const [manualQuality, setManualQuality] = useState('medium');

  useEffect(() => {
    fetchMetaAndPreview();
  }, [device, network, manualMode, manualQuality]);

  const fetchMetaAndPreview = async () => {
    setLoading(true);
    try {
      const q = manualMode ? manualQuality : 'auto';
      const response = await api.get('/content/adaptive', {
        params: { device, network, preference: q } // assuming backend respects query preference
      });
      
      const newMeta = response.data.meta;
      
      // Toast if target changed
      if (meta.appliedQuality && newMeta.appliedQuality !== meta.appliedQuality) {
         toast.success(`Target Optimized to ${newMeta.appliedQuality.toUpperCase()}`, { icon: '⚡' });
      }
      
      setMeta(newMeta);
      if (response.data.data.length > 0) {
        setPreviewContent(response.data.data[0]); // grab first item for live preview
      }
    } catch (error) {
      console.error('Error fetching meta:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = () => {
    if (device === 'mobile') return <Smartphone size={32} />;
    if (device === 'tablet') return <Tablet size={32} />;
    return <Monitor size={32} />;
  };

  const getQualityColor = (q) => {
    if (q === 'low') return 'low';
    if (q === 'medium') return 'medium';
    if (q === 'high') return 'high';
    return 'medium';
  };

  // Framer Motion Variants
  const cardVariants = {
    hover: { scale: 1.05, boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)' },
    tap: { scale: 0.95 }
  };

  return (
    <>
      {/* Hero Section */}
      <div style={{textAlign: 'center', marginBottom: '3rem', marginTop: '1rem'}}>
        <motion.h1 
           initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}}
           className="hero-title"
        >
          Smart Engine
        </motion.h1>
        <motion.p 
           initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}
           className="hero-subtitle"
        >
          Adapting precisely to your environment in real-time.
        </motion.p>
      </div>

      {/* Control Panel */}
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass-panel control-panel">
         <div className="mode-toggle">
            <span className="text-muted" style={{fontWeight: 600}}>AUTO</span>
            <label className="switch">
              <input type="checkbox" checked={manualMode} onChange={(e) => setManualMode(e.target.checked)} />
              <span className="switch-slider"></span>
            </label>
            <span style={{fontWeight: 600, color: manualMode ? 'var(--text-color)' : 'var(--text-muted)'}}>MANUAL</span>
         </div>

         <AnimatePresence>
           {manualMode && (
             <motion.div 
                initial={{width: 0, opacity: 0}} animate={{width: 'auto', opacity: 1}} exit={{width: 0, opacity: 0}}
                className="segmented-controls"
             >
                <button className={manualQuality === 'low' ? 'active' : ''} onClick={() => setManualQuality('low')}>LOW</button>
                <button className={manualQuality === 'medium' ? 'active' : ''} onClick={() => setManualQuality('medium')}>MED</button>
                <button className={manualQuality === 'high' ? 'active' : ''} onClick={() => setManualQuality('high')}>HIGH</button>
             </motion.div>
           )}
         </AnimatePresence>
      </motion.div>

      {/* Live Status Cards */}
      <div className="metrics-section">
        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="glass-panel metric-card">
          <div className="metric-icon-wrap" style={{color: 'var(--accent-blue)', borderColor: 'rgba(59, 130, 246, 0.4)'}}>
             {getDeviceIcon()}
          </div>
          <div className="metric-info">
             <h4>Detected Device</h4>
             <div className="value">{device}</div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="glass-panel metric-card">
          <div className={`metric-icon-wrap ${network === 'slow' ? 'low' : 'high'}`}>
             {network === 'slow' ? <WifiOff size={32} /> : <Wifi size={32} />}
          </div>
          <div className="metric-info">
             <h4>Network Quality</h4>
             <div className="value">{network}</div>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="glass-panel metric-card" style={{border: '1px solid rgba(139, 92, 246, 0.4)'}}>
          <div className={`metric-icon-wrap ${getQualityColor(meta?.appliedQuality)}`}>
             <Activity size={32} />
          </div>
          <div className="metric-info">
             <h4>Stream Target</h4>
             <div className={`value quality-${getQualityColor(meta?.appliedQuality)}`}>
               {meta?.appliedQuality || '...'}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Live Content Preview */}
      <motion.div initial={{opacity: 0, y: 30}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}}>
         <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Play size={20} color="var(--accent-purple)"/> Live Stream Demo
         </h3>
         <div className="live-preview-container">
            {previewContent && (
               <AnimatePresence mode="wait">
                 <motion.div 
                    key={previewContent.mediaUrl} 
                    initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                    transition={{duration: 0.8}}
                    style={{width: '100%', height: '100%'}}
                 >
                    {previewContent.type === 'video' ? (
                      <video src={previewContent.mediaUrl} autoPlay loop muted className="preview-media" />
                    ) : (
                      <img src={previewContent.mediaUrl} alt="Live Preview" className="preview-media" />
                    )}
                 </motion.div>
               </AnimatePresence>
            )}
            
            <div className="badge-overlay">
               <span className={`status-indicator ${getQualityColor(meta?.appliedQuality)}`} 
                     style={{background: 'currentColor', boxShadow: '0 0 10px currentColor'}}></span>
               {meta?.appliedQuality} Signal Input
            </div>
         </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
