// import React, { useState, useEffect, useRef } from "react";
// import {
//   Sparkles,
//   Palette,
//   Download,
//   Home,
//   Building,
//   Loader2,
// } from "lucide-react";
// import { generateDesign, checkHealth, checkSession } from "../services/api";
// import RegistrationModal from "../components/modals/RegistrationModal";
// import LifeEcho from "../features/life-echo/LifeEcho";
// import VirtualTour from "../features/virtual-tour/VirtualTour";
// import {
//   logToolUsage,
//   createVisibilityTracker,
// } from "../utils/activityTracker";
// import {
//   ROOMS,
//   STYLES,
//   FLAT_TYPES,
//   NAV_TABS,
// } from "../constants/designOptions";
// import "./HomePage.css";

// const HomePage = () => {
//   const [currentView, setCurrentView] = useState("default");
//   const [selectedPreviewScenario, setSelectedPreviewScenario] = useState(null);

//   const urlParams = new URLSearchParams(window.location.search);
//   const clientName = urlParams.get("client") || "skyline";

//   const [showRegistrationModal, setShowRegistrationModal] = useState(false);
//   const [generationCount, setGenerationCount] = useState(0);
//   const [isRegistered, setIsRegistered] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const [sessionId, setSessionId] = useState("");
//   const [apiStatus, setApiStatus] = useState("checking");
//   const [progress, setProgress] = useState(0);
//   const [selectedRoom, setSelectedRoom] = useState("");
//   const [selectedStyle, setSelectedStyle] = useState("");
//   const [customPrompt, setCustomPrompt] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [imageHistory, setImageHistory] = useState([]);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const roomDesignRef = useRef(null);

//   const [roomPreviewImage, setRoomPreviewImage] = useState(null);
//   const [loadingPreview, setLoadingPreview] = useState(false);
//   const [showBeforePreview, setShowBeforePreview] = useState(false);
//   const [selectedFlatType, setSelectedFlatType] = useState("");

//   const [roomPreviewCache, setRoomPreviewCache] = useState({});
//   const getGlobalAttemptCount = () =>
//     parseInt(sessionStorage.getItem("globalAttemptCount") || "0", 10);

//   const incrementGlobalAttempt = () => {
//     const next = getGlobalAttemptCount() + 1;
//     sessionStorage.setItem("globalAttemptCount", next.toString());
//     return next;
//   };

//   const checkAttemptLimit = () => {
//     if (isRegistered) return false;
//     const count = getGlobalAttemptCount();
//     if (count >= 2) {
//       setShowRegistrationModal(true);
//       setError(
//         "⚠️ You've used your 2 free attempts. Please register to continue.",
//       );
//       return true;
//     }
//     return false;
//   };

//   useEffect(() => {
//     const initializeApp = async () => {
//       sessionStorage.removeItem("tracking_start_time");
//       try {
//         const health = await checkHealth();
//         setApiStatus(
//           health.status === "healthy" ? "connected" : "disconnected",
//         );
//       } catch (error) {
//         setApiStatus("disconnected");
//       }

//       let currentSessionId = sessionStorage.getItem("sessionId");
//       if (!currentSessionId) {
//         currentSessionId =
//           "web-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
//         sessionStorage.setItem("sessionId", currentSessionId);
//       }
//       setSessionId(currentSessionId);

//       try {
//         const savedHistory = sessionStorage.getItem("imageHistory");
//         if (savedHistory) {
//           const parsedHistory = JSON.parse(savedHistory);
//           setImageHistory(parsedHistory);
//           setSelectedImageIndex(0);
//         }
//       } catch (error) {
//         console.error("[APP] Error restoring image history:", error);
//         sessionStorage.removeItem("imageHistory");
//       }

//       const registeredEmail = localStorage.getItem("userEmail");
//       const registeredName = localStorage.getItem("userName");
//       const registeredPhone = localStorage.getItem("userPhone");

//       if (registeredEmail && registeredName && registeredPhone) {
//         setIsRegistered(true);
//         setUserEmail(registeredEmail);
//         setGenerationCount(0);
//       } else {
//         await checkServerGenerationCount(currentSessionId);
//       }
//     };
//     initializeApp();
//   }, []);

//   // ✅ Visibility tracking for the room design panel only
//   useEffect(() => {
//     const roomObserver = createVisibilityTracker("room_design", roomDesignRef);
//     return () => {
//       roomObserver.disconnect();
//     };
//   }, []);

//   // ✅ Log all tools when user closes/leaves the page
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       logToolUsage("room_design");
//       logToolUsage("virtual_tour");
//       logToolUsage("lifeecho");
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, []);

//   useEffect(() => {
//     const preloadAllRooms = async () => {
//       const cache = {};
//       await Promise.all(
//         ROOMS.map(async (room) => {
//           try {
//             const res = await fetch(
//               `https://interior-backend-production.up.railway.app/api/room-preview/${clientName}/${room.id}`,
//             );
//             const data = await res.json();
//             if (data.success) {
//               cache[room.id] = `data:image/png;base64,${data.image_base64}`;
//             }
//           } catch (err) {
//             console.error(`[APP] Failed to preload ${room.id}:`, err);
//           }
//         }),
//       );
//       setRoomPreviewCache(cache);
//     };
//     preloadAllRooms();
//   }, [clientName]);

//   useEffect(() => {
//     if (currentView === "default" && sessionId && !isRegistered)
//       checkServerGenerationCount(sessionId);
//   }, [currentView]);

