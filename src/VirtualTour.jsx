
// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronLeft, MapPin, Navigation, Star, Search, Loader2, AlertCircle } from 'lucide-react';

// // ✅ FIX #1: Icons changed to use lucide-react icons (black/white by default)
// const categories = [
//   { id: 'dining', label: 'Dining', icon: 'Utensils' },
//   { id: 'education', label: 'Education', icon: 'GraduationCap' },
//   { id: 'nature', label: 'Nature', icon: 'Trees' },
//   { id: 'health', label: 'Health', icon: 'Cross' },
//   { id: 'transit', label: 'Transit', icon: 'Bus' },
//   { id: 'shop', label: 'Shop', icon: 'ShoppingCart' },
//   { id: 'gym', label: 'Gym', icon: 'Dumbbell' }
// ];

// // Import all icons dynamically
// import { 
//   Utensils, 
//   GraduationCap, 
//   Trees, 
//   Cross, 
//   Bus, 
//   ShoppingCart, 
//   Dumbbell 
// } from 'lucide-react';

// // Icon mapping
// const IconMap = {
//   Utensils,
//   GraduationCap,
//   Trees,
//   Cross,
//   Bus,
//   ShoppingCart,
//   Dumbbell
// };

// // ✅ Backend configuration
// const BACKEND_URL = 'http://localhost:5000';
// const GOOGLE_MAPS_API_KEY = 'AIzaSyAfDoI98BjfukXxFsnXB8qQJPK_0Bi7ntI';

// // ============================================================
// // API HELPER FUNCTIONS
// // ============================================================

// /**
//  * Search for nearby places using Flask backend
//  */
// const searchVirtualTour = async (location, category, radius = 10000) => {
//   try {
//     console.log('[API] Searching:', { location, category, radius });
    
//     const response = await fetch(`${BACKEND_URL}/api/virtual-tour/search`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         location,
//         category,
//         radius
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('[API] Error response:', errorData);
//       throw new Error(errorData.error || 'Search failed');
//     }

//     const data = await response.json();
//     console.log('[API] Success response:', data);
//     return data;
//   } catch (error) {
//     console.error('[API] Search error:', error);
//     throw error;
//   }
// };

// /**
//  * Get directions between two points
//  */
// const getDirections = async (origin, destination, mode = 'driving') => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/virtual-tour/directions`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         origin,
//         destination,
//         mode
//       })
//     });

//     if (!response.ok) {
//       throw new Error('Directions fetch failed');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Directions API error:', error);
//     throw error;
//   }
// };

// /**
//  * Get place details
//  */
// const getPlaceDetails = async (placeId) => {
//   try {
//     const response = await fetch(`${BACKEND_URL}/api/virtual-tour/place-details/${placeId}`);
    
//     if (!response.ok) {
//       throw new Error('Place details fetch failed');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Place details API error:', error);
//     throw error;
//   }
// };

// // ============================================================
// // MAIN COMPONENT
// // ============================================================

// const VirtualTour = ({ onBack }) => {
//   const [searchLocation, setSearchLocation] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('dining');
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [origin, setOrigin] = useState(null);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [directions, setDirections] = useState(null);
//   const [error, setError] = useState('');
//   const [showMap, setShowMap] = useState(false);
//   const [mapLoaded, setMapLoaded] = useState(false);
  
//   // Map references
//   const mapRef = useRef(null);
//   const googleMapRef = useRef(null);
//   const markersRef = useRef([]);
//   const directionsRendererRef = useRef(null);

//   // Load Google Maps script
//   useEffect(() => {
//     if (!window.google) {
//       const script = document.createElement('script');
//       script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//       script.async = true;
//       script.defer = true;
//       script.onload = () => setMapLoaded(true);
//       document.head.appendChild(script);
//     } else {
//       setMapLoaded(true);
//     }
//   }, []);

//   // Initialize map when data is ready
//   useEffect(() => {
//     if (showMap && origin && places.length > 0 && mapLoaded && mapRef.current) {
//       const timer = setTimeout(() => {
//         initializeMap();
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [showMap, origin, places, mapLoaded]);

//   // Update directions when place is selected
//   useEffect(() => {
//     if (directions && googleMapRef.current && window.google) {
//       displayDirections();
//     }
//   }, [directions]);

//   const initializeMap = () => {
//     if (!window.google || !mapRef.current) {
//       console.log('Map not ready');
//       return;
//     }

//     try {
//       const map = new window.google.maps.Map(mapRef.current, {
//         center: { lat: origin.lat, lng: origin.lng },
//         zoom: 13,
//         styles: [
//           {
//             featureType: 'poi',
//             elementType: 'labels',
//             stylers: [{ visibility: 'off' }]
//           }
//         ]
//       });

//       googleMapRef.current = map;

//       // Clear old markers
//       markersRef.current.forEach(marker => marker.setMap(null));
//       markersRef.current = [];

