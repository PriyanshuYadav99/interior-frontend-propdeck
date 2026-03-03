
// import React, { useState, useEffect } from 'react';
// import { Sparkles, Download, Home, Bed, Briefcase, Loader2, AlertCircle, CheckCircle, Sofa, ChevronDown, Grid3x3, MapPin, Bath, Utensils } from 'lucide-react';
// import { generateDesign, checkHealth, checkSession, incrementGeneration } from './api';
// import RegistrationModal from './RegistrationModal';
// import ScenarioSimulator from './ScenarioSimulator';
// import VirtualTour from './VirtualTour';
// import './App.css';

// const FeaturesModal = ({ isOpen, onClose, onFeatureSelect }) => {
//   if (!isOpen) return null;
  
//   const features = [
//     {
//       id: 'scenario',
//       title: 'Scenario Simulator',
//       icon: Grid3x3,
//       gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//     },
//     {
//       id: 'virtual-tour',
//       title: 'Virtual Tour',
//       icon: MapPin,
//       gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
//     },
//   ];

//   return (
//     <>
//       <div 
//         style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'rgba(0, 0, 0, 0.5)',
//           zIndex: 999,
//           animation: 'fadeIn 0.3s ease-out'
//         }}
//         onClick={onClose}
//       />

//       <button
//         onClick={onClose}
//         style={{
//           position: 'fixed',
//           top: '32px',
//           left: '50%',
//           transform: 'translateX(-50%)',
//           width: '56px',
//           height: '56px',
//           borderRadius: '50%',
//           border: 'none',
//           background: '#10b981',
//           boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           cursor: 'pointer',
//           transition: 'all 0.2s',
//           zIndex: 1001
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
//           e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
//           e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
//         }}
//       >
//         <ChevronDown size={28} color="white" strokeWidth={3} />
//       </button>

//       <div style={{
//         position: 'fixed',
//         top: '120px',
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'white',
//         borderTopLeftRadius: '24px',
//         borderTopRightRadius: '24px',
//         zIndex: 1000,
//         padding: '3rem 2rem',
//         paddingBottom: '3rem',
//         animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
//         boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
//         overflowY: 'auto'
//       }}>
//         <div style={{ 
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           gap: '2rem',
//           flexWrap: 'wrap',
//           padding: '2rem 1rem',
//           minHeight: '100%'
//         }}>
//           {features.map((feature) => {
//             const Icon = feature.icon;
//             return (
//               <button
//                 key={feature.id}
//                 style={{
//                   width: '180px',
//                   height: '200px',
//                   border: 'none',
//                   borderRadius: '16px',
//                   background: feature.gradient,
//                   cursor: 'pointer',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: '1rem',
//                   transition: 'all 0.3s',
//                   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//                   position: 'relative',
//                   overflow: 'hidden'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
//                   e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0) scale(1)';
//                   e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
//                 }}
//                 onClick={() => {
//                   console.log(`Clicked: ${feature.title}`);
//                   onFeatureSelect(feature.id);
//                   onClose();
//                 }}
//               >
//                 <div style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   opacity: 0.1
//                 }}>
//                   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//                     <defs>
//                       <pattern id={`pattern-${feature.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
//                         <circle cx="20" cy="20" r="15" fill="white" opacity="0.3"/>
//                       </pattern>
//                     </defs>
//                     <rect width="100%" height="100%" fill={`url(#pattern-${feature.id})`}/>
//                   </svg>
//                 </div>
//                 <div style={{
//                   width: '80px',
//                   height: '80px',
//                   background: 'rgba(255, 255, 255, 0.2)',
//                   borderRadius: '16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   backdropFilter: 'blur(10px)',
//                   zIndex: 1
//                 }}>
//                   <Icon size={40} color="white" strokeWidth={2} />
//                 </div>
//                 <span style={{
//                   color: 'white',
//                   fontSize: '1rem',
//                   fontWeight: '600',
//                   textAlign: 'center',
//                   zIndex: 1,
//                   lineHeight: '1.3'
//                 }}>
//                   {feature.title}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };

// const App = () => {
//   const [currentPage, setCurrentPage] = useState('home');
//   const [showFeaturesModal, setShowFeaturesModal] = useState(false);

//   const urlParams = new URLSearchParams(window.location.search);
//   const clientName = urlParams.get('client') || 'skyline';

//   const [showRegistrationModal, setShowRegistrationModal] = useState(false);
//   const [generationCount, setGenerationCount] = useState(0);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [userEmail, setUserEmail] = useState('');
//   const [sessionId, setSessionId] = useState('');

//   const [apiStatus, setApiStatus] = useState('checking');
//   const [progress, setProgress] = useState(0);

//   const [selectedRoom, setSelectedRoom] = useState('');
//   const [selectedStyle, setSelectedStyle] = useState('');
//   const [customPrompt, setCustomPrompt] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [imageHistory, setImageHistory] = useState([]);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const rooms = [
//     { id: 'master_bedroom', name: 'Master Bedroom', icon: Bed },
//     { id: 'living_room', name: 'Living Room', icon: Sofa },
//     { id: 'kitchen', name: 'Kitchen', icon: Utensils },
   
//   ];

//   const styles = [
//     { id: 'modern', name: 'Modern' },
//     { id: 'scandinavian', name: 'Scandinavian' },
//     { id: 'industrial', name: 'Industrial' },
//     { id: 'minimalist', name: 'Minimalist' },
//     { id: 'traditional', name: 'Traditional' },
//     { id: 'bohemian', name: 'Bohemian' }
//   ];

//   useEffect(() => {
//     const initializeApp = async () => {
//       try {
//         const health = await checkHealth();
//         setApiStatus(health.status === 'healthy' ? 'connected' : 'disconnected');
//       } catch (error) {
//         setApiStatus('disconnected');
//       }

//       let currentSessionId = sessionStorage.getItem('sessionId');
//       if (!currentSessionId) {
//         currentSessionId = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
//         sessionStorage.setItem('sessionId', currentSessionId);
//       }
//       setSessionId(currentSessionId);