//   const checkServerGenerationCount = async (sessionId) => {
//     try {
//       const data = await checkSession(sessionId);
//       if (data.success) {
//         setGenerationCount(data.generation_count || 0);
//         if (data.is_registered) {
//           setIsRegistered(true);
//           setUserEmail(data.email || "");
//           localStorage.setItem("userEmail", data.email || "");
//         }
//       }
//     } catch (error) {
//       setGenerationCount(
//         parseInt(localStorage.getItem("generationCount") || "0", 10),
//       );
//     }
//   };

//   const loadRoomPreview = async (roomId) => {
//     setShowBeforePreview(true);
//     if (roomPreviewCache[roomId]) {
//       setRoomPreviewImage(roomPreviewCache[roomId]);
//       return;
//     }
//     setLoadingPreview(true);
//     setRoomPreviewImage(null);
//     try {
//       const res = await fetch(
//         `https://interior-backend-production.up.railway.app/api/room-preview/${clientName}/${roomId}`,
//       );
//       const data = await res.json();
//       if (data.success) {
//         const img = `data:image/png;base64,${data.image_base64}`;
//         setRoomPreviewCache((prev) => ({ ...prev, [roomId]: img }));
//         setRoomPreviewImage(img);
//       }
//     } catch (err) {
//       console.error("[APP] Failed to load room preview:", err);
//     } finally {
//       setLoadingPreview(false);
//     }
//   };

//   const handleRegistrationSuccess = async (data) => {
//     localStorage.setItem("userEmail", data.email);
//     localStorage.setItem("userName", data.name);
//     localStorage.setItem("userPhone", data.phone);
//     localStorage.setItem("userId", data.user_id);
//     localStorage.removeItem("generationCount");
//     setIsRegistered(true);
//     sessionStorage.removeItem("globalAttemptCount");
//     setGenerationCount(0);
//     setUserEmail(data.email);
//     setShowRegistrationModal(false);
//     setError("");
//     setSuccess("🎉 Registration complete! You now have unlimited access.");
//     try {
//       await fetch(
//         "https://interior-backend-production.up.railway.app/api/activity/link-session",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             session_id: sessionId,
//             user_id: data.user_id,
//           }),
//         },
//       );
//     } catch (err) {
//       console.error("[APP] Session link failed:", err);
//     }
//   };

//   const handleGenerate = async () => {
//     if (!selectedRoom) {
//       setError("Please select a room type");
//       return;
//     }
//     if (!selectedStyle && !customPrompt.trim()) {
//       setError("Please select a style or enter a custom prompt");
//       return;
//     }
//     if (checkAttemptLimit()) return;
//     incrementGlobalAttempt();
//     await executeGeneration();
//   };

//   const executeGeneration = async () => {
//     setIsGenerating(true);
//     setError("");
//     setSuccess("");
//     setProgress(0);
//     try {
//       setProgress(10);
//       const result = await generateDesign(
//         selectedRoom,
//         selectedStyle,
//         customPrompt,
//         clientName,
//       );
//       setProgress(50);
//       if (!result.success)
//         throw new Error(result.error || "Failed to generate");
//       setProgress(80);
//       const processedImages = [
//         {
//           id: result.images[0].id || Date.now(),
//           url:
//             result.images[0].image_url ||
//             result.images[0].cloudinary_url ||
//             `data:image/png;base64,${result.images[0].image_base64}`,
//           cloudinaryUrl:
//             result.images[0].image_url || result.images[0].cloudinary_url,
//           style: result.images[0].style || selectedStyle || "custom",
//           roomType: result.images[0].room_type || selectedRoom,
//           timestamp: Date.now(),
//         },
//       ];
//       const newHistory = [...processedImages, ...imageHistory];
//       setImageHistory(newHistory);
//       setShowBeforePreview(false);
//       try {
//         const lightweightHistory = newHistory
//           .slice(0, 20)
//           .map((img) => ({
//             id: img.id,
//             url:
//               img.cloudinaryUrl ||
//               (img.url.startsWith("http") ? img.url : null),
//             style: img.style,
//             roomType: img.roomType,
//             timestamp: img.timestamp,
//           }))
//           .filter((img) => img.url && img.url.startsWith("http"));
//         sessionStorage.setItem(
//           "imageHistory",
//           JSON.stringify(lightweightHistory),
//         );
//       } catch (error) {
//         sessionStorage.clear();
//       }
//       setSelectedImageIndex(0);
//       setProgress(100);
//     } catch (err) {
//       console.error("[APP] Generation error:", err);
//       setError(err.message || "Failed to generate design. Please try again.");
//       setProgress(0);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const downloadImage = async (image, index) => {
//     try {
//       if (image.url.startsWith("http")) {
//         const response = await fetch(image.url);
//         const blob = await response.blob();
//         const blobUrl = URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = blobUrl;
//         link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(blobUrl);
//         setSuccess("✅ Image downloaded successfully!");
//       } else {
//         const link = document.createElement("a");
//         link.href = image.url;
//         link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         setSuccess("✅ Image downloaded successfully!");
//       }
//     } catch (error) {
//       console.error("[APP] Download error:", error);
//       setError("❌ Failed to download image. Please try again.");
//     }
//   };

//   const [virtualTourInitialPlace, setVirtualTourInitialPlace] = useState(null);
//   const [virtualTourInitialMode, setVirtualTourInitialMode] = useState("map");
//   const [virtualTourInitialCategory, setVirtualTourInitialCategory] =
//     useState("dining");

//   const handleBackToDefault = () => {
//     if (currentView === "virtualTour") logToolUsage("virtual_tour");
//     if (currentView === "scenario") logToolUsage("lifeecho");
//     if (currentView === "default") logToolUsage("room_design");
//     setCurrentView("default");
//     setSelectedPreviewScenario(null);
//     setVirtualTourInitialPlace(null);
//     setVirtualTourInitialMode("map");
//     setVirtualTourInitialCategory("dining");
//   };

