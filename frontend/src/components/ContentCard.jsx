import { useState, useEffect } from 'react';

const ContentCard = ({ item, layoutClass, quality }) => {
  const [loading, setLoading] = useState(true);

  // When mediaUrl changes, simulate a loading state or reset image load state
  useEffect(() => {
    setLoading(true);
  }, [item.mediaUrl]);

  return (
    <div className={`content-card ${layoutClass}`}>
      <div className="media-container">
        {loading && <div className="skeleton-loader"></div>}
        {item.type === 'image' && (
          <img
            src={item.mediaUrl}
            alt={item.title}
            className={`media-element ${loading ? 'hidden' : ''}`}
            onLoad={() => setLoading(false)}
          />
        )}
        {item.type === 'video' && (
          <video
            src={item.mediaUrl}
            className={`media-element ${loading ? 'hidden' : ''}`}
            onLoadedData={() => setLoading(false)}
            autoPlay
            loop
            muted
          />
        )}
      </div>
      <div className="content-info">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <span className={`quality-badge ${quality}`}>{quality} Quality</span>
      </div>
    </div>
  );
};

export default ContentCard;