//       try {
//         const savedHistory = sessionStorage.getItem('imageHistory');
//         if (savedHistory) {
//           const parsedHistory = JSON.parse(savedHistory);
//           setImageHistory(parsedHistory);
//           setSelectedImageIndex(0);
//           console.log('[APP] Restored', parsedHistory.length, 'images from session');
//         }
//       } catch (error) {
//         console.error('[APP] Error restoring image history:', error);
//         sessionStorage.removeItem('imageHistory');
//       }

//       const registeredEmail = localStorage.getItem('userEmail');
//       const registeredName = localStorage.getItem('userName');
//       const registeredPhone = localStorage.getItem('userPhone');
      
//       if (registeredEmail && registeredName && registeredPhone) {
//         setIsRegistered(true);
//         setUserEmail(registeredEmail);
//         setGenerationCount(0);
//         console.log('[APP] User is registered:', registeredEmail);
//       } else {
//         await checkServerGenerationCount(currentSessionId);
//       }
//     };

//     initializeApp();
//   }, []);

//   useEffect(() => {
//     if (currentPage === 'home' && sessionId && !isRegistered) {
//       checkServerGenerationCount(sessionId);
//     }
//   }, [currentPage]);

//   const checkServerGenerationCount = async (sessionId) => {
//     try {
//       console.log('[APP] Checking server generation count for session:', sessionId);
//       const data = await checkSession(sessionId);
      
//       if (data.success) {
//         const count = data.generation_count || 0;
//         setGenerationCount(count);
//         console.log('[APP] Server returned generation count:', count);
        
//         if (data.is_registered) {
//           setIsRegistered(true);
//           setUserEmail(data.email || '');
//           localStorage.setItem('userEmail', data.email || '');
//           console.log('[APP] User is already registered:', data.email);
//         }
//       }
//     } catch (error) {
//       console.error('[APP] Error checking session:', error);
//       const localCount = parseInt(localStorage.getItem('generationCount') || '0', 10);
//       setGenerationCount(localCount);
//       console.log('[APP] Using local generation count:', localCount);
//     }
//   };

//   const handleRegistrationSuccess = async (data) => {
//     console.log('[APP] Registration successful:', data);
    
//     localStorage.setItem('userEmail', data.email);
//     localStorage.setItem('userName', data.name);
//     localStorage.setItem('userPhone', data.phone);
//     localStorage.setItem('userId', data.user_id);
//     localStorage.removeItem('generationCount');
    
//     setIsRegistered(true);
//     setGenerationCount(0);
//     setUserEmail(data.email);
//     setShowRegistrationModal(false);
//     setError('');
//     setSuccess('🎉 Registration complete! You now have unlimited access.');
    
//     console.log('[APP] User registered and modal closed');
//   };

//   const handleGenerate = async () => {
//     if (!selectedRoom) {
//       setError('Please select a room type');
//       return;
//     }

//     if (!selectedStyle && !customPrompt.trim()) {
//       setError('Please select a style or enter a custom prompt');
//       return;
//     }

//     // ✅ FIX: Check both state AND localStorage for generation count
//     const currentCount = generationCount;
//     const localStorageCount = parseInt(localStorage.getItem('generationCount') || '0', 10);
//     const actualCount = Math.max(currentCount, localStorageCount);
    
//     console.log('[APP] Current generation count before generate:', currentCount);
//     console.log('[APP] LocalStorage count:', localStorageCount);
//     console.log('[APP] Using count:', actualCount);
//     console.log('[APP] Is registered:', isRegistered);
    
//     // ✅ FIX: Check if user has already generated 2 images (count will be 2 when trying 3rd)
//     if (!isRegistered && actualCount >= 2) {
//       console.log('[APP] 🚫 Generation limit reached! Count:', actualCount);
//       console.log('[APP] Showing registration modal...');
//       setShowRegistrationModal(true);
//       setError('⚠️ You\'ve used your 2 free generations. Please register to continue.');
//       return;
//     }

//     await executeGeneration();
//   };

//   const executeGeneration = async () => {
//     setIsGenerating(true);
//     setError('');
//     setSuccess('');
//     setProgress(0);

//     try {
//       console.log('[APP] Starting generation...');
//       setProgress(10);
      
//       const result = await generateDesign(selectedRoom, selectedStyle, customPrompt, clientName);
      
//       setProgress(50);
      
//       if (!result.success) {
//         throw new Error(result.error || 'Failed to generate');
//       }

//       console.log('[APP] 🎉 Generation completed!');
//       setProgress(80);
      
//       const processedImages = [{
//         id: result.images[0].id || Date.now(),
//         url: result.images[0].image_url || result.images[0].cloudinary_url || `data:image/png;base64,${result.images[0].image_base64}`,
//         cloudinaryUrl: result.images[0].image_url || result.images[0].cloudinary_url,
//         style: result.images[0].style || selectedStyle || 'custom',
//         roomType: result.images[0].room_type || selectedRoom,
//         timestamp: Date.now()
//       }];
      
//       const newHistory = [...processedImages, ...imageHistory];
//       setImageHistory(newHistory);
      
//       try {
//         const lightweightHistory = newHistory.slice(0, 20).map(img => ({
//           id: img.id,
//           url: img.cloudinaryUrl || (img.url.startsWith('http') ? img.url : null),
//           style: img.style,
//           roomType: img.roomType,
//           timestamp: img.timestamp
//         })).filter(img => img.url && img.url.startsWith('http'));
        
//         sessionStorage.setItem('imageHistory', JSON.stringify(lightweightHistory));
//         console.log('[APP] Saved', lightweightHistory.length, 'image URLs to session');
//       } catch (error) {
//         console.error('[APP] Error saving to sessionStorage:', error);
//         sessionStorage.clear();
//       }
      
//       setSelectedImageIndex(0);
//       setSuccess('✅ Design generated successfully!');
//       setProgress(100);

//       if (!isRegistered) {
//         const newCount = generationCount + 1;
        
//         // ✅ Update BOTH state and localStorage immediately
//         setGenerationCount(newCount);
//         localStorage.setItem('generationCount', newCount.toString());
        
//         console.log('[APP] ✅ Generation count updated from', generationCount, 'to', newCount);
//         console.log('[APP] ✅ Saved to localStorage:', newCount);
        