//   const handleTabClick = (tabId) => {
//     if (currentView === tabId) return;

//     if (currentView === "virtualTour") logToolUsage("virtual_tour");
//     if (currentView === "scenario") logToolUsage("lifeecho");
//     if (currentView === "default") logToolUsage("room_design");

//     if (tabId === "default") {
//       setCurrentView("default");
//       setSelectedPreviewScenario(null);
//       setVirtualTourInitialPlace(null);
//       setVirtualTourInitialMode("map");
//       setVirtualTourInitialCategory("dining");
//       return;
//     }

//     if (checkAttemptLimit()) return;
//     incrementGlobalAttempt();

//     if (tabId === "scenario") {
//       setSelectedPreviewScenario(null);
//       setCurrentView("scenario");
//     } else if (tabId === "virtualTour") {
//       setVirtualTourInitialPlace(null);
//       setVirtualTourInitialMode("map");
//       setVirtualTourInitialCategory("dining");
//       setCurrentView("virtualTour");
//     }
//   };

//   const shouldShowBefore = showBeforePreview || imageHistory.length === 0;

//   return (
//     <div
//       style={{
//         width: "100vw",
//         height: "100vh",
//         background: "white",
//         display: "flex",
//         flexDirection: "column",
//         padding: "1rem",
//         boxSizing: "border-box",
//       }}
//     >
//       {/* MAIN SECTION */}
//       <div
//         style={{
//           flex: "0 0 58%",
//           background: "#F8F5EF",
//           borderRadius: "20px",
//           padding: "1.25rem",
//           display: "flex",
//           flexDirection: "column",
//           gap: "1rem",
//           boxSizing: "border-box",
//           overflow: "hidden",
//         }}
//       >
//         {/* TOP NAV TABS */}
//         <div
//           style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}
//         >
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "16px",
//               padding: "10px",
//               border: "1px solid #F3EEE5",
//               borderRadius: "10px",
//               background: "white",
//               boxSizing: "border-box",
//             }}
//           >
//             {NAV_TABS.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => handleTabClick(tab.id)}
//                 style={{
//                   padding: "0.5rem 1.1rem",
//                   borderRadius: "8px",
//                   border: "none",
//                   background:
//                     currentView === tab.id ? "#101C34" : "transparent",
//                   color: currentView === tab.id ? "white" : "#6b7280",
//                   fontSize: "0.9rem",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* CONTENT ROW */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             gap: "1.25rem",
//             boxSizing: "border-box",
//             overflow: "hidden",
//           }}
//         >
//           {currentView === "scenario" && (
//             <div style={{ flex: 1, overflow: "hidden" }}>
//               <LifeEcho
//                 onBack={handleBackToDefault}
//                 initialScenario={selectedPreviewScenario}
//                 onAttempt={checkAttemptLimit}
//                 onAttemptUsed={incrementGlobalAttempt}
//               />
//             </div>
//           )}
//           {currentView === "virtualTour" && (
//             <div style={{ flex: 1, overflow: "hidden" }}>
//               <VirtualTour
//                 onBack={handleBackToDefault}
//                 isEmbedded={true}
//                 initialPlace={virtualTourInitialPlace}
//                 initialMode={virtualTourInitialMode}
//                 initialCategory={virtualTourInitialCategory}
//                 onAttempt={checkAttemptLimit}
//                 onAttemptUsed={incrementGlobalAttempt}
//               />
//             </div>
//           )}

