import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Star, Search, Loader2, AlertCircle, X, ChevronLeft } from 'lucide-react';
import { Utensils, GraduationCap, Trees, Cross, Bus, ShoppingCart, Dumbbell } from 'lucide-react';

const categories = [
  { id: 'dining',     label: 'Dining',     icon: 'Utensils'      },
  { id: 'education',  label: 'Education',  icon: 'GraduationCap' },
  { id: 'nature',     label: 'Nature',     icon: 'Trees'         },
  { id: 'health',     label: 'Health',     icon: 'Cross'         },
  { id: 'transport',  label: 'Transport',  icon: 'Bus'           },
  { id: 'shop',       label: 'Shop',       icon: 'ShoppingCart'  },
  { id: 'gym',        label: 'Gym',        icon: 'Dumbbell'      }
];

const IconMap = { Utensils, GraduationCap, Trees, Cross, Bus, ShoppingCart, Dumbbell };

const BACKEND_URL = 'https://interior-backend-production.up.railway.app';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAfDoI98BjfukXxFsnXB8qQJPK_0Bi7ntI';
const APARTMENT_COORDINATES = { lat: 25.0694755, lng: 55.1468862, name: 'VERDE BY SOBHA' };
const SEARCH_RADIUS = 5000;

const searchVirtualTour = async (location, category, radius = SEARCH_RADIUS, isCustomSearch = false) => {
  const response = await fetch(`${BACKEND_URL}/api/virtual-tour/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location: location || `${APARTMENT_COORDINATES.lat},${APARTMENT_COORDINATES.lng}`, category, radius, is_custom_search: isCustomSearch })
  });
  if (!response.ok) { const e = await response.json(); throw new Error(e.error || 'Search failed'); }
  return await response.json();
};

const getDirections = async (origin, destination, mode = 'driving') => {
  const response = await fetch(`${BACKEND_URL}/api/virtual-tour/directions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, mode })
  });
  if (!response.ok) throw new Error('Directions fetch failed');
  return await response.json();
};