//         try {
//           await incrementGeneration(sessionId, selectedRoom, selectedStyle, customPrompt, clientName);
//           console.log('[APP] ✅ Server count updated successfully');
//         } catch (err) {
//           console.error('[APP] ❌ Error updating server count:', err);
//         }
//       }

//     } catch (err) {
//       console.error('[APP] Generation error:', err);
//       setError(err.message || 'Failed to generate design. Please try again.');
//       setProgress(0);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadImage = async (image, index) => {
//     try {
//       if (image.url.startsWith('http')) {
//         const response = await fetch(image.url);
//         const blob = await response.blob();
//         const blobUrl = URL.createObjectURL(blob);
        
//         const link = document.createElement('a');
//         link.href = blobUrl;
//         link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(blobUrl);
        
//         setSuccess('✅ Image downloaded successfully!');
//       } else {
//         const link = document.createElement('a');
//         link.href = image.url;
//         link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
        
//         setSuccess('✅ Image downloaded successfully!');
//       }
//     } catch (error) {
//       console.error('[APP] Download error:', error);
//       setError('❌ Failed to download image. Please try again.');
//     }
//   };

//   const handleFeatureSelect = (featureId) => {
//     console.log('Feature selected:', featureId);
//     setCurrentPage(featureId);
//   };

//   const handleBackToHome = () => {
//     setCurrentPage('home');
//   };

//   if (currentPage === 'scenario') {
//     return <ScenarioSimulator onBack={handleBackToHome} />;
//   }

//   if (currentPage === 'virtual-tour') {
//     return <VirtualTour onBack={handleBackToHome} />;
//   }

//   // ✅ EXACT FIGMA MATCH - Light gray outer container with rounded white panels inside
//   return (
//     <div style={{ 
//       width: '100vw',
//       height: '100vh',
//       background: '#f3f4f6', // ✅ Light gray background instead of black
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       padding: '1.5rem',
//       boxSizing: 'border-box'
//     }}>
//       {/* ✅ ROUNDED CONTAINER */}
//       <div style={{ 
//         maxWidth: '1600px',
//         width: '100%',
//         height: '100%',
//         background: '#f3f4f6', // ✅ Light gray
//         borderRadius: '24px',
//         overflow: 'hidden',
//         display: 'flex',
//         gap: '1.5rem',
//         padding: '1.5rem',
//         boxSizing: 'border-box'
//       }}>
        
//         {/* ✅ LEFT PANEL - White background - 50% width - Compact */}
//         <div style={{ 
//           flex: 1,
//           minWidth: 0,
//           background: 'white',
//           borderRadius: '16px',
//           padding: '1.5rem', // ✅ Reduced from 2rem to 1.5rem
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'hidden',
//           boxSizing: 'border-box'
//         }}>
//           <div style={{ 
//             flex: 1,
//             overflowY: 'auto',
//             paddingRight: '0.25rem' // ✅ Reduced padding
//           }}>
//             {/* Select Room */}
//             <div style={{ marginBottom: '1.25rem' }}> {/* ✅ Reduced from 2rem to 1.25rem */}
//               <div style={{ 
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 marginBottom: '0.75rem' // ✅ Reduced from 1rem
//               }}>
//                 <Home size={20} color="#1f2937" />
//                 <h2 style={{ 
//                   fontSize: '1rem', // ✅ Reduced from 1.125rem
//                   fontWeight: '600',
//                   color: '#1f2937',
//                   margin: 0
//                 }}>Select Room</h2>
//               </div>
              
