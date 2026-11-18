import React, { useState, useEffect, useRef } from 'react';
import {
  NearbySurplusItem,
  NearbyNeedItem,
  MapMarker,
  User,
} from '../types';
import {
  fetchNearbySurplus,
  fetchNearbyNeeds,
  fetchAllMarkers,
  updateUserProfile,
} from '../api';
import {
  MapPinIcon,
  SurplusIcon,
  NeedsIcon,
  RefreshIcon,
  CheckIcon,
} from '../components/Icons';
import { Language, translations } from '../i18n';

interface NearbyMapViewProps {
  currentUser: User | null;
  onSelectSurplus?: (item: NearbySurplusItem) => void;
  onSelectNeed?: (item: NearbyNeedItem) => void;
  language: Language;
}

export const NearbyMapView: React.FC<NearbyMapViewProps> = ({
  currentUser,
  onSelectSurplus,
  onSelectNeed,
  language,
}) => {
  const t = translations[language];

  // Default coordinate: Delhi NCR (28.6304, 77.2177) or user's saved coordinate
  const [userLat, setUserLat] = useState<number>(currentUser?.latitude || 28.6304);
  const [userLng, setUserLng] = useState<number>(currentUser?.longitude || 77.2177);
  const [locationName, setLocationName] = useState<string>(currentUser?.location || 'Connaught Place, New Delhi');

  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'surplus' | 'needs'>('surplus');

  // Data states
  const [nearbySurplus, setNearbySurplus] = useState<NearbySurplusItem[]>([]);
  const [nearbyNeeds, setNearbyNeeds] = useState<NearbyNeedItem[]>([]);
  const [allMarkers, setAllMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locStatus, setLocStatus] = useState<string>('');

  // Selected item highlight
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Map DOM reference and Leaflet map instance
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // 1. Browser Geolocation Trigger
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocStatus(t.locatingUser);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setUserLat(lat);
        setUserLng(lng);
        setLocationName(`Current GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
        setLocating(false);
        setLocStatus(t.locationDetected);

        // Update profile in backend if logged in
        if (currentUser?.id) {
          try {
            await updateUserProfile({ latitude: lat, longitude: lng });
          } catch (e) {
            console.error('Failed to save preferred location', e);
          }
        }
      },
      (err) => {
        setLocating(false);
        setLocStatus(t.locationDenied);
        alert(t.locationDenied);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 2. Fetch Nearby Data
  const loadNearbyData = async () => {
    setLoading(true);
    try {
      const [surplusRes, needsRes, markersRes] = await Promise.allSettled([
        fetchNearbySurplus({ lat: userLat, lng: userLng, radius_km: radiusKm, category: selectedCategory }),
        fetchNearbyNeeds({ lat: userLat, lng: userLng, radius_km: radiusKm, category: selectedCategory }),
        fetchAllMarkers({ user_lat: userLat, user_lng: userLng }),
      ]);

      if (surplusRes.status === 'fulfilled') setNearbySurplus(surplusRes.value.data);
      if (needsRes.status === 'fulfilled') setNearbyNeeds(needsRes.value.data);
      if (markersRes.status === 'fulfilled') setAllMarkers(markersRes.value.data);
    } catch (err) {
      console.error('Error fetching nearby geodata', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyData();
  }, [userLat, userLng, radiusKm, selectedCategory]);

  // 3. Initialize & Update Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return; // Leaflet script loading fallback

    // Create map instance if not exists
    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current).setView([userLat, userLng], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      leafletMapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    } else {
      leafletMapRef.current.setView([userLat, userLng]);
    }

    // Refresh markers on layer
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      // Add user location pulsing circle
      const userMarker = L.circleMarker([userLat, userLng], {
        radius: 9,
        fillColor: '#2563eb',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).bindPopup(`<b>📍 Your Location</b><br/>${locationName}`);
      markersLayerRef.current.addLayer(userMarker);

      // Add radius circle
      const radiusCircle = L.circle([userLat, userLng], {
        radius: radiusKm * 1000,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.06,
        weight: 1.5,
      });
      markersLayerRef.current.addLayer(radiusCircle);

      // Add markers from allMarkers
      allMarkers.forEach((m) => {
        const isSurplus = m.type === 'surplus';
        const color = isSurplus ? '#059669' : '#0284c7';

        const marker = L.circleMarker([m.latitude, m.longitude], {
          radius: 8,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        });

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
            <b style="color: ${color};">${isSurplus ? '📦 Food Donor' : '🤝 Recipient NGO'}</b><br/>
            <strong>${m.title}</strong><br/>
            Category: ${m.category}<br/>
            Quantity: <b>${m.quantity} ${m.unit}</b><br/>
            Location: ${m.location}<br/>
            ${m.distance_km ? `Distance: <b>${m.distance_km} km away</b>` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        markersLayerRef.current.addLayer(marker);
      });
    }
  }, [userLat, userLng, radiusKm, allMarkers, locationName]);

  // Pan to marker when clicking item from the list
  const handleFocusItem = (itemLat: number, itemLng: number, itemId: number) => {
    setSelectedItemId(itemId);
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([itemLat, itemLng], 14, { animate: true });
    }
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Cooked Meals', 'Bakery'];

  return (
    <div className="view-content-wrapper">
      {/* 1. Header */}
      <div className="view-header-row">
        <div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-6 h-6 text-emerald-600" />
            <h2 className="view-title">{t.nearbyFoodTitle}</h2>
          </div>
          <p className="view-subtitle">{t.nearbyFoodSubtitle}</p>
        </div>

        {/* GPS Location Button */}
        <button
          onClick={handleUseMyLocation}
          disabled={locating}
          className="btn btn-primary flex items-center gap-2 shadow-md"
        >
          <MapPinIcon className={`w-4 h-4 ${locating ? 'animate-bounce' : ''}`} />
          <span>{locating ? t.locatingUser : t.useMyLocation}</span>
        </button>
      </div>

      {locStatus && (
        <div className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
          📍 {locStatus}
        </div>
      )}

      {/* 2. Controls & Radius Bar */}
      <div className="nearby-controls-card">
        {/* Distance Radius Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            {t.distanceRadius}:
          </span>
          {[2, 5, 10, 25, 50].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`distance-pill ${radiusKm === r ? 'active' : ''}`}
            >
              {r} km
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select text-xs py-1.5"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Main Map & List Grid */}
      <div className="nearby-layout-grid">
        {/* Left Side: Interactive Leaflet Map */}
        <div className="nearby-map-container">
          <div ref={mapContainerRef} className="leaflet-map-element" />

          {/* Map Legend Overlay */}
          <div className="map-legend-overlay">
            <div className="legend-item">
              <span className="legend-dot bg-blue-600" />
              <span>You</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot bg-emerald-600" />
              <span>Surplus Donors ({allMarkers.filter(m => m.type === 'surplus').length})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot bg-cyan-600" />
              <span>Recipient NGOs ({allMarkers.filter(m => m.type === 'need').length})</span>
            </div>
          </div>
        </div>

        {/* Right Side: Synchronized List View */}
        <div className="nearby-list-container">
          {/* List Sub-tab Switcher */}
          <div className="nearby-list-tabs">
            <button
              onClick={() => setActiveTab('surplus')}
              className={`nearby-tab-btn ${activeTab === 'surplus' ? 'active' : ''}`}
            >
              <SurplusIcon className="w-4 h-4" />
              <span>Nearby Surplus ({nearbySurplus.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('needs')}
              className={`nearby-tab-btn ${activeTab === 'needs' ? 'active' : ''}`}
            >
              <NeedsIcon className="w-4 h-4" />
              <span>Nearby Needs ({nearbyNeeds.length})</span>
            </button>
          </div>

          <div className="nearby-items-scroll">
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-sm">{t.loading}</div>
            ) : activeTab === 'surplus' ? (
              nearbySurplus.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No surplus offers within {radiusKm} km. Try expanding the search radius.
                </div>
              ) : (
                nearbySurplus.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleFocusItem(item.latitude, item.longitude, item.id)}
                    className={`nearby-item-card ${selectedItemId === item.id ? 'selected' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900 text-sm">{item.donor}</span>
                      <span className="distance-badge">{item.distance_km} {t.kmAway}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                      <span className="category-pill">{item.food_category}</span>
                      <span className="font-bold text-emerald-800">{item.quantity} {item.unit}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">📍 {item.pickup_location}</p>
                  </div>
                ))
              )
            ) : (
              nearbyNeeds.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No recipient NGO requests within {radiusKm} km.
                </div>
              ) : (
                nearbyNeeds.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleFocusItem(item.latitude, item.longitude, item.id)}
                    className={`nearby-item-card ${selectedItemId === item.id ? 'selected' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900 text-sm">{item.recipient_org}</span>
                      <span className="distance-badge need-badge">{item.distance_km} {t.kmAway}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                      <span className="category-pill">{item.food_category}</span>
                      <span className="font-bold text-cyan-800">{item.quantity} {item.unit}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">📍 {item.delivery_location}</p>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