//           {currentView === "default" && (
//             <>
//               {/* LEFT — Room Design (ref for visibility tracking) */}
//               <div
//                 ref={roomDesignRef}
//                 style={{
//                   width: "48%",
//                   flexShrink: 0,
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "0.75rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     background: "white",
//                     borderRadius: "16px",
//                     padding: "1rem",
//                     boxSizing: "border-box",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* FLAT TYPE */}
//                   <div
//                     style={{
//                       marginBottom: "0.7rem",
//                       display: "flex",
//                       alignItems: "flex-start",
//                       gap: "0.5rem",
//                     }}
//                   >
//                     <Building
//                       size={20}
//                       color="#1f2937"
//                       style={{ marginTop: "0.55rem", flexShrink: 0 }}
//                     />
//                     <div
//                       style={{
//                         display: "flex",
//                         flexWrap: "wrap",
//                         gap: "0.5rem",
//                         flex: 1,
//                         minWidth: 0,
//                       }}
//                     >
//                       {FLAT_TYPES.map((flat) => (
//                         <button
//                           key={flat.id}
//                           onClick={() => setSelectedFlatType(flat.id)}
//                           style={{
//                             padding: "0.55rem 0.9rem",
//                             borderRadius: "8px",
//                             border:
//                               selectedFlatType === flat.id
//                                 ? "2px solid #C9A253"
//                                 : "1px solid #e5e7eb",
//                             background:
//                               selectedFlatType === flat.id
//                                 ? "#C9A253"
//                                 : "white",
//                             cursor: "pointer",
//                             fontSize: "0.88rem",
//                             fontWeight: "500",
//                             color:
//                               selectedFlatType === flat.id
//                                 ? "white"
//                                 : "#6b7280",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {flat.name}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* ROOMS */}
//                   <div
//                     style={{
//                       marginBottom: "0.7rem",
//                       display: "flex",
//                       alignItems: "flex-start",
//                       gap: "0.5rem",
//                     }}
//                   >
//                     <Home
//                       size={20}
//                       color="#1f2937"
//                       style={{ marginTop: "0.55rem", flexShrink: 0 }}
//                     />
//                     <div
//                       style={{
//                         display: "flex",
//                         flexWrap: "wrap",
//                         gap: "0.5rem",
//                         flex: 1,
//                         minWidth: 0,
//                       }}
//                     >
//                       {ROOMS.map((room) => {
//                         const Icon = room.icon;
//                         return (
//                           <button
//                             key={room.id}
//                             onClick={() => {
//                               setSelectedRoom(room.id);
//                               loadRoomPreview(room.id);
//                             }}
//                             style={{
//                               padding: "0.55rem 0.9rem",
//                               borderRadius: "8px",
//                               border:
//                                 selectedRoom === room.id
//                                   ? "2px solid #C9A253"
//                                   : "1px solid #e5e7eb",
//                               background:
//                                 selectedRoom === room.id ? "#C9A253" : "white",
//                               cursor: "pointer",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "0.4rem",
//                               fontSize: "0.88rem",
//                               fontWeight: "500",
//                               color:
//                                 selectedRoom === room.id ? "white" : "#6b7280",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <Icon size={16} />
//                             <span>{room.name}</span>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* STYLES + OR + textarea */}
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-start",
//                       gap: "0.5rem",
//                     }}
//                   >
//                     <Palette
//                       size={20}
//                       color="#1f2937"
//                       style={{ marginTop: "0.55rem", flexShrink: 0 }}
//                     />
//                     <div
//                       style={{
//                         display: "flex",
//                         flexWrap: "wrap",
//                         gap: "0.5rem",
//                         flex: 1,
//                         minWidth: 0,
//                       }}
//                     >
//                       {STYLES.map((style) => {
//                         const StyleIcon = style.icon;
//                         return (
//                           <button
//                             key={style.id}
//                             onClick={() => {
//                               setSelectedStyle(style.id);
//                               setCustomPrompt("");
//                             }}
//                             style={{
//                               padding: "0.55rem 0.9rem",
//                               borderRadius: "8px",
//                               border:
//                                 selectedStyle === style.id
//                                   ? "2px solid #C9A253"
//                                   : "1px solid #e5e7eb",
//                               background:
//                                 selectedStyle === style.id
//                                   ? "#C9A253"
//                                   : "white",
//                               cursor: "pointer",
//                               fontSize: "0.88rem",
//                               fontWeight: "500",
//                               color:
//                                 selectedStyle === style.id
//                                   ? "white"
//                                   : "#6b7280",
//                               display: "flex",
//                               alignItems: "center",
//                               gap: "0.4rem",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             <StyleIcon size={15} />
//                             {style.name}
//                           </button>
//                         );
//                       })}
//                       <div style={{ width: "100%" }}>
//                         <div
//                           style={{
//                             textAlign: "center",
//                             color: "#9ca3af",
//                             fontWeight: "600",
//                             margin: "0.3rem 0",
//                             fontSize: "0.75rem",
//                           }}
//                         >
//                           OR
//                         </div>
//                         <textarea
//                           value={customPrompt}
//                           onChange={(e) => {
//                             setCustomPrompt(e.target.value);
//                             if (e.target.value.trim()) setSelectedStyle("");
//                           }}
//                           placeholder="Describe your style (e.g., Space theme kids room...)"
//                           style={{
//                             width: "100%",
//                             padding: "0.55rem",
//                             border: customPrompt.trim()
//                               ? "2px solid #9333ea"
//                               : "1px solid #e5e7eb",
//                             borderRadius: "6px",
//                             resize: "none",
//                             height: "2.8rem",
//                             fontSize: "0.8rem",
//                             outline: "none",
//                             fontFamily: "inherit",
//                             boxSizing: "border-box",
//                             color: "#374151",
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleGenerate}
//                   disabled={isGenerating || apiStatus === "disconnected"}
//                   style={{
//                     width: "100%",
//                     background:
//                       isGenerating || apiStatus === "disconnected"
//                         ? "#d1d5db"
//                         : "#101C34",
//                     color: "white",
//                     padding: "0.75rem",
//                     borderRadius: "10px",
//                     fontWeight: "600",
//                     fontSize: "0.95rem",
//                     border: "none",
//                     cursor:
//                       isGenerating || apiStatus === "disconnected"
//                         ? "not-allowed"
//                         : "pointer",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "0.5rem",
//                   }}
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Loader2
//                         size={18}
//                         style={{ animation: "spin 1s linear infinite" }}
//                       />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles size={18} />
//                       Generate Design
//                     </>
//                   )}
//                 </button>
//               </div>