//               <div style={{ 
//                 display: 'grid',
//                 gridTemplateColumns: '1fr 1fr',
//                 gap: '0.5rem' // ✅ Reduced from 0.75rem
//               }}>
//                 {rooms.map((room) => {
//                   const Icon = room.icon;
//                   return (
//                     <button
//                       key={room.id}
//                       onClick={() => setSelectedRoom(room.id)}
//                       style={{
//                         padding: '0.625rem', // ✅ Reduced from 0.875rem
//                         borderRadius: '8px',
//                         border: selectedRoom === room.id 
//                           ? '2px solid #9333ea' 
//                           : '1px solid #e5e7eb',
//                         background: selectedRoom === room.id 
//                           ? '#faf5ff' 
//                           : 'white',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '0.625rem',
//                         transition: 'all 0.2s',
//                         fontSize: '0.875rem',
//                         fontWeight: '500',
//                         color: selectedRoom === room.id ? '#9333ea' : '#6b7280'
//                       }}
//                       onMouseEnter={(e) => {
//                         if (selectedRoom !== room.id) {
//                           e.currentTarget.style.borderColor = '#d1d5db';
//                           e.currentTarget.style.background = '#f9fafb';
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (selectedRoom !== room.id) {
//                           e.currentTarget.style.borderColor = '#e5e7eb';
//                           e.currentTarget.style.background = 'white';
//                         }
//                       }}
//                     >
//                       <Icon size={18} />
//                       <span>{room.name}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Choose Style */}
//             <div style={{ marginBottom: '1.25rem' }}> {/* ✅ Reduced from 2rem */}
//               <div style={{ 
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 marginBottom: '0.75rem' // ✅ Reduced from 1rem
//               }}>
//                 <Sparkles size={20} color="#1f2937" />
//                 <h2 style={{ 
//                   fontSize: '1rem', // ✅ Reduced from 1.125rem
//                   fontWeight: '600',
//                   color: '#1f2937',
//                   margin: 0
//                 }}>Choose Style</h2>
//               </div>
              
//               <div style={{ 
//                 display: 'grid',
//                 gridTemplateColumns: '1fr 1fr 1fr',
//                 gap: '0.5rem',
//                 marginBottom: '0.75rem' // ✅ Reduced from 1rem
//               }}>
//                 {styles.map((style) => (
//                   <button
//                     key={style.id}
//                     onClick={() => {
//                       setSelectedStyle(style.id);
//                       setCustomPrompt('');
//                     }}
//                     style={{
//                       padding: '0.625rem',
//                       borderRadius: '8px',
//                       border: selectedStyle === style.id 
//                         ? '2px solid #9333ea' 
//                         : '1px solid #e5e7eb',
//                       background: selectedStyle === style.id 
//                         ? '#faf5ff' 
//                         : 'white',
//                       cursor: 'pointer',
//                       transition: 'all 0.2s',
//                       fontSize: '0.8rem',
//                       fontWeight: '500',
//                       color: selectedStyle === style.id ? '#9333ea' : '#6b7280'
//                     }}
//                   >
//                     {style.name}
//                   </button>
//                 ))}
//               </div>

//               <div style={{ 
//                 textAlign: 'center',
//                 color: '#9ca3af',
//                 fontWeight: '600',
//                 margin: '0.75rem 0', // ✅ Reduced from 1.25rem
//                 fontSize: '0.875rem'
//               }}>OR</div>

//               <textarea
//                 value={customPrompt}
//                 onChange={(e) => {
//                   setCustomPrompt(e.target.value);
//                   if (e.target.value.trim()) setSelectedStyle('');
//                 }}
//                 placeholder="Describe your style (e.g., Space theme kids room, Tropical paradise...)"
//                 style={{
//                   width: '100%',
//                   padding: '0.75rem', // ✅ Reduced from 1rem
//                   border: customPrompt.trim() 
//                     ? '2px solid #9333ea' 
//                     : '1px solid #e5e7eb',
//                   borderRadius: '8px',
//                   resize: 'none',
//                   height: '4rem', // ✅ Reduced from 5.5rem
//                   fontSize: '0.875rem',
//                   outline: 'none',
//                   transition: 'border 0.2s',
//                   fontFamily: 'inherit',
//                   boxSizing: 'border-box',
//                   color: '#374151'
//                 }}
//                 onFocus={(e) => {
//                   if (!customPrompt.trim()) {
//                     e.target.style.borderColor = '#9333ea';
//                   }
//                 }}
//                 onBlur={(e) => {
//                   if (!customPrompt.trim()) {
//                     e.target.style.borderColor = '#e5e7eb';
//                   }
//                 }}
//               />
//             </div>

//             {/* Generate Button */}
//             <button
//               onClick={handleGenerate}
//               disabled={isGenerating || apiStatus === 'disconnected'}
//               style={{
//                 width: '100%',
//                 background: isGenerating || apiStatus === 'disconnected' 
//                   ? '#d1d5db' 
//                   : '#22c55e',
//                 color: 'white',
//                 padding: '0.875rem', // ✅ Reduced from 1rem
//                 borderRadius: '12px',
//                 fontWeight: '600',
//                 fontSize: '1rem',
//                 border: 'none',
//                 cursor: isGenerating || apiStatus === 'disconnected' 
//                   ? 'not-allowed' 
//                   : 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '0.5rem',
//                 transition: 'all 0.2s',
//                 marginBottom: '1rem' // ✅ Reduced from 1.5rem
//               }}
//               onMouseEnter={(e) => {
//                 if (!isGenerating && apiStatus === 'connected') {
//                   e.currentTarget.style.background = '#16a34a';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isGenerating && apiStatus === 'connected') {
//                   e.currentTarget.style.background = '#22c55e';
//                 }
//               }}
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles size={20} />
//                   Generate Design
//                 </>
//               )}
//             </button>

//             {/* Powered By */}
//             <div style={{ 
//               textAlign: 'center',
//               marginBottom: '1rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: '0.5rem'
//             }}>
//               <span style={{ 
//                 fontSize: '0.875rem',
//                 color: '#9ca3af',
//                 fontWeight: '500',
//                 fontStyle: 'italic'
//               }}>
//                 powered by
//               </span>
//               <img 
//                 src="/logo.png"
//                 alt="PropDeck Logo" 
//                 style={{ height: '18px', width: 'auto' }}
//               />
//             </div>

//             {/* ✅ DEBUG: Generation Counter */}
//             {!isRegistered && (
//               <div style={{ 
//                 textAlign: 'center',
//                 marginBottom: '1rem',
//                 padding: '0.5rem',
//                 background: '#f3f4f6',
//                 borderRadius: '8px',
//                 fontSize: '0.75rem',
//                 color: '#6b7280',
//                 fontWeight: '600'
//               }}>
                
//               </div>
//             )}

//             {/* Success/Error Messages */}
//             {success && (
//               <div style={{ 
//                 marginBottom: '0.75rem', // ✅ Reduced from 1rem
//                 padding: '0.625rem', // ✅ Reduced from 0.75rem
//                 background: '#d1fae5',
//                 border: '1px solid #6ee7b7',
//                 borderRadius: '8px',
//                 color: '#047857',
//                 fontSize: '0.875rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 fontWeight: '500'
//               }}>
//                 <CheckCircle size={16} />
//                 {success}
//               </div>
//             )}

//             {error && (
//               <div style={{ 
//                 marginBottom: '0.75rem', // ✅ Reduced from 1rem
//                 padding: '0.625rem', // ✅ Reduced from 0.75rem
//                 background: '#fee2e2',
//                 border: '1px solid #fca5a5',
//                 borderRadius: '8px',
//                 color: '#dc2626',
//                 fontSize: '0.875rem',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 fontWeight: '500'
//               }}>
//                 <AlertCircle size={16} />
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ✅ RIGHT PANEL - White background - 50% width - with relative position for FAB */}
//         <div style={{ 
//           flex: 1,
//           minWidth: 0,
//           background: 'white',
//           borderRadius: '16px',
//           padding: '2rem',
//           display: 'flex',
//           flexDirection: 'column',
//           overflow: 'hidden',
//           boxSizing: 'border-box',
//           position: 'relative' // ✅ For FAB positioning
//         }}>
//           <h2 style={{ 
//             fontSize: '1.25rem',
//             fontWeight: '600',
//             color: '#1f2937',
//             marginBottom: '1.5rem',
//             margin: '0 0 1.5rem 0'
//           }}></h2>
          
