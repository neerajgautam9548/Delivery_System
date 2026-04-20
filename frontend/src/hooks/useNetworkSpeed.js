import { useState, useEffect } from 'react';

const useNetworkSpeed = () => {
  const [networkSpeed, setNetworkSpeed] = useState('fast');

  useEffect(() => {
    const updateConnectionStatus = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const type = connection.effectiveType;
        if (type === 'slow-2g' || type === '2g') setNetworkSpeed('slow');
        else if (type === '3g') setNetworkSpeed('medium');
        else setNetworkSpeed('fast'); // 4g
      } else {
        setNetworkSpeed('fast'); // fallback
      }
    };

    updateConnectionStatus();

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionStatus);
    }

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateConnectionStatus);
      }
    };
  }, []);

  return networkSpeed;
};

export default useNetworkSpeed;
