import { useState, useEffect } from 'react';
import api from '../services/api';
import useDeviceType from '../hooks/useDeviceType';
import useNetworkSpeed from '../hooks/useNetworkSpeed';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DownloadCloud, Layers, HardDrive, Zap, Rss, AlertTriangle, MonitorPlay, Image as ImageIcon } from 'lucide-react';

const ContentPage = () => {
  const device = useDeviceType(); 
  const network = useNetworkSpeed(); 
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Derive recommended quality
  const getRecommendedQuality = () => {
    if (network === 'slow') return 'low';
    if (network === 'medium') return 'medium';
    if (network === 'fast' && device !== 'mobile') return 'high';
    if (network === 'fast' && device === 'mobile') return 'medium';
    return 'medium';
  };

  const recQuality = getRecommendedQuality();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/content/adaptive', { params: { device, network } });
        let data = response.data?.data || [];
        if (data.length === 0) {
            data = [
                { _id: 'v1', type: 'video', title: 'Cyberpunk Metropolis Flyby', description: 'Volumetric rendering of sector 7G.' },
                { _id: 'i1', type: 'image', title: 'Quantum Core', description: 'Raw feed from the primary fusion chamber.' }
            ];
        }
        setContent(data);
      } catch (error) {
        toast.error('Network interference detected.');
        setContent([
            { _id: 'v1', type: 'video', title: 'Neural Handshake', description: 'Encrypted transfer sequence visualizer.' },
            { _id: 'i1', type: 'image', title: 'Grid Access Protocol', description: 'Mainframe bypass visualization.' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [device, network]);

  const handleDownload = async (quality, title, type) => {
    const ext = type === 'video' ? 'mp4' : 'webp';
    const folder = type === 'video' ? 'videos' : 'images';
    const url = `http://localhost:5000/media/${folder}/${quality}.${ext}`;
    
    const toastId = toast.loading(`Downloading ${quality.toUpperCase()} quality...`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Asset offline');
      }
      
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `${title}-${quality}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
      
      try {
        await api.post('/analytics/download', { type, quality });
      } catch (err) {
        console.warn('Telemetry offline', err);
      }

      toast.success(`${quality.toUpperCase()} format secured!`, { id: toastId });
    } catch (error) {
       toast.error(`Download Failed: Asset offline or corrupted`, { id: toastId, icon: <AlertTriangle color="var(--accent-red)"/> });
    }
  };

  const getMediaUrl = (type, quality) => {
    const ext = type === 'video' ? 'mp4' : 'webp';
    const folder = type === 'video' ? 'videos' : 'images';
    return `http://localhost:5000/media/${folder}/${quality}.${ext}`;
  };

  const fileSizes = {
    low: '~300KB',
    medium: '~800KB',
    high: '~2MB'
  };

  if (loading && !content.length) return <Spinner />;

  return (
    <>
      <header className="page-header" style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.2)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
           <div>
             <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', textShadow: '0 0 15px rgba(139, 92, 246, 0.6)' }}>
               <Layers color="var(--accent-purple)"/> ASSET DATABANK
             </h2>
             <p className="text-muted" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
               Neural content nodes. Adaptive delivery engaged.
             </p>
           </div>
           
           <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Rss size={16} color="var(--accent-green)"/> 
               <span style={{ color: 'var(--accent-green)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem' }}>NET: {network}</span>
             </div>
             <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Zap size={16} color="var(--accent-blue)"/> 
               <span style={{ color: 'var(--accent-blue)', textTransform: 'uppercase', fontWeight: 600, fontSize: '0.85rem' }}>SYS: {device}</span>
             </div>
           </div>
         </div>
      </header>

      <div className="content-grid layout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        {content.map((item, idx) => (
          <motion.div 
            key={item._id || idx} 
            className="glass-panel"
            style={{ 
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}
            initial={{opacity: 0, scale: 0.95, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            transition={{delay: idx * 0.1, duration: 0.4}}
          >
             <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#050505', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
               {item.type === 'image' ? (
                 <img 
                   src={getMediaUrl(item.type, recQuality)} 
                   alt={item.title} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   onError={e => {
                     e.target.src='https://via.placeholder.com/800x450/1a1a24/ef4444?text=SIGNAL+LOST';
                     e.target.style.opacity = 0.5;
                   }} 
                 />
               ) : (
                 <video 
                   src={getMediaUrl(item.type, recQuality)} 
                   style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   autoPlay loop muted controls 
                   playsInline
                   onError={e => {
                     e.target.poster='https://via.placeholder.com/800x450/1a1a24/ef4444?text=OFFLINE';
                   }} 
                 />
               )}
               
               <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.7)', padding: '0.4rem 0.8rem', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 {item.type === 'video' ? <MonitorPlay size={16} color="var(--accent-purple)"/> : <ImageIcon size={16} color="var(--accent-blue)"/>}
                 <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                   {item.type} Node
                 </span>
               </div>
               
               <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.8)', padding: '0.4rem 0.8rem', borderRadius: '8px', border: `1px solid var(--accent-blue)`, color: 'var(--accent-blue)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                  {recQuality.toUpperCase()} STREAM
               </div>
             </div>
             
             <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
               <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#fff' }}>{item.title}</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.5' }}>{item.description}</p>
               
               <div style={{ marginTop: 'auto' }}>
                 <h4 style={{ marginBottom: '1.5rem', color: 'white', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <HardDrive size={16} color="var(--accent-purple)"/> EXPORT OPTIONS
                 </h4>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {['low', 'medium', 'high'].map((q) => {
                     const isRecommended = q === recQuality;
                     const isLow = q === 'low';
                     const isMed = q === 'medium';
                     const color = isLow ? 'var(--accent-red)' : isMed ? 'var(--accent-yellow)' : 'var(--accent-green)';
                     
                     return (
                       <div key={q} style={{ 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'space-between', 
                         background: isRecommended ? `${color}15` : 'rgba(255,255,255,0.02)',
                         border: isRecommended ? `1px solid ${color}50` : '1px solid rgba(255,255,255,0.05)',
                         padding: '1rem 1.2rem',
                         borderRadius: '12px',
                         transition: 'all 0.3s ease'
                       }}>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                           <span style={{ fontWeight: 700, color: color, textTransform: 'uppercase', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             {q} Quality
                             {isRecommended && <span style={{ fontSize: '0.65rem', background: color, color: '#000', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>REC</span>}
                           </span>
                           <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{fileSizes[q]}</span>
                         </div>
                         <button 
                           className={`btn ${isRecommended ? 'btn-primary' : 'btn-outline'}`}
                           style={{ 
                             ...(isRecommended ? { background: color, color: '#000', boxShadow: `0 0 15px ${color}40`, border: 'none' } : {}),
                             padding: '0.5rem 1rem',
                             fontSize: '0.9rem'
                           }}
                           onClick={() => handleDownload(q, item.title, item.type)}
                         >
                           <DownloadCloud size={18}/> Extract
                         </button>
                       </div>
                     )
                   })}
                 </div>
               </div>
             </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default ContentPage;