//           <div style={{ 
//             flex: 1,
//             display: 'flex',
//             flexDirection: 'column',
//             overflow: 'hidden',
//             minHeight: 0
//           }}>
//             {imageHistory.length === 0 ? (
//               <div style={{ 
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: '#f9fafb',
//                 borderRadius: '12px',
//                 border: '2px dashed #d1d5db'
//               }}>
//                 <div style={{ 
//                   textAlign: 'center',
//                   padding: '3rem'
//                 }}>
//                   <Sparkles 
//                     size={64} 
//                     color="#d1d5db" 
//                     style={{ margin: '0 auto 1.5rem' }} 
//                   />
//                   <p style={{ 
//                     color: '#9ca3af',
//                     fontSize: '1.125rem',
//                     marginBottom: '0.5rem',
//                     fontWeight: '500'
//                   }}>
//                     Your AI-generated designs will appear here
//                   </p>
//                   <p style={{ 
//                     color: '#d1d5db',
//                     fontSize: '0.875rem'
//                   }}>
//                     Select a room and style, then click Generate Design
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div style={{ 
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '1.25rem',
//                 height: '100%',
//                 overflow: 'hidden'
//               }}>
//                 {imageHistory.map((image, index) => {
//                   if (index !== selectedImageIndex) return null;
                  
//                   return (
//                     <div 
//                       key={`main-${image.timestamp}-${index}`}
//                       style={{ 
//                         flex: 1,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: '0.5rem', // ✅ REDUCED from 0.35rem - brings description MUCH closer to image
//                         minHeight: 0,
//                         overflow: 'hidden'
//                       }}
//                     >
//                       {/* ✅ THUMBNAILS - Top-left corner INSIDE panel - Show all images in HORIZONTAL row */}
//                       {imageHistory.length >= 1 && (
//                         <div style={{ 
//                           position: 'absolute',
//                           top: '2rem',
//                           left: '2rem',
//                           display: 'flex',
//                           gap: '0.75rem',
//                           zIndex: 10,
//                           flexDirection: 'row', // ✅ HORIZONTAL row
//                           overflowX: 'auto', // ✅ Allow horizontal scrolling if many images
//                           maxWidth: 'calc(100% - 4rem)' // ✅ Don't overflow the container
//                         }}>
//                           {imageHistory.map((img, idx) => (
//                             <button
//                               key={`thumb-${img.timestamp}-${idx}`}
//                               onClick={() => setSelectedImageIndex(idx)}
//                               style={{
//                                 width: '64px',
//                                 height: '64px',
//                                 border: selectedImageIndex === idx
//                                   ? '3px solid #3b82f6' 
//                                   : '2px solid white',
//                                 borderRadius: '12px',
//                                 overflow: 'hidden',
//                                 cursor: 'pointer',
//                                 padding: 0,
//                                 background: 'none',
//                                 transition: 'all 0.2s',
//                                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
//                               }}
//                               onMouseEnter={(e) => {
//                                 if (selectedImageIndex !== idx) {
//                                   e.currentTarget.style.transform = 'scale(1.05)';
//                                 }
//                               }}
//                               onMouseLeave={(e) => {
//                                 if (selectedImageIndex !== idx) {
//                                   e.currentTarget.style.transform = 'scale(1)';
//                                 }
//                               }}
//                             >
//                               <img
//                                 src={img.url}
//                                 alt={`Thumbnail ${idx + 1}`}
//                                 style={{
//                                   width: '100%',
//                                   height: '100%',
//                                   objectFit: 'cover'
//                                 }}
//                               />
//                             </button>
//                           ))}
//                         </div>
//                       )}

//                       {/* ✅ LARGE IMAGE with rounded corners */}
//                       <div style={{ 
//                         position: 'relative',
//                         flex: 1,
//                         borderRadius: '16px',
//                         overflow: 'hidden',
//                         background: '#f9fafb',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         minHeight: 0,
//                         marginTop: '3rem' // ✅ ADD MORE SPACE between thumbnails and main image
//                       }}>
//                         <img
//                           src={image.url}
//                           alt={`Design ${index + 1}`}
//                           style={{ 
//                             maxWidth: '100%',
//                             maxHeight: '100%',
//                             objectFit: 'contain',
//                             display: 'block',
//                             borderRadius: '16px'
//                           }}
//                         />
//                       </div>
                      
//                       {/* ✅ Bottom info bar - CLOSER to image */}
//                       <div style={{ 
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         flexShrink: 0,
//                         paddingBottom: '3rem' // ✅ Add padding at bottom to make space for FAB
//                       }}>
//                         <div style={{ 
//                           display: 'flex',
//                           flexDirection: 'column',
//                           gap: '0.25rem'
//                         }}>
//                           <span style={{ 
//                             fontSize: '1.125rem',
//                             color: '#1f2937',
//                             fontWeight: '700',
//                             textTransform: 'capitalize'
//                           }}>
//                             {image.roomType.replace(/_/g, ' ')}
//                           </span>
//                           <span style={{ 
//                             fontSize: '0.875rem',
//                             color: '#6b7280',
//                             fontWeight: '400',
//                             textTransform: 'lowercase'
//                           }}>
//                             {image.style}
//                           </span>
//                         </div>
                        
//                         {/* ✅ ACTION BUTTON - Download only (share button removed) */}
//                         <div style={{ display: 'flex', gap: '0.75rem' }}>
//                           <button
//                             onClick={() => downloadImage(image, index)}
//                             style={{
//                               background: 'white',
//                               color: '#1f2937',
//                               padding: '0.75rem',
//                               borderRadius: '50%',
//                               border: '1px solid #e5e7eb',
//                               cursor: 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               width: '48px',
//                               height: '48px',
//                               transition: 'all 0.2s'
//                             }}
//                             onMouseEnter={(e) => {
//                               e.currentTarget.style.background = '#f9fafb';
//                             }}
//                             onMouseLeave={(e) => {
//                               e.currentTarget.style.background = 'white';
//                             }}
//                             title="Download"
//                           >
//                             <Download size={20} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* ✅ FAB BUTTON - Bottom-left of RIGHT panel */}
//           <div style={{
//             position: 'absolute',
//             bottom: '1.5rem',
//             left: '1.5rem',
//             zIndex: 100
//           }}>
//             <button
//               onClick={() => setShowFeaturesModal(true)}
//               style={{
//                 width: '56px',
//                 height: '56px',
//                 borderRadius: '50%',
//                 border: 'none',
//                 background: '#22c55e',
//                 boxShadow: '0 8px 20px rgba(34, 197, 94, 0.4)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s'
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.15)';
//                 e.currentTarget.style.boxShadow = '0 12px 28px rgba(34, 197, 94, 0.5)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
//               }}
//             >
//               <Sparkles size={24} color="white" strokeWidth={2.5} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <RegistrationModal
//         isOpen={showRegistrationModal}
//         onClose={() => {
//           if (isRegistered) {
//             setShowRegistrationModal(false);
//           }
//         }}
//         onSuccess={handleRegistrationSuccess}
//         generatedCount={generationCount}
//         sessionId={sessionId}
//       />

//       <FeaturesModal 
//         isOpen={showFeaturesModal} 
//         onClose={() => setShowFeaturesModal(false)}
//         onFeatureSelect={handleFeatureSelect}
//       />

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }

