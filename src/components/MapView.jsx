import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapView({ hackathons = [], onSelectHackathon }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Initialize Leaflet Map centered on India (20.5937, 78.9629)
    const map = L.map(mapRef.current, {
      center: [21.5, 78.9629],
      zoom: 5,
      minZoom: 4,
      maxZoom: 16,
      scrollWheelZoom: true
    });

    mapInstance.current = map;

    // Add Dark Mode Map Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Invalidate size after DOM mount
    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize();
      }
    }, 250);

    // Track coordinate usage to offset overlapping pins in the same city
    const coordCounts = {};

    hackathons.forEach((item, index) => {
      let lat = item.lat || 12.9716;
      let lng = item.lng || 77.5946;

      // Handle Online events default location (centered on India)
      if (item.mode === 'Online' && (!item.city || item.city === 'Online')) {
        lat = 20.5937 + (index * 0.4 - 1.5);
        lng = 78.9629 + (index * 0.5 - 1.5);
      }

      const key = `${lat.toFixed(2)},${lng.toFixed(2)}`;
      if (coordCounts[key]) {
        coordCounts[key] += 1;
        lat += (coordCounts[key] * 0.08);
        lng += (coordCounts[key] * 0.08);
      } else {
        coordCounts[key] = 1;
      }

      // Custom Glowing Neon DivIcon
      const pinColor = item.mode === 'Online' ? '#00f0ff' : '#ff007f';
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            width: 34px;
            height: 34px;
            background: rgba(9, 13, 31, 0.9);
            border-radius: 50%;
            border: 2px solid ${pinColor};
            box-shadow: 0 0 12px ${pinColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ⚡
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      const regUrl = item.registrationUrl || item.sourceUrl;
      const popupContent = document.createElement('div');
      popupContent.style.padding = '0.5rem';
      popupContent.style.minWidth = '220px';
      popupContent.innerHTML = `
        <div style="font-size:0.7rem; color:${pinColor}; font-weight:800; text-transform:uppercase;">
          🇮🇳 ${item.city || 'India'} • ${item.mode}
        </div>
        <div style="font-weight:800; font-size:0.95rem; color:#ffffff; margin:4px 0; line-height:1.3;">
          ${item.title}
        </div>
        <div style="font-size:0.78rem; color:#a0aec0; margin-bottom:6px;">
          Organized by ${item.organizer}
        </div>
        <div style="font-weight:800; color:#00ff9d; margin-bottom: 0.65rem; font-size:0.88rem;">
          💰 Prize: ${item.prizePool}
        </div>
        <div style="display:flex; gap:0.4rem;">
          <button id="btn-details-${item.id}" style="
            flex:1;
            padding: 0.4rem;
            background: linear-gradient(135deg, #00f0ff, #7000ff);
            color: #050814;
            border: none;
            border-radius: 8px;
            font-weight: 800;
            font-size: 0.78rem;
            cursor: pointer;
          ">Details</button>
          ${regUrl && regUrl !== '#' ? `
            <a href="${regUrl}" target="_blank" rel="noopener noreferrer" style="
              flex:1;
              padding: 0.4rem;
              background: rgba(255, 0, 127, 0.2);
              border: 1px solid #ff007f;
              color: #ffffff;
              text-align: center;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 700;
              font-size: 0.78rem;
            ">Register ↗</a>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const detailsBtn = document.getElementById(`btn-details-${item.id}`);
        if (detailsBtn) {
          detailsBtn.onclick = () => onSelectHackathon(item);
        }
      });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [hackathons, onSelectHackathon]);

  return (
    <div 
      className="glass-panel"
      style={{
        height: 580,
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 0 25px rgba(0, 0, 0, 0.7)',
        position: 'relative'
      }}
    >
      <div ref={mapRef} style={{ height: '100%', width: '100%', background: '#090d1f' }} />
    </div>
  );
}
