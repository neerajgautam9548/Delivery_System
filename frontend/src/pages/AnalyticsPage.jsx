import { useState, useEffect } from 'react';
import useDeviceType from '../hooks/useDeviceType';
import useNetworkSpeed from '../hooks/useNetworkSpeed';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';
import { Database, Clock, TrendingDown } from 'lucide-react';

const AnalyticsPage = () => {
  const device = useDeviceType();
  const network = useNetworkSpeed();
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await api.get('/content/adaptive', { params: { device, network } });
        setMeta(response.data.meta);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, [device, network]);

  if (loading) return <Spinner />;

  // Simulated Analytics Data for Demo
  const dataSavedNum = meta?.appliedQuality === 'low' ? 68 : meta?.appliedQuality === 'medium' ? 35 : 0;
  const loadTimeRed = meta?.appliedQuality === 'low' ? 75 : meta?.appliedQuality === 'medium' ? 40 : 0;

  const areaData = [
    { time: '10:00', loadHigh: 4.2, loadAdaptive: meta?.appliedQuality==='high'?4.2:2.1 },
    { time: '10:05', loadHigh: 4.5, loadAdaptive: meta?.appliedQuality==='high'?4.5:1.8 },
    { time: '10:10', loadHigh: 3.8, loadAdaptive: meta?.appliedQuality==='high'?3.8:1.9 },
    { time: '10:15', loadHigh: 5.1, loadAdaptive: meta?.appliedQuality==='high'?5.1:2.0 },
    { time: '10:20', loadHigh: 4.8, loadAdaptive: meta?.appliedQuality==='high'?4.8:2.2 }
  ];

  const qualityFreq = [
    { name: 'Low', value: 45 },
    { name: 'Med', value: 30 },
    { name: 'High', value: 25 }
  ];
  
  const chartColor = meta?.appliedQuality === 'low' ? '#ef4444' : meta?.appliedQuality === 'medium' ? '#f59e0b' : '#10b981';

  return (
    <>
      <header className="page-header">
         <div>
            <h2>Optimization Telemetry</h2>
            <p className="text-muted">Real-time performance impact vs baseline high-fidelity</p>
         </div>
      </header>

      <div className="metrics-section">
          <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.1}} className="glass-panel metric-card">
              <div className="metric-icon-wrap" style={{color: 'var(--accent-blue)', borderColor: 'rgba(59, 130, 246, 0.4)'}}>
                  <Database size={32}/>
              </div>
              <div className="metric-info">
                  <h4>Bandwidth Preserved</h4>
                  <div className="value">{dataSavedNum}%</div>
              </div>
          </motion.div>

          <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.2}} className="glass-panel metric-card">
              <div className="metric-icon-wrap" style={{color: 'var(--accent-purple)', borderColor: 'rgba(139, 92, 246, 0.4)'}}>
                  <Clock size={32}/>
              </div>
              <div className="metric-info">
                  <h4>Load Time Reduction</h4>
                  <div className="value">{loadTimeRed}%</div>
              </div>
          </motion.div>

          <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.3}} className="glass-panel metric-card">
              <div className="metric-icon-wrap" style={{color: 'var(--accent-green)', borderColor: 'rgba(16, 185, 129, 0.4)'}}>
                  <TrendingDown size={32}/>
              </div>
              <div className="metric-info">
                  <h4>Ping Delta</h4>
                  <div className="value">-12ms</div>
              </div>
          </motion.div>
      </div>

      <div className="comparison-grid">
         <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}} className="glass-panel">
            <h3>Latency Comparison (Simulated vs High)</h3>
            <p className="text-muted" style={{fontSize: '0.8rem', marginBottom: '1rem'}}>Measured in seconds</p>
            <div className="chart-container">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={areaData}>
                   <defs>
                     <linearGradient id="colorAdaptive" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                       <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="time" stroke="#94a3b8" />
                   <YAxis stroke="#94a3b8" />
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                   <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid var(--glass-border)'}} />
                   <Legend />
                   <Area type="monotone" dataKey="loadHigh" name="High Fidelity (Baseline)" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" />
                   <Area type="monotone" dataKey="loadAdaptive" name="Adaptive Active" stroke={chartColor} fillOpacity={1} fill="url(#colorAdaptive)" />
                 </AreaChart>
               </ResponsiveContainer>
            </div>
         </motion.div>

         <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.5}} className="glass-panel">
            <h3>Recent Quality Distributions</h3>
            <p className="text-muted" style={{fontSize: '0.8rem', marginBottom: '1rem'}}>Percentage of delivered qualities</p>
            <div className="chart-container">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={qualityFreq}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="name" stroke="#94a3b8" />
                   <YAxis stroke="#94a3b8" />
                   <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid var(--glass-border)'}} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                   <Bar dataKey="value" name="Frequency %" fill="url(#colorHigh)" radius={[4, 4, 0, 0]}>
                     {
                       qualityFreq.map((entry, index) => {
                         const color = entry.name === 'Low' ? '#ef4444' : entry.name === 'Med' ? '#f59e0b' : '#10b981';
                         return <cell key={`cell-${index}`} fill={color} />;
                       })
                     }
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
         </motion.div>
      </div>
    </>
  );
};

export default AnalyticsPage;