//       // Add origin marker (green)
//       const originMarker = new window.google.maps.Marker({
//         position: { lat: origin.lat, lng: origin.lng },
//         map: map,
//         title: 'Your Location',
//         icon: {
//           path: window.google.maps.SymbolPath.CIRCLE,
//           scale: 10,
//           fillColor: '#10b981',
//           fillOpacity: 1,
//           strokeColor: 'white',
//           strokeWeight: 3,
//         },
//       });
//       markersRef.current.push(originMarker);

//       // Add place markers
//       places.forEach((place, index) => {
//         const marker = new window.google.maps.Marker({
//           position: { lat: place.coordinates.lat, lng: place.coordinates.lng },
//           map: map,
//           title: place.name,
//           label: {
//             text: `${index + 1}`,
//             color: 'white',
//             fontSize: '12px',
//             fontWeight: 'bold',
//           },
//           icon: {
//             path: window.google.maps.SymbolPath.CIRCLE,
//             scale: 15,
//             fillColor: '#3b82f6',
//             fillOpacity: 1,
//             strokeColor: 'white',
//             strokeWeight: 2,
//           },
//         });

//         marker.addListener('click', () => {
//           handlePlaceClick(place);
//         });

//         markersRef.current.push(marker);
//       });

//       // Fit bounds
//       const bounds = new window.google.maps.LatLngBounds();
//       bounds.extend({ lat: origin.lat, lng: origin.lng });
//       places.forEach(place => {
//         bounds.extend({ lat: place.coordinates.lat, lng: place.coordinates.lng });
//       });
//       map.fitBounds(bounds);
//     } catch (error) {
//       console.error('Error initializing map:', error);
//     }
//   };

//   const displayDirections = () => {
//     if (!googleMapRef.current || !window.google || !selectedPlace) return;

//     if (directionsRendererRef.current) {
//       directionsRendererRef.current.setMap(null);
//     }

//     const directionsRenderer = new window.google.maps.DirectionsRenderer({
//       map: googleMapRef.current,
//       suppressMarkers: true,
//       polylineOptions: {
//         strokeColor: '#9333ea',
//         strokeWeight: 4,
//       },
//     });

//     directionsRendererRef.current = directionsRenderer;