//         @keyframes slideUp {
//           from { transform: translateY(100%); }
//           to { transform: translateY(0); }
//         }
        
//         * {
//           box-sizing: border-box;
//         }
        
//         ::-webkit-scrollbar {
//           width: 6px;
//         }
//         ::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 10px;
//         }
//         ::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         ::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { Sparkles, Download, Home, Bed, Briefcase, Loader2, AlertCircle, CheckCircle, Sofa, ChevronDown, Grid3x3, MapPin, Bath, Utensils, X, ChevronLeft, ChevronRight, Clock, VolumeX, Shield, Building } from 'lucide-react';
import { generateDesign, checkHealth, checkSession, incrementGeneration } from './api';
import RegistrationModal from './RegistrationModal';
import LifeEcho from './LifeEcho';
import VirtualTour from './VirtualTour';
import './App.css';

const getRandomScenarios = async () => {
  const response = await fetch('http://127.0.0.1:5000/api/scenario/random', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Failed to fetch scenarios');
  return await response.json();
};

const searchVirtualTour = async (location, category) => {
  const response = await fetch('http://127.0.0.1:5000/api/virtual-tour/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, category, radius: 5000 })
  });
  if (!response.ok) throw new Error('Failed to fetch places');
  return await response.json();
};

const iconMap = {
  clock: Clock, time: Clock,
  volume: VolumeX, sound: VolumeX,
  shield: Shield, security: Shield,
  home: Home, house: Home,
  building: Building, office: Building,
  briefcase: Briefcase, work: Briefcase,
  mappin: MapPin, location: MapPin,
};