// ─── CHANGE 1: Accept initialCategory prop (defaults to 'dining') ─────────────
const VirtualTour = ({ onBack, isEmbedded = false, initialPlace = null, initialMode = 'map', initialCategory = 'dining' }) => {
  const [searchLocation, setSearchLocation] = useState('');
  // ─── CHANGE 2: Use initialCategory as the starting selected category ─────────
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCustomSearch, setIsCustomSearch] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewPlace, setStreetViewPlace] = useState(null);
  // track if we've handled the initial prop so it only fires once
  const initialHandled = useRef(false);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const streetViewRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true; script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else { setMapLoaded(true); }
  }, []);

  // ─── CHANGE 3: autoLoadApartment now uses initialCategory instead of hardcoded 'dining' ───
  useEffect(() => { if (mapLoaded) autoLoadApartment(); }, [mapLoaded]);

  // Once map is loaded + places are set, if we have an initialPlace open it
  useEffect(() => {
    if (!mapLoaded || initialHandled.current || !initialPlace) return;
    if (places.length === 0) return; // wait for places to load first
    initialHandled.current = true;
    setSelectedPlace(initialPlace);
    if (initialMode === 'streetview') {
      setShowStreetView(true);
      setStreetViewPlace(initialPlace);
      setShowMap(false);
    } else {
      setShowStreetView(false);
      handlePlaceClick(initialPlace);
    }
  }, [mapLoaded, places, initialPlace, initialMode]);

  useEffect(() => {
    if (showMap && !showStreetView && origin && places.length > 0 && mapLoaded && mapRef.current) {
      const t = setTimeout(() => initializeMap(), 100);
      return () => clearTimeout(t);
    }
  }, [showMap, origin, places, mapLoaded, showStreetView]);

  useEffect(() => {
    if (showStreetView && streetViewPlace && mapLoaded && mapRef.current) {
      const t = setTimeout(() => initializeStreetView(streetViewPlace), 100);
      return () => clearTimeout(t);
    }
  }, [showStreetView, streetViewPlace, mapLoaded]);

  useEffect(() => { if (directions && googleMapRef.current && window.google) displayDirections(); }, [directions]);

  const autoLoadApartment = async () => {
    setLoading(true); setError('');
    const apOrigin = { lat: APARTMENT_COORDINATES.lat, lng: APARTMENT_COORDINATES.lng, name: APARTMENT_COORDINATES.name };
    setOrigin(apOrigin);
    try {
      // ─── CHANGE 4: Use initialCategory to load the correct section on open ───
      const cat = initialCategory;
      const result = await searchVirtualTour(`${APARTMENT_COORDINATES.lat},${APARTMENT_COORDINATES.lng}`, cat, SEARCH_RADIUS, false);
      if (!result.success) throw new Error(result.error || 'Search failed');
      let loadedPlaces = result.places || [];
      // If initialPlace not in list, prepend it so it's always visible
      if (initialPlace && !loadedPlaces.find(p => p.id === initialPlace.id)) {
        loadedPlaces = [initialPlace, ...loadedPlaces];
      }
      if (loadedPlaces.length === 0) { setError('No places found within 5km.'); setShowMap(true); }
      else { setPlaces(loadedPlaces); setShowMap(true); }
    } catch (err) { setError(err.message || 'Failed to load.'); setShowMap(true); }
    setLoading(false);
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;
    try {
      const centerCoords = (initialPlace && !initialHandled.current === false)
        ? { lat: initialPlace.coordinates.lat, lng: initialPlace.coordinates.lng }
        : { lat: origin.lat, lng: origin.lng };

      const map = new window.google.maps.Map(mapRef.current, {
        center: centerCoords,
        zoom: places.length === 1 ? 15 : places.length <= 5 ? 13 : 12,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
      });
      googleMapRef.current = map;
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      const originMarker = new window.google.maps.Marker({ position: { lat: origin.lat, lng: origin.lng }, map, title: origin.name, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#10b981', fillOpacity: 1, strokeColor: 'white', strokeWeight: 3 } });
      markersRef.current.push(originMarker);
      places.forEach((place, index) => {
        const marker = new window.google.maps.Marker({ position: { lat: place.coordinates.lat, lng: place.coordinates.lng }, map, title: place.name, label: isCustomSearch ? undefined : { text: `${index + 1}`, color: 'white', fontSize: '12px', fontWeight: 'bold' }, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: isCustomSearch ? 18 : 15, fillColor: isCustomSearch ? '#ef4444' : '#3b82f6', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 } });
        marker.addListener('click', () => handlePlaceClick(place));
        markersRef.current.push(marker);
      });
      setTimeout(() => {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: origin.lat, lng: origin.lng });
        places.forEach(p => bounds.extend({ lat: p.coordinates.lat, lng: p.coordinates.lng }));
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }, 300);
    } catch (e) { console.error('Map init error:', e); }
  };

  const initializeStreetView = (place) => {
    if (!window.google || !mapRef.current) return;
    try {
      const streetViewService = new window.google.maps.StreetViewService();
      const location = { lat: place.coordinates.lat, lng: place.coordinates.lng };
      streetViewService.getPanorama({ location, radius: 50 }, (data, status) => {
        if (status === 'OK') {
          const panorama = new window.google.maps.StreetViewPanorama(mapRef.current, {
            position: location, pov: { heading: 165, pitch: 0 }, zoom: 1,
            addressControl: true, enableCloseButton: false, fullscreenControl: true,
          });
          streetViewRef.current = panorama;
        } else {
          alert('Street View is not available at this location.');
          setShowStreetView(false);
          setShowMap(true);
        }
      });
    } catch (e) { console.error('Street View error:', e); setShowStreetView(false); }
  };

  const displayDirections = () => {
    if (!googleMapRef.current || !window.google || !selectedPlace) return;
    if (directionsRendererRef.current) directionsRendererRef.current.setMap(null);
    const renderer = new window.google.maps.DirectionsRenderer({ map: googleMapRef.current, suppressMarkers: true, polylineOptions: { strokeColor: '#9333ea', strokeWeight: 4 } });
    directionsRendererRef.current = renderer;
    const svc = new window.google.maps.DirectionsService();
    svc.route({ origin: { lat: origin.lat, lng: origin.lng }, destination: { lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng }, travelMode: window.google.maps.TravelMode.DRIVING }, (result, status) => { if (status === 'OK') renderer.setDirections(result); });
  };

  const searchNearbyPlaces = async () => {
    if (!searchLocation.trim()) { setError('Please enter a location'); return; }
    setLoading(true); setError(''); setSelectedPlace(null); setDirections(null); setIsCustomSearch(true); setShowStreetView(false);
    try {
      const result = await searchVirtualTour(searchLocation, selectedCategory, SEARCH_RADIUS, true);
      if (!result.success) throw new Error(result.error || 'Search failed');
      if (!result.places || result.places.length === 0) { setError(`No ${selectedCategory} places found.`); setShowMap(false); }
      else { setPlaces(result.places); setOrigin({ lat: APARTMENT_COORDINATES.lat, lng: APARTMENT_COORDINATES.lng, name: APARTMENT_COORDINATES.name }); setShowMap(true); }
    } catch (err) { setError(err.message || 'Failed to search.'); setShowMap(false); }
    setLoading(false);
  };

  const handlePlaceClick = async (place) => {
    setSelectedPlace(place);
    setShowStreetView(false);
    if (origin) {
      try {
        const result = await getDirections(`${origin.lat},${origin.lng}`, `${place.coordinates.lat},${place.coordinates.lng}`, 'driving');
        if (result.success) setDirections(result.directions);
      } catch { setDirections({ distance: { text: `${place.distance} km` }, duration: { text: `${Math.floor(place.distance * 3)} mins` } }); }
    }
  };

  const handleStreetViewClick = (place) => {
    setStreetViewPlace(place);
    setShowStreetView(true);
    setShowMap(false);
  };

  const handleBackToMap = () => {
    setShowStreetView(false);
    setStreetViewPlace(null);
    setShowMap(true);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId); setSelectedPlace(null); setDirections(null); setSearchLocation(''); setIsCustomSearch(false); setShowStreetView(false);
    setOrigin({ lat: APARTMENT_COORDINATES.lat, lng: APARTMENT_COORDINATES.lng, name: APARTMENT_COORDINATES.name });
    setLoading(true); setError('');
    searchVirtualTour(`${APARTMENT_COORDINATES.lat},${APARTMENT_COORDINATES.lng}`, categoryId, SEARCH_RADIUS, false)
      .then(result => {
        if (result.success && result.places?.length > 0) { setPlaces(result.places); setShowMap(true); }
        else { setError(`No ${categoryId} places found`); setPlaces([]); }
        setLoading(false);
      })
      .catch(err => { setError(err.message || 'Failed'); setLoading(false); });
  };

  const getCategoryIcon = (iconName) => { const I = IconMap[iconName]; return I ? <I size={16} strokeWidth={2} /> : null; };

  return (
    <div style={{ width: '100%', height: '100%', background: '#eaecef', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* HEADER */}
      <div style={{ padding: '0.75rem 1.5rem', background: '#eaecef', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700', margin: 0, color: '#1f2937' }}>Virtual Tour</h1>
        <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} color="#6b7280" />
        </button>
      </div>

      {/* CATEGORIES + SEARCH */}
      <div style={{ padding: '0.5rem 1.5rem 0.75rem', background: '#eaecef', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} disabled={loading}
              style={{ padding: '0.45rem 0.9rem', borderRadius: '20px', border: 'none', background: selectedCategory === cat.id ? '#3b82f6' : '#f3f4f6', color: selectedCategory === cat.id ? 'white' : '#374151', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '500', opacity: loading ? 0.6 : 1 }}>
              {getCategoryIcon(cat.icon)}<span>{cat.label}</span>
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
          </div>
          <input type="text" placeholder="Search location" value={searchLocation}
            onChange={(e) => { setSearchLocation(e.target.value); setError(''); }}
            onKeyPress={(e) => { if (e.key === 'Enter' && !loading) { e.preventDefault(); searchNearbyPlaces(); } }}
            disabled={loading}
            style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.25rem', fontSize: '0.85rem', border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb', borderRadius: '10px', outline: 'none', background: 'white', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      {error && <div style={{ margin: '0 1.5rem 0.5rem', padding: '0.65rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={15} />{error}</div>}

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#eaecef', gap: '0.75rem', padding: '0 1rem 1rem' }}>
        {(showMap || showStreetView) && places.length > 0 ? (
          <>
            {/* Places List */}
            <div style={{ width: '45%', background: 'white', borderRadius: '12px', overflowY: 'auto', padding: '0.75rem', flexShrink: 0 }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', margin: '0 0 0.65rem 0.25rem', color: '#1f2937' }}>{places.length} {selectedCategory} places found</h3>
              {places.map((place) => (
                <div key={place.id} onClick={() => handlePlaceClick(place)}
                  style={{ background: selectedPlace?.id === place.id ? '#f0fdf4' : 'white', border: selectedPlace?.id === place.id ? '2px solid #10b981' : '1px solid #e5e7eb', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.6rem', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

                  {/* Photo */}
                  {place.photo_url ? (
                    <img src={place.photo_url} alt={place.name} style={{ width: '75px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '75px', height: '75px', background: '#f3f4f6', borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getCategoryIcon(categories.find(c => c.id === selectedCategory)?.icon)}</div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: '0 0 0.45rem 0', color: '#1f2937' }}>{place.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', background: '#f3f4f6', borderRadius: '20px', fontSize: '0.75rem', color: '#374151', fontWeight: '500' }}>
                        <Navigation size={12} strokeWidth={2.5} /><span>~{place.distance}km</span>
                      </div>
                      {place.rating && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', background: '#fef3c7', borderRadius: '20px', fontSize: '0.75rem', color: '#92400e', fontWeight: '600' }}>
                          <Star size={12} fill="#fbbf24" color="#fbbf24" strokeWidth={0} /><span>{place.rating}</span>
                        </div>
                      )}
                    </div>
                    {place.address && <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0.35rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.address}</p>}
                  </div>

                  {/* Action icons */}
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '0.6rem', flexShrink: 0, alignItems: 'center' }}>
                    <button onClick={(e) => { e.stopPropagation(); handlePlaceClick(place); }}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                      title="View on map">
                      <MapPin size={24} color="#3b82f6" strokeWidth={2} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleStreetViewClick(place); }}
                      style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                      title="Street View">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#f97316" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="5" r="2" fill="#f97316"/>
                        <path d="M12 8c-1.5 0-3 .8-3.5 2L7 13h2l1-2v3l-2 5h2l1-3 1 3h2l-2-5v-3l1 2h2l-1.5-3C14 8.8 13.5 8 12 8z" fill="#f97316"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Map / Street View */}
            <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

              {/* Back to map button when in street view */}
              {showStreetView && (
                <button onClick={handleBackToMap}
                  style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: '#1f2937', zIndex: 10 }}>
                  <ChevronLeft size={16} /><span>Back to Map</span>
                </button>
              )}

              {/* Directions overlay */}
              {!showStreetView && selectedPlace && directions && (
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'white', padding: '0.75rem 1rem', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Navigation size={14} color="#10b981" /><span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>{directions.distance.text}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ fontSize: '0.85rem' }}>🕐</span><span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.85rem' }}>{directions.duration.text}</span></div>
                </div>
              )}
            </div>
          </>
        ) : loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#6b7280', background: 'white', borderRadius: '12px' }}>
            <Loader2 size={40} color="#10b981" style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: '500', margin: 0 }}>Loading nearby places...</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#6b7280', background: 'white', borderRadius: '12px' }}>
            <MapPin size={48} color="#d1d5db" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Loading your location...</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default VirtualTour;