//     const directionsService = new window.google.maps.DirectionsService();
//     directionsService.route(
//       {
//         origin: { lat: origin.lat, lng: origin.lng },
//         destination: { lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng },
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (result, status) => {
//         if (status === 'OK') {
//           directionsRenderer.setDirections(result);
//         }
//       }
//     );
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !loading) {
//       e.preventDefault();
//       searchNearbyPlaces();
//     }
//   };

//   const searchNearbyPlaces = async () => {
//     if (!searchLocation.trim()) {
//       setError('Please enter a location');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSelectedPlace(null);
//     setDirections(null);
    
//     try {
//       console.log('🔍 Searching for:', searchLocation, '| Category:', selectedCategory);
      
//       // ✅ FIX #3: Real API call to Flask backend with proper category
//       const result = await searchVirtualTour(searchLocation, selectedCategory, 10000);
      
//       console.log('📦 API Response:', result);
      
//       if (!result.success) {
//         throw new Error(result.error || 'Search failed');
//       }
      
//       if (!result.places || result.places.length === 0) {
//         setError(`No ${selectedCategory} places found nearby. Try a different location.`);
//         setLoading(false);
//         setShowMap(false);
//         return;
//       }
      
//       // ✅ Set real data from backend
//       console.log(`✅ Found ${result.places.length} ${selectedCategory} places`);
//       setPlaces(result.places);
//       setOrigin(result.origin);
//       setShowMap(true);
//       setLoading(false);
      
//     } catch (err) {
//       console.error('❌ Search error:', err);
//       setError(err.message || 'Failed to search. Please check your connection and try again.');
//       setLoading(false);
//       setShowMap(false);
//     }
//   };

//   const handlePlaceClick = async (place) => {
//     setSelectedPlace(place);
    
//     if (origin) {
//       try {
//         // Real API call for directions
//         const originStr = `${origin.lat},${origin.lng}`;
//         const destStr = `${place.coordinates.lat},${place.coordinates.lng}`;
        
//         const result = await getDirections(originStr, destStr, 'driving');
        
//         if (result.success) {
//           setDirections(result.directions);
//         }
//       } catch (err) {
//         console.error('Directions error:', err);
//         // Fallback to estimated directions
//         setDirections({
//           distance: { text: `${place.distance} km` },
//           duration: { text: `${Math.floor(place.distance * 3)} mins` }
//         });
//       }
//     }
//   };

//   // ✅ FIX #3: When category changes, auto-search if location exists
//   const handleCategoryChange = (categoryId) => {
//     console.log('📂 Category changed to:', categoryId);
//     setSelectedCategory(categoryId);
//     setSelectedPlace(null);
//     setDirections(null);
    
//     // If we already have a search location, automatically search with new category
//     if (searchLocation.trim()) {
//       console.log('🔄 Auto-searching with new category...');
//       // Small delay to update UI
//       setTimeout(() => {
//         searchNearbyPlaces();
//       }, 100);
//     }
//   };

//   // Get icon component
//   const getCategoryIcon = (iconName) => {
//     const IconComponent = IconMap[iconName];
//     return IconComponent ? <IconComponent size={16} strokeWidth={2} /> : null;
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 998,
//           animation: 'fadeIn 0.3s ease-out'
//         }}
//         onClick={onBack}
//       />

//       {/* Close Button */}
//       <button
//         onClick={onBack}
//         style={{
//           position: 'fixed',
//           top: '20px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           width: '48px',
//           height: '48px',
//           borderRadius: '50%',
//           border: 'none',
//           background: 'white',
//           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           cursor: 'pointer',
//           transition: 'all 0.2s',
//           zIndex: 1001
//         }}
//       >
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
//           <polyline points="6 9 12 15 18 9"></polyline>
//         </svg>
//       </button>

//       {/* Main Container */}
//       <div style={{
//         position: 'fixed',
//         top: '90px',
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'white',
//         borderTopLeftRadius: '24px',
//         borderTopRightRadius: '24px',
//         zIndex: 999,
//         animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
//         boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden'
//       }}>
        
//         {/* Header with Virtual Tour title */}
//         <div style={{
//           padding: '1rem 1.5rem',
//           borderBottom: '1px solid #e5e7eb',
//           background: 'white'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//             <ChevronLeft size={28} color="#1f2937" strokeWidth={2.5} />
//             <h1 style={{
//               fontSize: '1.75rem',
//               fontWeight: '700',
//               margin: 0,
//               color: '#1f2937'
//             }}>
//               Virtual Tour
//             </h1>
//           </div>
//         </div>

//         {/* Categories + Search Row */}
//         <div style={{
//           padding: '0.75rem 1.5rem',
//           borderBottom: '1px solid #e5e7eb',
//           background: '#f5f1e8',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           gap: '1rem'
//         }}>
//           {/* Categories - ✅ FIX #1: Black/white icons */}
//           <div style={{
//             display: 'flex',
//             gap: '0.5rem',
//             flexWrap: 'wrap'
//           }}>
//             {categories.map(cat => (
//               <button
//                 key={cat.id}
//                 onClick={() => handleCategoryChange(cat.id)}
//                 disabled={loading}
//                 style={{
//                   padding: '0.5rem 1rem',
//                   borderRadius: '20px',
//                   border: 'none',
//                   background: selectedCategory === cat.id 
//                     ? '#3b82f6'
//                     : '#f3f4f6',
//                   color: selectedCategory === cat.id ? 'white' : '#374151',
//                   cursor: loading ? 'not-allowed' : 'pointer',
//                   transition: 'all 0.2s',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.5rem',
//                   fontSize: '0.875rem',
//                   fontWeight: '500',
//                   opacity: loading ? 0.6 : 1
//                 }}
//               >
//                 {getCategoryIcon(cat.icon)}
//                 <span>{cat.label}</span>
//               </button>
//             ))}
//           </div>

//           {/* ✅ FIX #2: Search icon on LEFT side, black/white */}
//           <div style={{ 
//             position: 'relative',
//             width: '320px'
//           }}>
//             {/* Search Icon - LEFT SIDE */}
//             <div
//               style={{
//                 position: 'absolute',
//                 left: '12px',
//                 top: '50%',
//                 transform: 'translateY(-50%)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 pointerEvents: 'none',
//                 color: '#6b7280'
//               }}
//             >
//               {loading ? (
//                 <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
//               ) : (
//                 <Search size={18} />
//               )}
//             </div>
            
//             <input
//               type="text"
//               placeholder="Search location"
//               value={searchLocation}
//               onChange={(e) => {
//                 setSearchLocation(e.target.value);
//                 setError('');
//               }}
//               onKeyPress={handleKeyPress}
//               disabled={loading}
//               style={{
//                 width: '100%',
//                 padding: '0.6rem 1rem 0.6rem 2.75rem',
//                 fontSize: '0.875rem',
//                 border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb',
//                 borderRadius: '10px',
//                 outline: 'none',
//                 transition: 'all 0.2s',
//                 background: 'white'
//               }}
//               onFocus={(e) => {
//                 if (!error) e.target.style.borderColor = '#3b82f6';
//               }}
//               onBlur={(e) => {
//                 if (!error) e.target.style.borderColor = '#e5e7eb';
//               }}
//             />
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div style={{
//             margin: '0.5rem 1.5rem 0',
//             padding: '0.75rem 1rem',
//             background: '#fef2f2',
//             border: '1px solid #fecaca',
//             borderRadius: '8px',
//             color: '#dc2626',
//             fontSize: '0.875rem',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '0.5rem'
//           }}>
//             <AlertCircle size={16} />
//             {error}
//           </div>
//         )}

//         {/* Main Content: Places List + Map */}
//         <div style={{
//           flex: 1,
//           display: 'flex',
//           overflow: 'hidden',
//           background: '#f5f1e8'
//         }}>
            
//           {showMap && places.length > 0 ? (
//             <>
//               {/* Places List - 50% width */}
//               <div style={{
//                 width: '50%',
//                 background: '#f5f1e8',
//                 borderRight: '1px solid #e5e7eb',
//                 overflowY: 'auto',
//                 padding: '1rem'
//               }}>
//                 <h3 style={{
//                   fontSize: '0.95rem',
//                   fontWeight: '700',
//                   marginBottom: '0.75rem',
//                   color: '#1f2937',
//                   padding: '0 0.5rem'
//                 }}>
//                   {places.length} {selectedCategory} places found
//                 </h3>

//                 {places.map((place, index) => (
//                   <div
//                     key={place.id}
//                     style={{
//                       background: selectedPlace?.id === place.id ? '#f0fdf4' : 'white',
//                       border: selectedPlace?.id === place.id 
//                         ? '2px solid #10b981' 
//                         : '1px solid #e5e7eb',
//                       borderRadius: '12px',
//                       padding: '1rem',
//                       marginBottom: '0.75rem',
//                       cursor: 'pointer',
//                       transition: 'all 0.2s',
//                       display: 'flex',
//                       gap: '1rem',
//                       alignItems: 'flex-start'
//                     }}
//                     onClick={() => handlePlaceClick(place)}
//                   >
//                     {/* Photo - LEFT side */}
//                     {place.photo_url ? (
//                       <img
//                         src={place.photo_url}
//                         alt={place.name}
//                         style={{
//                           width: '100px',
//                           height: '100px',
//                           objectFit: 'cover',
//                           borderRadius: '10px',
//                           flexShrink: 0
//                         }}
//                       />
//                     ) : (
//                       <div style={{
//                         width: '100px',
//                         height: '100px',
//                         background: '#f3f4f6',
//                         borderRadius: '10px',
//                         flexShrink: 0,
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#9ca3af',
//                         fontSize: '2.5rem'
//                       }}>
//                         {getCategoryIcon(categories.find(c => c.id === selectedCategory)?.icon)}
//                       </div>
//                     )}
                    
//                     {/* Content in MIDDLE */}
//                     <div style={{ flex: 1, minWidth: 0, paddingTop: '0.25rem' }}>
//                       {/* Place Name */}
//                       <h4 style={{
//                         fontSize: '1.05rem',
//                         fontWeight: '600',
//                         margin: '0 0 0.75rem 0',
//                         color: '#1f2937',
//                         lineHeight: '1.3'
//                       }}>
//                         {place.name}
//                       </h4>

//                       {/* Three info pills - Distance, Walking Time, Rating */}
//                       <div style={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.5rem',
//                         flexWrap: 'wrap'
//                       }}>
//                         {/* Distance pill */}
//                         <div style={{
//                           display: 'inline-flex',
//                           alignItems: 'center',
//                           gap: '0.35rem',
//                           padding: '0.35rem 0.75rem',
//                           background: '#f3f4f6',
//                           borderRadius: '20px',
//                           fontSize: '0.8rem',
//                           color: '#374151',
//                           fontWeight: '500'
//                         }}>
//                           <Navigation size={13} strokeWidth={2.5} />
//                           <span>~{place.distance}km</span>
//                         </div>

//                         {/* Walking time pill */}
//                         <div style={{
//                           display: 'inline-flex',
//                           alignItems: 'center',
//                           gap: '0.35rem',
//                           padding: '0.35rem 0.75rem',
//                           background: '#f3f4f6',
//                           borderRadius: '20px',
//                           fontSize: '0.8rem',
//                           color: '#374151',
//                           fontWeight: '500'
//                         }}>
//                           <span style={{ fontSize: '0.9rem' }}>🚶</span>
//                           <span>~{Math.floor(place.distance * 12)}min</span>
//                         </div>

//                         {/* Rating pill */}
//                         {place.rating && (
//                           <div style={{
//                             display: 'inline-flex',
//                             alignItems: 'center',
//                             gap: '0.35rem',
//                             padding: '0.35rem 0.75rem',
//                             background: '#fef3c7',
//                             borderRadius: '20px',
//                             fontSize: '0.8rem',
//                             color: '#92400e',
//                             fontWeight: '600'
//                           }}>
//                             <Star size={13} fill="#fbbf24" color="#fbbf24" strokeWidth={0} />
//                             <span>{place.rating}</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Address - Optional, smaller text below */}
//                       {place.address && (
//                         <p style={{
//                           fontSize: '0.75rem',
//                           color: '#9ca3af',
//                           margin: '0.65rem 0 0 0',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap',
//                           lineHeight: '1.4'
//                         }}>
//                           {place.address}
//                         </p>
//                       )}
//                     </div>

//                     {/* Icons on RIGHT side - Map and Walking - HORIZONTAL - NO BACKGROUND */}
//                     <div style={{
//                       display: 'flex',
//                       flexDirection: 'row',
//                       gap: '0.75rem',
//                       flexShrink: 0,
//                       alignItems: 'flex-start',
//                       paddingTop: '2.0rem'
//                     }}>
//                       {/* Map/Directions icon - NO BACKGROUND */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePlaceClick(place);
//                         }}
//                         style={{
//                           width: '32px',
//                           height: '32px',
//                           border: 'none',
//                           background: 'transparent',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           transition: 'all 0.2s',
//                           padding: 0
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.opacity = '0.7';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.opacity = '1';
//                         }}
//                         title="View on map"
//                       >
//                         <MapPin size={28} color="#3b82f6" strokeWidth={2} />
//                       </button>
                      
//                       {/* Walking directions icon - NO BACKGROUND */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePlaceClick(place);
//                         }}
//                         style={{
//                           width: '32px',
//                           height: '32px',
//                           border: 'none',
//                           background: 'transparent',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                           transition: 'all 0.2s',
//                           padding: 0
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.opacity = '0.7';
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.opacity = '1';
//                         }}
//                         title="Walking directions"
//                       >
//                         <span style={{ fontSize: '1.75rem' }}>🚶</span>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Map - 50% width */}
//               <div style={{
//                 width: '50%',
//                 position: 'relative'
//               }}>
//                 <div 
//                   ref={mapRef}
//                   style={{
//                     width: '100%',
//                     height: '100%'
//                   }}
//                 />

//                 {selectedPlace && directions && (
//                   <div style={{
//                     position: 'absolute',
//                     top: '1.5rem',
//                     left: '1.5rem',
//                     background: 'white',
//                     padding: '1rem 1.25rem',
//                     borderRadius: '12px',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                     display: 'flex',
//                     gap: '1.5rem'
//                   }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                       <Navigation size={16} color="#10b981" />
//                       <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
//                         {directions.distance.text}
//                       </span>
//                     </div>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                       <span style={{ fontSize: '0.9rem' }}>🕐</span>
//                       <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
//                         {directions.duration.text}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : !loading && !showMap ? (
//             <div style={{
//               flex: 1,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               flexDirection: 'column',
//               color: '#6b7280',
//               background: '#fafafa'
//             }}>
//               <MapPin size={64} color="#d1d5db" style={{ marginBottom: '1rem' }} />
//               <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', margin: 0 }}>
//                 Search for a location
//               </p>
//               <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
//                 Enter an address and select a category to find nearby places
//               </p>
//             </div>
//           ) : null}
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes slideUp {
//           from { transform: translateY(100%); }
//           to { transform: translateY(0); }
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </>
//   );
// };

// export default VirtualTour;
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MapPin, Navigation, Star, Search, Loader2, AlertCircle } from 'lucide-react';

// ✅ FIX #1: Icons changed to use lucide-react icons (black/white by default)
const categories = [
  { id: 'dining', label: 'Dining', icon: 'Utensils' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'nature', label: 'Nature', icon: 'Trees' },
  { id: 'health', label: 'Health', icon: 'Cross' },
  { id: 'transit', label: 'Transport', icon: 'Bus' },  // ✅ FIXED: Changed 'Transport' to 'transit'
  { id: 'shop', label: 'Shop', icon: 'ShoppingCart' },
  { id: 'gym', label: 'Gym', icon: 'Dumbbell' }
];

// Import all icons dynamically
import { 
  Utensils, 
  GraduationCap, 
  Trees, 
  Cross, 
  Bus, 
  ShoppingCart, 
  Dumbbell 
} from 'lucide-react';

// Icon mapping
const IconMap = {
  Utensils,
  GraduationCap,
  Trees,
  Cross,
  Bus,
  ShoppingCart,
  Dumbbell
};

// ✅ Backend configuration
const BACKEND_URL = 'https://interior-backend-production.up.railway.app';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAfDoI98BjfukXxFsnXB8qQJPK_0Bi7ntI';

// ✅ APARTMENT CONFIGURATION - Edit these coordinates for your apartment
// HOW TO GET COORDINATES:
// Method 1: Google Maps → Search address → Right-click location → Click coordinates
// Method 2: Google Maps URL after searching (numbers like: @26.4499,80.3319)
// Method 3: Visit https://www.google.com/maps, search, right-click, copy coordinates
const APARTMENT_COORDINATES = {
  lat: 26.4499,  // Replace with your apartment latitude
  lng: 80.3319,  // Replace with your apartment longitude
  name: 'My Apartment'  // Optional: Your apartment name
};

// ✅ Search radius in meters (5km = 5000 meters)
const SEARCH_RADIUS = 5000;

// ============================================================
// API HELPER FUNCTIONS
// ============================================================

/**
 * Search for nearby places using Flask backend
 * Always uses APARTMENT_COORDINATES as origin
 */
const searchVirtualTour = async (location, category, radius = SEARCH_RADIUS) => {
  try {
    console.log('[API] Searching:', { location, category, radius });
    
    // ✅ Always use apartment coordinates as origin
    const apartmentLocation = `${APARTMENT_COORDINATES.lat},${APARTMENT_COORDINATES.lng}`;
    
    const response = await fetch(`${BACKEND_URL}/api/virtual-tour/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: apartmentLocation,  // Use apartment coordinates
        category,
        radius
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[API] Error response:', errorData);
      throw new Error(errorData.error || 'Search failed');
    }

    const data = await response.json();
    console.log('[API] Success response:', data);
    return data;
  } catch (error) {
    console.error('[API] Search error:', error);
    throw error;
  }
};

/**
 * Get directions between two points
 */
const getDirections = async (origin, destination, mode = 'driving') => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/virtual-tour/directions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin,
        destination,
        mode
      })
    });

    if (!response.ok) {
      throw new Error('Directions fetch failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Directions API error:', error);
    throw error;
  }
};

/**
 * Get place details
 */
const getPlaceDetails = async (placeId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/virtual-tour/place-details/${placeId}`);
    
    if (!response.ok) {
      throw new Error('Place details fetch failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Place details API error:', error);
    throw error;
  }
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const VirtualTour = ({ onBack }) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('dining');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [streetViewPlace, setStreetViewPlace] = useState(null);
  
  // Map references
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);
  const directionsRendererRef = useRef(null);
  const streetViewRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // ✅ FIX FOR ISSUE #1: AUTO-LOAD apartment location and dining places on mount
  useEffect(() => {
    if (mapLoaded) {
      console.log('🏠 Auto-loading apartment location and dining places...');
      autoLoadApartment();
    }
  }, [mapLoaded]);

  // Initialize map when data is ready
  useEffect(() => {
    if (showMap && origin && places.length > 0 && mapLoaded && mapRef.current) {
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showMap, origin, places, mapLoaded]);

  // Update directions when place is selected
  useEffect(() => {
    if (directions && googleMapRef.current && window.google) {
      displayDirections();
    }
  }, [directions]);

  // Initialize Street View when enabled
  useEffect(() => {
    if (showStreetView && streetViewPlace && mapLoaded && mapRef.current) {
      const timer = setTimeout(() => {
        initializeStreetView(streetViewPlace);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showStreetView, streetViewPlace, mapLoaded]);

  /**
   * ✅ NEW FUNCTION: Auto-load apartment and default category (dining)
   */
  const autoLoadApartment = async () => {
    setLoading(true);
    setError('');
    
    const apartmentLocation = `${APARTMENT_COORDINATES.lat},${APARTMENT_COORDINATES.lng}`;
    
    try {
      console.log('📍 Loading apartment:', APARTMENT_COORDINATES);
      console.log('🍽️ Loading dining places...');
      
      const result = await searchVirtualTour(apartmentLocation, 'dining', SEARCH_RADIUS);
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }
      
      if (!result.places || result.places.length === 0) {
        setError(`No dining places found within 5km of apartment. Try a different category.`);
        setLoading(false);
        setShowMap(true); // Still show map even if no places
        setOrigin(APARTMENT_COORDINATES);
        return;
      }
      
      console.log(`✅ Found ${result.places.length} dining places`);
      setPlaces(result.places);
      setOrigin(APARTMENT_COORDINATES);
      setShowMap(true);
      setLoading(false);
      
    } catch (err) {
      console.error('❌ Auto-load error:', err);
      setError(err.message || 'Failed to load. Please check your connection.');
      setLoading(false);
      // Still show map with apartment marker
      setShowMap(true);
      setOrigin(APARTMENT_COORDINATES);
    }
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) {
      console.log('Map not ready');
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: origin.lat, lng: origin.lng },
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      googleMapRef.current = map;

      // Clear old markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add origin marker (green)
      const originMarker = new window.google.maps.Marker({
        position: { lat: origin.lat, lng: origin.lng },
        map: map,
        title: 'Your Location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 3,
        },
      });
      markersRef.current.push(originMarker);

      // Add place markers
      places.forEach((place, index) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.coordinates.lat, lng: place.coordinates.lng },
          map: map,
          title: place.name,
          label: {
            text: `${index + 1}`,
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#3b82f6',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          },
        });

        marker.addListener('click', () => {
          handlePlaceClick(place);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: origin.lat, lng: origin.lng });
      places.forEach(place => {
        bounds.extend({ lat: place.coordinates.lat, lng: place.coordinates.lng });
      });
      map.fitBounds(bounds);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const displayDirections = () => {
    if (!googleMapRef.current || !window.google || !selectedPlace) return;

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
    }

    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: googleMapRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#9333ea',
        strokeWeight: 4,
      },
    });

    directionsRendererRef.current = directionsRenderer;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: selectedPlace.coordinates.lat, lng: selectedPlace.coordinates.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(result);
        }
      }
    );
  };

  const initializeStreetView = (place) => {
    if (!window.google || !mapRef.current) {
      console.log('Street View not ready');
      return;
    }

    try {
      const streetViewService = new window.google.maps.StreetViewService();
      const location = { lat: place.coordinates.lat, lng: place.coordinates.lng };

      // Check if street view is available at this location
      streetViewService.getPanorama(
        { location, radius: 50 },
        (data, status) => {
          if (status === 'OK') {
            const panorama = new window.google.maps.StreetViewPanorama(
              mapRef.current,
              {
                position: location,
                pov: { heading: 165, pitch: 0 },
                zoom: 1,
                addressControl: true,
                enableCloseButton: false,
                fullscreenControl: true,
              }
            );
            streetViewRef.current = panorama;
          } else {
            console.error('Street View not available at this location');
            alert('Street View is not available at this location. Try another place.');
            setShowStreetView(false);
          }
        }
      );
    } catch (error) {
      console.error('Error initializing Street View:', error);
      setShowStreetView(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      searchNearbyPlaces();
    }
  };

  const searchNearbyPlaces = async () => {
    if (!searchLocation.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedPlace(null);
    setDirections(null);
    setShowStreetView(false);
    setStreetViewPlace(null);
    
    try {
      console.log('🔍 Searching for:', searchLocation, '| Category:', selectedCategory);
      console.log('🏠 From apartment:', APARTMENT_COORDINATES);
      
      // ✅ Real API call - always searches from apartment
      const result = await searchVirtualTour(searchLocation, selectedCategory, SEARCH_RADIUS);
      
      console.log('📦 API Response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }
      
      if (!result.places || result.places.length === 0) {
        setError(`No ${selectedCategory} places found within 5km of apartment. Try a different category.`);
        setLoading(false);
        setShowMap(false);
        return;
      }
      
      // ✅ Set apartment as origin (not user-entered location)
      console.log(`✅ Found ${result.places.length} ${selectedCategory} places within 5km`);
      setPlaces(result.places);
      setOrigin(APARTMENT_COORDINATES);  // Always use apartment coordinates
      setShowMap(true);
      setLoading(false);
      
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message || 'Failed to search. Please check your connection and try again.');
      setLoading(false);
      setShowMap(false);
    }
  };

  const handlePlaceClick = async (place) => {
    setSelectedPlace(place);
    
    if (origin) {
      try {
        // Real API call for directions
        const originStr = `${origin.lat},${origin.lng}`;
        const destStr = `${place.coordinates.lat},${place.coordinates.lng}`;
        
        const result = await getDirections(originStr, destStr, 'driving');
        
        if (result.success) {
          setDirections(result.directions);
        }
      } catch (err) {
        console.error('Directions error:', err);
        // Fallback to estimated directions
        setDirections({
          distance: { text: `${place.distance} km` },
          duration: { text: `${Math.floor(place.distance * 3)} mins` }
        });
      }
    }
  };

  const handleStreetViewClick = (place) => {
    console.log('🚶 Opening Street View for:', place.name);
    setStreetViewPlace(place);
    setShowStreetView(true);
    setShowMap(false);
  };

  const handleBackToMap = () => {
    console.log('🗺️ Back to Map view');
    setShowStreetView(false);
    setStreetViewPlace(null);
    setShowMap(true);
  };

  // ✅ FIX #2: When category changes, auto-search from apartment
  const handleCategoryChange = (categoryId) => {
    console.log('📂 Category changed to:', categoryId);
    setSelectedCategory(categoryId);
    setSelectedPlace(null);
    setDirections(null);
    
    // Auto-search new category from apartment
    setLoading(true);
    setError('');
    
    const apartmentLocation = `${APARTMENT_COORDINATES.lat},${APARTMENT_COORDINATES.lng}`;
    
    searchVirtualTour(apartmentLocation, categoryId, SEARCH_RADIUS)
      .then(result => {
        if (result.success && result.places && result.places.length > 0) {
          console.log(`✅ Loaded ${result.places.length} ${categoryId} places`);
          setPlaces(result.places);
          setOrigin(APARTMENT_COORDINATES);
          setShowMap(true);
        } else {
          setError(`No ${categoryId} places found within 5km`);
          setPlaces([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(`❌ Error loading ${categoryId}:`, err);
        setError(err.message || 'Failed to load places');
        setLoading(false);
      });
  };

  // Get icon component
  const getCategoryIcon = (iconName) => {
    const IconComponent = IconMap[iconName];
    return IconComponent ? <IconComponent size={16} strokeWidth={2} /> : null;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onBack}
      />

      {/* Close Button */}
      <button
        onClick={onBack}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1001
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {/* Main Container */}
      <div style={{
        position: 'fixed',
        top: '90px',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        zIndex: 999,
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header with Virtual Tour title */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          background: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ChevronLeft size={28} color="#1f2937" strokeWidth={2.5} />
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              margin: 0,
              color: '#1f2937'
            }}>
              Virtual Tour
            </h1>
          </div>
        </div>

        {/* Categories + Search Row */}
        <div style={{
          padding: '0.75rem 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          background: '#f5f1e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Categories - ✅ FIX #1: Black/white icons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedCategory === cat.id 
                    ? '#3b82f6'
                    : '#f3f4f6',
                  color: selectedCategory === cat.id ? 'white' : '#374151',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {getCategoryIcon(cat.icon)}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* ✅ FIX #2: Search icon on LEFT side, black/white */}
          <div style={{ 
            position: 'relative',
            width: '320px'
          }}>
            {/* Search Icon - LEFT SIDE */}
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                color: '#6b7280'
              }}
            >
              {loading ? (
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Search size={18} />
              )}
            </div>
            
            <input
              type="text"
              placeholder="Search location"
              value={searchLocation}
              onChange={(e) => {
                setSearchLocation(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.75rem',
                fontSize: '0.875rem',
                border: error ? '1.5px solid #ef4444' : '1.5px solid #e5e7eb',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#e5e7eb';
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            margin: '0.5rem 1.5rem 0',
            padding: '0.75rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Main Content: Places List + Map */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          background: '#f5f1e8'
        }}>
            
          {(showMap || showStreetView) && places.length > 0 ? (
            <>
              {/* Places List - 50% width */}
              <div style={{
                width: '50%',
                background: '#f5f1e8',
                borderRight: '1px solid #e5e7eb',
                overflowY: 'auto',
                padding: '1rem'
              }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  marginBottom: '0.75rem',
                  color: '#1f2937',
                  padding: '0 0.5rem'
                }}>
                  {places.length} {selectedCategory} places found
                </h3>

                {places.map((place, index) => (
                  <div
                    key={place.id}
                    style={{
                      background: selectedPlace?.id === place.id ? '#f0fdf4' : 'white',
                      border: selectedPlace?.id === place.id 
                        ? '2px solid #10b981' 
                        : '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start'
                    }}
                    onClick={() => handlePlaceClick(place)}
                  >
                    {/* Photo - LEFT side */}
                    {place.photo_url ? (
                      <img
                        src={place.photo_url}
                        alt={place.name}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '10px',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100px',
                        height: '100px',
                        background: '#f3f4f6',
                        borderRadius: '10px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '2.5rem'
                      }}>
                        {getCategoryIcon(categories.find(c => c.id === selectedCategory)?.icon)}
                      </div>
                    )}
                    
                    {/* Content in MIDDLE */}
                    <div style={{ flex: 1, minWidth: 0, paddingTop: '0.25rem' }}>
                      {/* Place Name */}
                      <h4 style={{
                        fontSize: '1.05rem',
                        fontWeight: '600',
                        margin: '0 0 0.75rem 0',
                        color: '#1f2937',
                        lineHeight: '1.3'
                      }}>
                        {place.name}
                      </h4>

                      {/* Three info pills - Distance, Walking Time, Rating */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}>
                        {/* Distance pill */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          background: '#f3f4f6',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          <Navigation size={13} strokeWidth={2.5} />
                          <span>~{place.distance}km</span>
                        </div>

                        {/* Walking time pill */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          background: '#f3f4f6',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          <span style={{ fontSize: '0.9rem' }}>🚶</span>
                          <span>~{Math.floor(place.distance * 12)}min</span>
                        </div>

                        {/* Rating pill */}
                        {place.rating && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            background: '#fef3c7',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            color: '#92400e',
                            fontWeight: '600'
                          }}>
                            <Star size={13} fill="#fbbf24" color="#fbbf24" strokeWidth={0} />
                            <span>{place.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Address - Optional, smaller text below */}
                      {place.address && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          margin: '0.65rem 0 0 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          lineHeight: '1.4'
                        }}>
                          {place.address}
                        </p>
                      )}
                    </div>

                    {/* Icons on RIGHT side - Map and Walking - HORIZONTAL - NO BACKGROUND */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '0.75rem',
                      flexShrink: 0,
                      alignItems: 'flex-start',
                      paddingTop: '2.0rem'
                    }}>
                      {/* Map/Directions icon - NO BACKGROUND */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaceClick(place);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        title="View on map"
                      >
                        <MapPin size={28} color="#3b82f6" strokeWidth={2} />
                      </button>
                      
                      {/* Walking directions icon - Opens Street View */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStreetViewClick(place);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: 'none',
                          background: 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '1';
                        }}
                        title="View Street View"
                      >
                        <span style={{ fontSize: '1.75rem' }}>🚶</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map or Street View - 50% width */}
              <div style={{
                width: '50%',
                position: 'relative'
              }}>
                <div 
                  ref={mapRef}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />

                {/* Back to Map Button - Shows when in Street View */}
                {showStreetView && (
                  <button
                    onClick={handleBackToMap}
                    style={{
                      position: 'absolute',
                      top: '1.5rem',
                      left: '1.5rem',
                      background: 'white',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      transition: 'all 0.2s',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <ChevronLeft size={18} />
                    <span>Back to Map</span>
                  </button>
                )}

                {/* Street View Info Banner */}
                {showStreetView && streetViewPlace && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'white',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    maxWidth: '300px',
                    zIndex: 10
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🚶</span>
                      <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '0.95rem' }}>
                        Street View
                      </span>
                    </div>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      color: '#6b7280', 
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {streetViewPlace.name}
                    </p>
                  </div>
                )}

                {/* Directions Info - Shows only in Map mode */}
                {!showStreetView && selectedPlace && directions && (
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    left: '1.5rem',
                    background: 'white',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    gap: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Navigation size={16} color="#10b981" />
                      <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
                        {directions.distance.text}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem' }}>🕐</span>
                      <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.9rem' }}>
                        {directions.duration.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : !loading && !showMap ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#6b7280',
              background: '#fafafa'
            }}>
              <MapPin size={64} color="#d1d5db" style={{ marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', margin: 0 }}>
                Loading your location...
              </p>
              <p style={{ fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                Apartment location will appear shortly
              </p>
            </div>
          ) : loading ? (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: '#6b7280',
              background: '#fafafa'
            }}>
              <Loader2 size={48} color="#10b981" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: '500' }}>
                Loading nearby places...
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default VirtualTour;