//               {/* RIGHT: image panel */}
//               <div
//                 style={{
//                   flex: 1,
//                   background: "white",
//                   borderRadius: "16px",
//                   overflow: "hidden",
//                   display: "flex",
//                   flexDirection: "column",
//                   position: "relative",
//                 }}
//               >
//                 {shouldShowBefore ? (
//                   loadingPreview ? (
//                     <div
//                       style={{
//                         flex: 1,
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "0.75rem",
//                       }}
//                     >
//                       <Loader2
//                         size={36}
//                         color="#9333ea"
//                         style={{ animation: "spin 1s linear infinite" }}
//                       />
//                       <p
//                         style={{
//                           color: "#9ca3af",
//                           fontSize: "0.875rem",
//                           margin: 0,
//                         }}
//                       >
//                         Loading room preview...
//                       </p>
//                     </div>
//                   ) : roomPreviewImage ? (
//                     <div
//                       style={{
//                         position: "relative",
//                         flex: 1,
//                         overflow: "hidden",
//                       }}
//                     >
//                       <img
//                         src={roomPreviewImage}
//                         alt="Room reference"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           objectPosition: "center",
//                           display: "block",
//                           filter: "brightness(0.93)",
//                         }}
//                       />
//                       {isGenerating && (
//                         <div
//                           style={{
//                             position: "absolute",
//                             inset: 0,
//                             background: "rgba(255,255,255,0.72)",
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: "0.75rem",
//                             backdropFilter: "blur(3px)",
//                             zIndex: 10,
//                           }}
//                         >
//                           <Loader2
//                             size={42}
//                             color="#9333ea"
//                             style={{ animation: "spin 1s linear infinite" }}
//                           />
//                           <p
//                             style={{
//                               color: "#9333ea",
//                               fontWeight: "600",
//                               fontSize: "0.95rem",
//                               margin: 0,
//                             }}
//                           >
//                             Generating your design...
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div
//                       style={{
//                         flex: 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <div style={{ textAlign: "center" }}>
//                         <svg
//                           width="56"
//                           height="56"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="#9ca3af"
//                           strokeWidth="1.5"
//                           style={{ margin: "0 auto 1rem", display: "block" }}
//                         >
//                           <rect
//                             x="3"
//                             y="3"
//                             width="18"
//                             height="18"
//                             rx="2"
//                             ry="2"
//                           />
//                           <circle cx="8.5" cy="8.5" r="1.5" />
//                           <polyline points="21 15 16 10 5 21" />
//                         </svg>
//                         <p
//                           style={{
//                             color: "#9ca3af",
//                             fontSize: "0.95rem",
//                             marginBottom: "0.4rem",
//                             fontWeight: "500",
//                             textAlign: "center",
//                           }}
//                         >
//                           The generated image will be displayed
//                         </p>
//                         <p
//                           style={{
//                             color: "#9ca3af",
//                             fontSize: "0.95rem",
//                             marginBottom: "0.4rem",
//                             fontWeight: "500",
//                             textAlign: "center",
//                           }}
//                         >
//                           in this section after processing.
//                         </p>
//                       </div>
//                     </div>
//                   )
//                 ) : (
//                   <div
//                     style={{
//                       position: "relative",
//                       flex: 1,
//                       overflow: "hidden",
//                     }}
//                   >
//                     <img
//                       src={imageHistory[selectedImageIndex].url}
//                       alt="Design"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "cover",
//                         objectPosition: "center",
//                         display: "block",
//                       }}
//                     />
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: "1rem",
//                         right: "1rem",
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "0.4rem",
//                         zIndex: 5,
//                       }}
//                     >
//                       {imageHistory.slice(0, 6).map((img, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => setSelectedImageIndex(idx)}
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             border:
//                               selectedImageIndex === idx
//                                 ? "2px solid #3b82f6"
//                                 : "2px solid white",
//                             borderRadius: "8px",
//                             overflow: "hidden",
//                             cursor: "pointer",
//                             padding: 0,
//                             background: "none",
//                             boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//                             flexShrink: 0,
//                           }}
//                         >
//                           <img
//                             src={img.url}
//                             alt=""
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         </button>
//                       ))}
//                     </div>
//                     {isGenerating && (
//                       <div
//                         style={{
//                           position: "absolute",
//                           inset: 0,
//                           background: "rgba(255,255,255,0.72)",
//                           display: "flex",
//                           flexDirection: "column",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: "0.75rem",
//                           backdropFilter: "blur(3px)",
//                           zIndex: 10,
//                         }}
//                       >
//                         <Loader2
//                           size={42}
//                           color="#9333ea"
//                           style={{ animation: "spin 1s linear infinite" }}
//                         />
//                         <p
//                           style={{
//                             color: "#9333ea",
//                             fontWeight: "600",
//                             fontSize: "0.95rem",
//                             margin: 0,
//                           }}
//                         >
//                           Generating your design...
//                         </p>
//                       </div>
//                     )}
//                     <button
//                       onClick={() =>
//                         downloadImage(
//                           imageHistory[selectedImageIndex],
//                           selectedImageIndex,
//                         )
//                       }
//                       style={{
//                         position: "absolute",
//                         bottom: "1rem",
//                         right: "1rem",
//                         background: "white",
//                         color: "#1f2937",
//                         padding: "0.65rem",
//                         borderRadius: "50%",
//                         border: "none",
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: "44px",
//                         height: "44px",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//                         zIndex: 10,
//                       }}
//                     >
//                       <Download size={20} />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <RegistrationModal
//         isOpen={showRegistrationModal}
//         onClose={() => {
//           if (isRegistered) setShowRegistrationModal(false);
//         }}
//         onSuccess={handleRegistrationSuccess}
//         generatedCount={generationCount}
//         sessionId={sessionId}
//         selectedFlatType={selectedFlatType}
//       />

//       <style>{`
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         * { box-sizing: border-box; }
//         ::-webkit-scrollbar { width: 4px; height: 4px; }
//         ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
//         ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>
//     </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Palette,
  Download,
  Home,
  Building,
  Loader2,
} from "lucide-react";
import { generateDesign, checkHealth, checkSession } from "../services/api";
import RegistrationModal from "../components/modals/RegistrationModal";
import LifeEcho from "../features/life-echo/LifeEcho";
import VirtualTour from "../features/virtual-tour/VirtualTour";
import {
  logToolUsage,
  createVisibilityTracker,
} from "../utils/activityTracker";
import {
  ROOMS,
  STYLES,
  FLAT_TYPES,
  NAV_TABS,
} from "../constants/designOptions";
import "./HomePage.css";

