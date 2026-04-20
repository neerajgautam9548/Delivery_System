import { useState, useEffect } from 'react';
import api from '../services/api';
import useDeviceType from '../hooks/useDeviceType';
import useNetworkSpeed from '../hooks/useNetworkSpeed';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { DownloadCloud, Layers } from 'lucide-react';

const ContentPage = () => {
  const device = useDeviceType();
  const network = useNetworkSpeed();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/content/adaptive', { params: { device, network } });
        setContent(response.data.data);
      } catch (error) {
        toast.error('Error fetching gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [device, network]);

  const handleDownload = (qualityBtn, title, type) => {
    toast.success(`Allocating ${qualityBtn.toUpperCase()} bundle...`, { icon: '📦' });
    const ext = type === 'video' ? 'mp4' : 'webp';
    const url = `http://localhost:5000/media/${qualityBtn}.${ext}`;
    
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}-${qualityBtn}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${qualityBtn.toUpperCase()} format downloaded!`);
    }, 800); // simulate prep time
  };

  if (loading && !content.length) return <Spinner />;

  return (
    <>
      <header className="page-header">
         <div>
           <h2 style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
             <Layers color="var(--accent-blue)" /> Asset Library
           </h2>
           <p className="text-muted">Direct interface to raw media components.</p>
         </div>
      </header>

      <div className="content-grid layout-grid">
        {content.map((item, idx) => (
          <motion.div 
            key={item._id} 
            className="glass-panel compare-card"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: idx * 0.1}}
          >
             <div className="compare-media-wrap">
               {item.type === 'image' ? (
                 <img src={item.mediaUrl} alt={item.title} className="media-element" onError={e => {e.target.src='https://via.placeholder.com/800x450?text=Media+Missing'}} />
               ) : (
                 <video src={item.mediaUrl} className="media-element" autoPlay loop muted controls onError={e => {e.target.poster='https://via.placeholder.com/800x450?text=Video+Missing'}} />
               )}
               <div className="badge-overlay" style={{top: '1rem', right: '1rem'}}>
                  {item.quality.toUpperCase()} RENDER
               </div>
             </div>
             
             <div style={{flex: 1}}>
               <h3 style={{marginBottom: '0.25rem'}}>{item.title}</h3>
               <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '1.5rem'}}>{item.description}</p>
               
               <h4 style={{marginBottom: '1rem', color: '#cbd5e1'}}>Asset Extraction</h4>
               
               <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
                 <div className="dl-bar">
                    <span style={{fontWeight: 600, color: 'var(--accent-red)'}}>Low Fidelity</span>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDownload('low', item.title, item.type)}>
                      <DownloadCloud size={16}/> Extract
                    </button>
                 </div>
                 <div className="dl-bar">
                    <span style={{fontWeight: 600, color: 'var(--accent-yellow)'}}>Balanced Output</span>
                    <button className="btn btn-outline btn-sm" onClick={() => handleDownload('medium', item.title, item.type)}>
                      <DownloadCloud size={16}/> Extract
                    </button>
                 </div>
                 <div className="dl-bar">
                    <span style={{fontWeight: 600, color: 'var(--accent-green)'}}>Lossless Target (<span style={{color:'yellow'}}>HQ</span>)</span>
                    <button className="btn btn-outline btn-sm active" onClick={() => handleDownload('high', item.title, item.type)}>
                      <DownloadCloud size={16}/> Extract
                    </button>
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