const App = () => {
  const [currentView, setCurrentView] = useState('default');

  // ✅ NEW: stores the scenario clicked from preview pills
  const [selectedPreviewScenario, setSelectedPreviewScenario] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const clientName = urlParams.get('client') || 'skyline';

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [progress, setProgress] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewScenarios, setPreviewScenarios] = useState([]);
  const [loadingScenarios, setLoadingScenarios] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [previewPlace, setPreviewPlace] = useState(null);
  const [loadingPlace, setLoadingPlace] = useState(false);

  const categories = ['dining', 'education', 'nature', 'health', 'transport', 'shop', 'gym'];
  const APARTMENT_COORDS = { lat: 25.0694755, lng: 55.1468862 };

  const rooms = [
    { id: 'master_bedroom', name: 'Master Bedroom', icon: Bed },
    { id: 'living_room', name: 'Living Room', icon: Sofa },
    { id: 'kitchen', name: 'Kitchen', icon: Utensils },
  ];

  const styles = [
    { id: 'modern', name: 'Modern' },
    { id: 'scandinavian', name: 'Scandinavian' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'bohemian', name: 'Bohemian' }
  ];

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const health = await checkHealth();
        setApiStatus(health.status === 'healthy' ? 'connected' : 'disconnected');
      } catch (error) {
        setApiStatus('disconnected');
      }

      let currentSessionId = sessionStorage.getItem('sessionId');
      if (!currentSessionId) {
        currentSessionId = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', currentSessionId);
      }
      setSessionId(currentSessionId);

      try {
        const savedHistory = sessionStorage.getItem('imageHistory');
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          setImageHistory(parsedHistory);
          setSelectedImageIndex(0);
        }
      } catch (error) {
        console.error('[APP] Error restoring image history:', error);
        sessionStorage.removeItem('imageHistory');
      }

      const registeredEmail = localStorage.getItem('userEmail');
      const registeredName = localStorage.getItem('userName');
      const registeredPhone = localStorage.getItem('userPhone');

      if (registeredEmail && registeredName && registeredPhone) {
        setIsRegistered(true);
        setUserEmail(registeredEmail);
        setGenerationCount(0);
      } else {
        await checkServerGenerationCount(currentSessionId);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => { loadPreviewScenarios(); }, []);
  useEffect(() => { loadPreviewPlace(categories[currentCategoryIndex]); }, [currentCategoryIndex]);

  const loadPreviewScenarios = async () => {
    setLoadingScenarios(true);
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) setPreviewScenarios(result.scenarios.slice(0, 6));
    } catch (err) {
      console.error('Failed to load preview scenarios:', err);
    } finally {
      setLoadingScenarios(false);
    }
  };

  const loadPreviewPlace = async (category) => {
    setLoadingPlace(true);
    try {
      const location = `${APARTMENT_COORDS.lat},${APARTMENT_COORDS.lng}`;
      const result = await searchVirtualTour(location, category);
      if (result.success && result.places && result.places.length > 0) setPreviewPlace(result.places[0]);
    } catch (err) {
      console.error('Failed to load preview place:', err);
    } finally {
      setLoadingPlace(false);
    }
  };

  const handleNextCategory = () => setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  const handlePrevCategory = () => setCurrentCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);

  useEffect(() => {
    if (currentView === 'default' && sessionId && !isRegistered) checkServerGenerationCount(sessionId);
  }, [currentView]);

  const checkServerGenerationCount = async (sessionId) => {
    try {
      const data = await checkSession(sessionId);
      if (data.success) {
        setGenerationCount(data.generation_count || 0);
        if (data.is_registered) {
          setIsRegistered(true);
          setUserEmail(data.email || '');
          localStorage.setItem('userEmail', data.email || '');
        }
      }
    } catch (error) {
      setGenerationCount(parseInt(localStorage.getItem('generationCount') || '0', 10));
    }
  };

  const handleRegistrationSuccess = async (data) => {
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userName', data.name);
    localStorage.setItem('userPhone', data.phone);
    localStorage.setItem('userId', data.user_id);
    localStorage.removeItem('generationCount');
    setIsRegistered(true);
    setGenerationCount(0);
    setUserEmail(data.email);
    setShowRegistrationModal(false);
    setError('');
    setSuccess('🎉 Registration complete! You now have unlimited access.');
  };

  const handleGenerate = async () => {
    if (!selectedRoom) { setError('Please select a room type'); return; }
    if (!selectedStyle && !customPrompt.trim()) { setError('Please select a style or enter a custom prompt'); return; }
    const actualCount = Math.max(generationCount, parseInt(localStorage.getItem('generationCount') || '0', 10));
    if (!isRegistered && actualCount >= 2) {
      setShowRegistrationModal(true);
      setError('⚠️ You\'ve used your 2 free generations. Please register to continue.');
      return;
    }
    await executeGeneration();
  };

  const executeGeneration = async () => {
    setIsGenerating(true); setError(''); setSuccess(''); setProgress(0);
    try {
      setProgress(10);
      const result = await generateDesign(selectedRoom, selectedStyle, customPrompt, clientName);
      setProgress(50);
      if (!result.success) throw new Error(result.error || 'Failed to generate');
      setProgress(80);
      const processedImages = [{
        id: result.images[0].id || Date.now(),
        url: result.images[0].image_url || result.images[0].cloudinary_url || `data:image/png;base64,${result.images[0].image_base64}`,
        cloudinaryUrl: result.images[0].image_url || result.images[0].cloudinary_url,
        style: result.images[0].style || selectedStyle || 'custom',
        roomType: result.images[0].room_type || selectedRoom,
        timestamp: Date.now()
      }];
      const newHistory = [...processedImages, ...imageHistory];
      setImageHistory(newHistory);
      try {
        const lightweightHistory = newHistory.slice(0, 20).map(img => ({
          id: img.id,
          url: img.cloudinaryUrl || (img.url.startsWith('http') ? img.url : null),
          style: img.style, roomType: img.roomType, timestamp: img.timestamp
        })).filter(img => img.url && img.url.startsWith('http'));
        sessionStorage.setItem('imageHistory', JSON.stringify(lightweightHistory));
      } catch (error) { sessionStorage.clear(); }
      setSelectedImageIndex(0);
      setSuccess('✅ Design generated successfully!');
      setProgress(100);
      if (!isRegistered) {
        const newCount = generationCount + 1;
        setGenerationCount(newCount);
        localStorage.setItem('generationCount', newCount.toString());
        try { await incrementGeneration(sessionId, selectedRoom, selectedStyle, customPrompt, clientName); } catch (err) { console.error('[APP] ❌ Error updating server count:', err); }
      }
    } catch (err) {
      console.error('[APP] Generation error:', err);
      setError(err.message || 'Failed to generate design. Please try again.');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (image, index) => {
    try {
      if (image.url.startsWith('http')) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link); link.click();
        document.body.removeChild(link); URL.revokeObjectURL(blobUrl);
        setSuccess('✅ Image downloaded successfully!');
      } else {
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        setSuccess('✅ Image downloaded successfully!');
      }
    } catch (error) {
      console.error('[APP] Download error:', error);
      setError('❌ Failed to download image. Please try again.');
    }
  };

  // ✅ Reset selectedPreviewScenario when going back
  const handleBackToDefault = () => {
    setCurrentView('default');
    setSelectedPreviewScenario(null);
  };

  // ✅ NEW HANDLER: clicking a preview pill sets the scenario AND opens LifeEcho
  const handlePillClick = (scenario) => {
    setSelectedPreviewScenario(scenario);
    setCurrentView('scenario');
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#f3f4f6',
      display: 'flex', flexDirection: 'column',
      padding: '1.5rem', gap: '1.5rem', boxSizing: 'border-box'
    }}>
      {/* TOP SECTION */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', gap: '1.5rem' }}>

        {/* LIFEECHO FULL VIEW */}
        {currentView === 'scenario' && (
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
            {/* ✅ Pass initialScenario — LifeEcho will open directly on its description */}
            <LifeEcho onBack={handleBackToDefault} initialScenario={selectedPreviewScenario} />
          </div>
        )}

        {/* VIRTUAL TOUR FULL VIEW */}
        {currentView === 'virtualTour' && (
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
            <VirtualTour onBack={handleBackToDefault} isEmbedded={true} />
          </div>
        )}

        {/* DEFAULT VIEW */}
        {currentView === 'default' && (
          <>
            {/* LEFT PANEL */}
            <div style={{ flex: 1, minWidth: 0, background: 'white', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <Home size={18} color="#1f2937" />
                  <h2 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Select Room</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {rooms.map((room) => {
                    const Icon = room.icon;
                    return (
                      <button key={room.id} onClick={() => setSelectedRoom(room.id)} style={{
                        padding: '0.5rem 0.6rem', borderRadius: '6px',
                        border: selectedRoom === room.id ? '2px solid #9333ea' : '1px solid #e5e7eb',
                        background: selectedRoom === room.id ? '#faf5ff' : 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: '500',
                        color: selectedRoom === room.id ? '#9333ea' : '#6b7280'
                      }}>
                        <Icon size={16} /><span>{room.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  <Sparkles size={18} color="#1f2937" />
                  <h2 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>Choose Style</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  {styles.map((style) => (
                    <button key={style.id} onClick={() => { setSelectedStyle(style.id); setCustomPrompt(''); }} style={{
                      padding: '0.5rem', borderRadius: '6px',
                      border: selectedStyle === style.id ? '2px solid #9333ea' : '1px solid #e5e7eb',
                      background: selectedStyle === style.id ? '#faf5ff' : 'white',
                      cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.75rem', fontWeight: '500',
                      color: selectedStyle === style.id ? '#9333ea' : '#6b7280'
                    }}>{style.name}</button>
                  ))}
                </div>
                <div style={{ textAlign: 'center', color: '#9ca3af', fontWeight: '600', margin: '0.6rem 0', fontSize: '0.75rem' }}>OR</div>
                <textarea
                  value={customPrompt}
                  onChange={(e) => { setCustomPrompt(e.target.value); if (e.target.value.trim()) setSelectedStyle(''); }}
                  placeholder="Describe your style (e.g., Space theme kids room...)"
                  style={{
                    width: '100%', padding: '0.6rem',
                    border: customPrompt.trim() ? '2px solid #9333ea' : '1px solid #e5e7eb',
                    borderRadius: '6px', resize: 'none', height: '3.5rem', fontSize: '0.8rem',
                    outline: 'none', transition: 'border 0.2s', fontFamily: 'inherit',
                    boxSizing: 'border-box', color: '#374151'
                  }}
                />
              </div>

              <button onClick={handleGenerate} disabled={isGenerating || apiStatus === 'disconnected'} style={{
                width: '100%',
                background: isGenerating || apiStatus === 'disconnected' ? '#d1d5db' : '#22c55e',
                color: 'white', padding: '0.7rem', borderRadius: '10px', fontWeight: '600',
                fontSize: '0.95rem', border: 'none',
                cursor: isGenerating || apiStatus === 'disconnected' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', transition: 'all 0.2s', marginBottom: '0.8rem'
              }}>
                {isGenerating
                  ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />Generating...</>
                  : <><Sparkles size={18} />Generate Design</>}
              </button>

              <div style={{ textAlign: 'center', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500', fontStyle: 'italic' }}>powered by</span>
                <img src="/logo.png" alt="PropDeck Logo" style={{ height: '14px', width: 'auto' }} />
              </div>

              {success && (
                <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '6px', color: '#047857', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500' }}>
                  <CheckCircle size={14} />{success}
                </div>
              )}
              {error && (
                <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', color: '#dc2626', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500' }}>
                  <AlertCircle size={14} />{error}
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div style={{ flex: 1, minWidth: 0, background: 'white', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
              {imageHistory.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', borderRadius: '12px', border: '2px dashed #d1d5db' }}>
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Sparkles size={64} color="#d1d5db" style={{ margin: '0 auto 1.5rem' }} />
                    <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: '500' }}>Your AI-generated designs will appear here</p>
                    <p style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Select a room and style, then click Generate Design</p>
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative', flex: 1, borderRadius: '16px', overflow: 'hidden', minHeight: 0 }}>
                  <img src={imageHistory[selectedImageIndex].url} alt={`Design ${selectedImageIndex + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '16px' }} />
                  {imageHistory.length > 1 && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: 'calc(100% - 2rem)', overflowY: 'auto' }}>
                      {imageHistory.slice(0, 6).map((img, idx) => (
                        <button key={`thumb-${img.timestamp}-${idx}`} onClick={() => setSelectedImageIndex(idx)} style={{ width: '40px', height: '40px', border: selectedImageIndex === idx ? '2px solid #3b82f6' : '2px solid white', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none', transition: 'all 0.2s', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                          <img src={img.url} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      ))}
                    </div>
                  )}
                  <button onClick={() => downloadImage(imageHistory[selectedImageIndex], selectedImageIndex)} style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', color: '#1f2937', padding: '0.65rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} title="Download">
                    <Download size={20} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* BOTTOM SECTION */}
      <div style={{ height: '160px', display: 'flex', gap: '1.5rem', flexShrink: 0 }}>

        {/* LIFEECHO PREVIEW CARD */}
        <div style={{ flex: '0 0 calc(50% - 0.75rem)', background: 'white', borderRadius: '16px', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxSizing: 'border-box', overflow: 'hidden' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937', margin: 0, flexShrink: 0 }}>LifeEcho</h3>
          {loadingScenarios ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={24} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, overflow: 'hidden', justifyContent: 'center' }}>
              <div style={{ overflow: 'hidden', width: '100%' }}>
                <div className="marquee-left">
                  {[...previewScenarios.slice(0, 3), ...previewScenarios.slice(0, 3)].map((scenario, idx) => {
                    const Icon = iconMap[scenario.icon] || Clock;
                    const isHighlighted = (idx % 3) < 2;
                    return (
                      // ✅ FIXED: calls handlePillClick(scenario) — passes the scenario object
                      <button key={"r1-" + idx} onClick={() => handlePillClick(scenario)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem 0.3rem 0.4rem', background: 'white', border: isHighlighted ? '2px solid #10b981' : '1.5px solid #d1d5db', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap', flexShrink: 0, marginRight: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: isHighlighted ? '#10b981' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={11} color={isHighlighted ? 'white' : '#9ca3af'} />
                        </div>
                        <span>{scenario.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ overflow: 'hidden', width: '100%' }}>
                <div className="marquee-right">
                  {[...previewScenarios.slice(3, 6), ...previewScenarios.slice(3, 6)].map((scenario, idx) => {
                    const Icon = iconMap[scenario.icon] || Clock;
                    return (
                      // ✅ FIXED: calls handlePillClick(scenario)
                      <button key={"r2-" + idx} onClick={() => handlePillClick(scenario)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem 0.3rem 0.4rem', background: 'white', border: '1.5px solid #d1d5db', borderRadius: '50px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500', color: '#374151', whiteSpace: 'nowrap', flexShrink: 0, marginRight: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={11} color="#9ca3af" />
                        </div>
                        <span>{scenario.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VIRTUAL TOUR PREVIEW CARD */}
        <div style={{ flex: '0 0 calc(50% - 0.75rem)', background: 'white', borderRadius: '16px', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>Virtual Tour</h3>
          {loadingPlace ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={24} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : previewPlace ? (
            <div onClick={() => setCurrentView('virtualTour')} style={{ flex: 1, background: '#f9fafb', borderRadius: '12px', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <button onClick={(e) => { e.stopPropagation(); handlePrevCategory(); }} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <ChevronLeft size={18} />
              </button>
              {previewPlace.photo_url && (
                <img src={previewPlace.photo_url} alt={previewPlace.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{previewPlace.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>~{previewPlace.distance}km • {categories[currentCategoryIndex]}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleNextCategory(); }} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>No places found</div>
          )}
        </div>

      </div>

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => { if (isRegistered) setShowRegistrationModal(false); }}
        onSuccess={handleRegistrationSuccess}
        generatedCount={generationCount}
        sessionId={sessionId}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .marquee-left { display: inline-flex; animation: marquee-left 18s linear infinite; width: max-content; }
        .marquee-right { display: inline-flex; animation: marquee-right 18s linear infinite; width: max-content; }
        .marquee-left:hover, .marquee-right:hover { animation-play-state: paused; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default App;