const HomePage = () => {
  const [currentView, setCurrentView] = useState("default");
  const [selectedPreviewScenario, setSelectedPreviewScenario] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const clientName = urlParams.get("client") || "skyline";

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const [progress, setProgress] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const roomDesignRef = useRef(null);

  const [roomPreviewImage, setRoomPreviewImage] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showBeforePreview, setShowBeforePreview] = useState(false);
  const [selectedFlatType, setSelectedFlatType] = useState("");

  const [roomPreviewCache, setRoomPreviewCache] = useState({});
  const getGlobalAttemptCount = () =>
    parseInt(sessionStorage.getItem("globalAttemptCount") || "0", 10);

  const incrementGlobalAttempt = () => {
    const next = getGlobalAttemptCount() + 1;
    sessionStorage.setItem("globalAttemptCount", next.toString());
    return next;
  };

  const checkAttemptLimit = () => {
    if (isRegistered) return false;
    const count = getGlobalAttemptCount();
    if (count >= 2) {
      setShowRegistrationModal(true);
      setError(
        "⚠️ You've used your 2 free attempts. Please register to continue.",
      );
      return true;
    }
    return false;
  };

  useEffect(() => {
    const initializeApp = async () => {
      sessionStorage.removeItem("tracking_start_time");
      try {
        const health = await checkHealth();
        setApiStatus(
          health.status === "healthy" ? "connected" : "disconnected",
        );
      } catch (error) {
        setApiStatus("disconnected");
      }

      let currentSessionId = sessionStorage.getItem("sessionId");
      if (!currentSessionId) {
        currentSessionId =
          "web-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem("sessionId", currentSessionId);
      }
      setSessionId(currentSessionId);

      try {
        const savedHistory = sessionStorage.getItem("imageHistory");
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          setImageHistory(parsedHistory);
          setSelectedImageIndex(0);
        }
      } catch (error) {
        console.error("[APP] Error restoring image history:", error);
        sessionStorage.removeItem("imageHistory");
      }

      const registeredEmail = localStorage.getItem("userEmail");
      const registeredName = localStorage.getItem("userName");
      const registeredPhone = localStorage.getItem("userPhone");

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

  // ✅ Visibility tracking for the room design panel only
  useEffect(() => {
    const roomObserver = createVisibilityTracker("room_design", roomDesignRef);
    return () => {
      roomObserver.disconnect();
    };
  }, []);

  // ✅ Log all tools when user closes/leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      logToolUsage("room_design");
      logToolUsage("virtual_tour");
      logToolUsage("lifeecho");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ✅ Auto-resize: tell the parent embed page our real rendered height
  useEffect(() => {
    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "propdeck-resize", height }, "*");
    };
    sendHeight();
    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);
    window.addEventListener("resize", sendHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", sendHeight);
    };
  }, [currentView]);

  useEffect(() => {
    const preloadAllRooms = async () => {
      const cache = {};
      await Promise.all(
        ROOMS.map(async (room) => {
          try {
            const res = await fetch(
              `https://interior-backend-production.up.railway.app/api/room-preview/${clientName}/${room.id}`,
            );
            const data = await res.json();
            if (data.success) {
              cache[room.id] = `data:image/png;base64,${data.image_base64}`;
            }
          } catch (err) {
            console.error(`[APP] Failed to preload ${room.id}:`, err);
          }
        }),
      );
      setRoomPreviewCache(cache);
    };
    preloadAllRooms();
  }, [clientName]);

  useEffect(() => {
    if (currentView === "default" && sessionId && !isRegistered)
      checkServerGenerationCount(sessionId);
  }, [currentView]);

  const checkServerGenerationCount = async (sessionId) => {
    try {
      const data = await checkSession(sessionId);
      if (data.success) {
        setGenerationCount(data.generation_count || 0);
        if (data.is_registered) {
          setIsRegistered(true);
          setUserEmail(data.email || "");
          localStorage.setItem("userEmail", data.email || "");
        }
      }
    } catch (error) {
      setGenerationCount(
        parseInt(localStorage.getItem("generationCount") || "0", 10),
      );
    }
  };

  const loadRoomPreview = async (roomId) => {
    setShowBeforePreview(true);
    if (roomPreviewCache[roomId]) {
      setRoomPreviewImage(roomPreviewCache[roomId]);
      return;
    }
    setLoadingPreview(true);
    setRoomPreviewImage(null);
    try {
      const res = await fetch(
        `https://interior-backend-production.up.railway.app/api/room-preview/${clientName}/${roomId}`,
      );
      const data = await res.json();
      if (data.success) {
        const img = `data:image/png;base64,${data.image_base64}`;
        setRoomPreviewCache((prev) => ({ ...prev, [roomId]: img }));
        setRoomPreviewImage(img);
      }
    } catch (err) {
      console.error("[APP] Failed to load room preview:", err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleRegistrationSuccess = async (data) => {
    localStorage.setItem("userEmail", data.email);
    localStorage.setItem("userName", data.name);
    localStorage.setItem("userPhone", data.phone);
    localStorage.setItem("userId", data.user_id);
    localStorage.removeItem("generationCount");
    setIsRegistered(true);
    sessionStorage.removeItem("globalAttemptCount");
    setGenerationCount(0);
    setUserEmail(data.email);
    setShowRegistrationModal(false);
    setError("");
    setSuccess("🎉 Registration complete! You now have unlimited access.");
    try {
      await fetch(
        "https://interior-backend-production.up.railway.app/api/activity/link-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            user_id: data.user_id,
          }),
        },
      );
    } catch (err) {
      console.error("[APP] Session link failed:", err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedRoom) {
      setError("Please select a room type");
      return;
    }
    if (!selectedStyle && !customPrompt.trim()) {
      setError("Please select a style or enter a custom prompt");
      return;
    }
    if (checkAttemptLimit()) return;
    incrementGlobalAttempt();
    await executeGeneration();
  };

  const executeGeneration = async () => {
    setIsGenerating(true);
    setError("");
    setSuccess("");
    setProgress(0);
    try {
      setProgress(10);
      const result = await generateDesign(
        selectedRoom,
        selectedStyle,
        customPrompt,
        clientName,
      );
      setProgress(50);
      if (!result.success)
        throw new Error(result.error || "Failed to generate");
      setProgress(80);
      const processedImages = [
        {
          id: result.images[0].id || Date.now(),
          url:
            result.images[0].image_url ||
            result.images[0].cloudinary_url ||
            `data:image/png;base64,${result.images[0].image_base64}`,
          cloudinaryUrl:
            result.images[0].image_url || result.images[0].cloudinary_url,
          style: result.images[0].style || selectedStyle || "custom",
          roomType: result.images[0].room_type || selectedRoom,
          timestamp: Date.now(),
        },
      ];
      const newHistory = [...processedImages, ...imageHistory];
      setImageHistory(newHistory);
      setShowBeforePreview(false);
      try {
        const lightweightHistory = newHistory
          .slice(0, 20)
          .map((img) => ({
            id: img.id,
            url:
              img.cloudinaryUrl ||
              (img.url.startsWith("http") ? img.url : null),
            style: img.style,
            roomType: img.roomType,
            timestamp: img.timestamp,
          }))
          .filter((img) => img.url && img.url.startsWith("http"));
        sessionStorage.setItem(
          "imageHistory",
          JSON.stringify(lightweightHistory),
        );
      } catch (error) {
        sessionStorage.clear();
      }
      setSelectedImageIndex(0);
      setProgress(100);
    } catch (err) {
      console.error("[APP] Generation error:", err);
      setError(err.message || "Failed to generate design. Please try again.");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (image, index) => {
    try {
      if (image.url.startsWith("http")) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        setSuccess("✅ Image downloaded successfully!");
      } else {
        const link = document.createElement("a");
        link.href = image.url;
        link.download = `design-${image.roomType}-${image.style}-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSuccess("✅ Image downloaded successfully!");
      }
    } catch (error) {
      console.error("[APP] Download error:", error);
      setError("❌ Failed to download image. Please try again.");
    }
  };

  const [virtualTourInitialPlace, setVirtualTourInitialPlace] = useState(null);
  const [virtualTourInitialMode, setVirtualTourInitialMode] = useState("map");
  const [virtualTourInitialCategory, setVirtualTourInitialCategory] =
    useState("dining");

  const handleBackToDefault = () => {
    if (currentView === "virtualTour") logToolUsage("virtual_tour");
    if (currentView === "scenario") logToolUsage("lifeecho");
    if (currentView === "default") logToolUsage("room_design");
    setCurrentView("default");
    setSelectedPreviewScenario(null);
    setVirtualTourInitialPlace(null);
    setVirtualTourInitialMode("map");
    setVirtualTourInitialCategory("dining");
  };

  const handleTabClick = (tabId) => {
    if (currentView === tabId) return;

    if (currentView === "virtualTour") logToolUsage("virtual_tour");
    if (currentView === "scenario") logToolUsage("lifeecho");
    if (currentView === "default") logToolUsage("room_design");

    if (tabId === "default") {
      setCurrentView("default");
      setSelectedPreviewScenario(null);
      setVirtualTourInitialPlace(null);
      setVirtualTourInitialMode("map");
      setVirtualTourInitialCategory("dining");
      return;
    }

    if (checkAttemptLimit()) return;
    incrementGlobalAttempt();

    if (tabId === "scenario") {
      setSelectedPreviewScenario(null);
      setCurrentView("scenario");
    } else if (tabId === "virtualTour") {
      setVirtualTourInitialPlace(null);
      setVirtualTourInitialMode("map");
      setVirtualTourInitialCategory("dining");
      setCurrentView("virtualTour");
    }
  };

  const shouldShowBefore = showBeforePreview || imageHistory.length === 0;

  // ---- Shared button style builder (tightened Figma sizing) ----
  const pillButtonStyle = (active) => ({
    padding: "0.4rem 0.65rem",
    borderRadius: "8px",
    border: active ? "2px solid #C9A253" : "1px solid #e5e7eb",
    background: active ? "#C9A253" : "white",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: "500",
    color: active ? "white" : "#6b7280",
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    whiteSpace: "nowrap",
    lineHeight: 1.2,
  });

  return (
    // OUTER CARD — fixed to Figma's 1240 x 642, scales down on small screens via maxWidth
    <div
      style={{
        width: "1240px",
        maxWidth: "100%",
        height: "642px",
        margin: "0 auto",
        background: "#F8F5EF",
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* TOP NAV TABS */}
      <div
        style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            padding: "10px",
            border: "1px solid #F3EEE5",
            borderRadius: "10px",
            background: "white",
            boxSizing: "border-box",
          }}
        >
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "8px",
                border: "none",
                background: currentView === tab.id ? "#101C34" : "transparent",
                color: currentView === tab.id ? "white" : "#6b7280",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT ROW — 600px left panel + 24px gap + 568px image, fills remaining height */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: "24px",
          boxSizing: "border-box",
          minHeight: 0,
        }}
      >
        {currentView === "scenario" && (
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <LifeEcho
              onBack={handleBackToDefault}
              initialScenario={selectedPreviewScenario}
              onAttempt={checkAttemptLimit}
              onAttemptUsed={incrementGlobalAttempt}
            />
          </div>
        )}
        {currentView === "virtualTour" && (
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <VirtualTour
              onBack={handleBackToDefault}
              isEmbedded={true}
              initialPlace={virtualTourInitialPlace}
              initialMode={virtualTourInitialMode}
              initialCategory={virtualTourInitialCategory}
              onAttempt={checkAttemptLimit}
              onAttemptUsed={incrementGlobalAttempt}
            />
          </div>
        )}

        {currentView === "default" && (
          <>
            {/* LEFT — fixed 600 x 421 */}
            <div
              ref={roomDesignRef}
              style={{
                width: "600px",
                height: "421px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: "11px",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1rem",
                  boxSizing: "border-box",
                  overflow: "auto",
                }}
              >
                {/* FLAT TYPE */}
                <div
                  style={{
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <Building
                    size={18}
                    color="#1f2937"
                    style={{ marginTop: "0.4rem", flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {FLAT_TYPES.map((flat) => (
                      <button
                        key={flat.id}
                        onClick={() => setSelectedFlatType(flat.id)}
                        style={pillButtonStyle(selectedFlatType === flat.id)}
                      >
                        {flat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ROOMS */}
                <div
                  style={{
                    marginBottom: "1.25rem",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <Home
                    size={18}
                    color="#1f2937"
                    style={{ marginTop: "0.4rem", flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {ROOMS.map((room) => {
                      const Icon = room.icon;
                      return (
                        <button
                          key={room.id}
                          onClick={() => {
                            setSelectedRoom(room.id);
                            loadRoomPreview(room.id);
                          }}
                          style={pillButtonStyle(selectedRoom === room.id)}
                        >
                          <Icon size={14} />
                          <span>{room.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STYLES + OR + textarea */}
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}
                >
                  <Palette
                    size={18}
                    color="#1f2937"
                    style={{ marginTop: "1rem", flexShrink: 0 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1rem",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {STYLES.map((style) => {
                      const StyleIcon = style.icon;
                      return (
                        <button
                          key={style.id}
                          onClick={() => {
                            setSelectedStyle(style.id);
                            setCustomPrompt("");
                          }}
                          style={pillButtonStyle(selectedStyle === style.id)}
                        >
                          <StyleIcon size={13} />
                          {style.name}
                        </button>
                      );
                    })}
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          textAlign: "center",
                          color: "#9ca3af",
                          fontWeight: "600",
                          margin: "0.3rem 0",
                          fontSize: "0.72rem",
                        }}
                      >
                        OR
                      </div>
                      <textarea
                        value={customPrompt}
                        onChange={(e) => {
                          setCustomPrompt(e.target.value);
                          if (e.target.value.trim()) setSelectedStyle("");
                        }}
                        placeholder="Describe your style (e.g., Space theme kids room...)"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: customPrompt.trim()
                            ? "2px solid #9333ea"
                            : "1px solid #e5e7eb",
                          borderRadius: "6px",
                          resize: "none",
                          height: "2.4rem",
                          fontSize: "0.78rem",
                          outline: "none",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                          color: "#374151",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || apiStatus === "disconnected"}
                style={{
                  width: "100%",
                  background:
                    isGenerating || apiStatus === "disconnected"
                      ? "#d1d5db"
                      : "#101C34",
                  color: "white",
                  padding: "0.65rem",
                  borderRadius: "10px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  border: "none",
                  cursor:
                    isGenerating || apiStatus === "disconnected"
                      ? "not-allowed"
                      : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  flexShrink: 0,
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Design
                  </>
                )}
              </button>
            </div>

            {/* RIGHT — fixed 568px width, height matches left column via flex stretch */}
            <div
              style={{
                width: "568px",
                flexShrink: 0,
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {shouldShowBefore ? (
                loadingPreview ? (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <Loader2
                      size={36}
                      color="#9333ea"
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: "0.875rem",
                        margin: 0,
                      }}
                    >
                      Loading room preview...
                    </p>
                  </div>
                ) : roomPreviewImage ? (
                  <div
                    style={{
                      position: "relative",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={roomPreviewImage}
                      alt="Room reference"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                        filter: "brightness(0.93)",
                      }}
                    />
                    {isGenerating && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "rgba(255,255,255,0.72)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.75rem",
                          backdropFilter: "blur(3px)",
                          zIndex: 10,
                        }}
                      >
                        <Loader2
                          size={42}
                          color="#9333ea"
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                        <p
                          style={{
                            color: "#9333ea",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                            margin: 0,
                          }}
                        >
                          Generating your design...
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="1.5"
                        style={{ margin: "0 auto 1rem", display: "block" }}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: "0.95rem",
                          marginBottom: "0.4rem",
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                      >
                        The generated image will be displayed
                      </p>
                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: "0.95rem",
                          marginBottom: "0.4rem",
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                      >
                        in this section after processing.
                      </p>
                    </div>
                  </div>
                )
              ) : (
                <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
                  <img
                    src={imageHistory[selectedImageIndex].url}
                    alt="Design"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      zIndex: 5,
                    }}
                  >
                    {imageHistory.slice(0, 6).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        style={{
                          width: "40px",
                          height: "40px",
                          border:
                            selectedImageIndex === idx
                              ? "2px solid #3b82f6"
                              : "2px solid white",
                          borderRadius: "8px",
                          overflow: "hidden",
                          cursor: "pointer",
                          padding: 0,
                          background: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={img.url}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  {isGenerating && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(255,255,255,0.72)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        backdropFilter: "blur(3px)",
                        zIndex: 10,
                      }}
                    >
                      <Loader2
                        size={42}
                        color="#9333ea"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      <p
                        style={{
                          color: "#9333ea",
                          fontWeight: "600",
                          fontSize: "0.95rem",
                          margin: 0,
                        }}
                      >
                        Generating your design...
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      downloadImage(
                        imageHistory[selectedImageIndex],
                        selectedImageIndex,
                      )
                    }
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      background: "white",
                      color: "#1f2937",
                      padding: "0.65rem",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "44px",
                      height: "44px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      zIndex: 10,
                    }}
                  >
                    <Download size={20} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => {
          if (isRegistered) setShowRegistrationModal(false);
        }}
        onSuccess={handleRegistrationSuccess}
        generatedCount={generationCount}
        sessionId={sessionId}
        selectedFlatType={selectedFlatType}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default HomePage;
