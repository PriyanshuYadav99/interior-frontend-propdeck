// import React, { useState, useEffect } from "react";
// import {
//   ChevronLeft,
//   Sparkles,
//   X,
//   Loader2,
//   AlertCircle,
//   Clock,
//   VolumeX,
//   Shield,
//   Home,
//   Building,
//   Grid3x3,
// } from "lucide-react";
// import {
//   logLifeEchoSelection,
//   logToolUsage,
// } from "../../utils/activityTracker";
// import { API_BASE_URL } from "../../config/env";

// const generateScenario = async (text) => {
//   const response = await fetch(`${API_BASE_URL}/api/scenario/generate`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ scenario_text: text }),
//   });
//   if (!response.ok) throw new Error("Failed to generate scenario");
//   return await response.json();
// };

// const getRandomScenarios = async () => {
//   const response = await fetch(`${API_BASE_URL}/api/scenario/random`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });
//   if (!response.ok) throw new Error("Failed to fetch scenarios");
//   return await response.json();
// };

// const iconMap = {
//   clock: Clock,
//   volume: VolumeX,
//   shield: Shield,
//   home: Home,
//   building: Building,
// };

// const imageCache = new Map();

// const getScenarioImages = async (title, text) => {
//   const cacheKey = (title || "").trim().toLowerCase();
//   if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);
//   const params = new URLSearchParams({
//     title: title || "",
//     text: (text || "").slice(0, 600),
//   });
//   const response = await fetch(`${API_BASE_URL}/api/scenario/images?${params}`);
//   if (!response.ok) throw new Error("Failed to fetch images");
//   const data = await response.json();
//   const images = data.images || [];
//   if (images.length) imageCache.set(cacheKey, images);
//   return images;
// };

// const ImageGallery = ({ images, loading }) => {
//   const [failed, setFailed] = useState([]);
//   const visible = images.filter((_, i) => !failed.includes(i));
//   const markFailed = (i) => setFailed((f) => [...f, i]);

//   if (loading) {
//     return (
//       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//         <div style={{ height: 240, borderRadius: 12, background: "#e5e7eb", animation: "pulse 1.4s ease-in-out infinite" }} />
//         <div style={{ display: "flex", gap: 10 }}>
//           <div style={{ flex: 1, height: 110, borderRadius: 10, background: "#e5e7eb", animation: "pulse 1.4s ease-in-out infinite" }} />
//           <div style={{ flex: 1, height: 110, borderRadius: 10, background: "#e5e7eb", animation: "pulse 1.4s ease-in-out infinite" }} />
//         </div>
//       </div>
//     );
//   }
//   if (!visible.length) return null;

//   const [main, ...rest] = visible;
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//       <img
//         src={main.url}
//         alt={main.alt}
//         loading="lazy"
//         onError={() => markFailed(images.indexOf(main))}
//         style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 12, border: "1px solid #e2e8f0" }}
//       />
//       {rest.length > 0 && (
//         <div style={{ display: "flex", gap: 10 }}>
//           {rest.slice(0, 2).map((img) => (
//             <img
//               key={img.url}
//               src={img.thumb}
//               alt={img.alt}
//               loading="lazy"
//               onError={() => markFailed(images.indexOf(img))}
//               style={{ flex: 1, minWidth: 0, height: 110, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" }}
//             />
//           ))}
//         </div>
//       )}
//       {main.photographer && (
        
//           href={main.photographer_url || main.source_url}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ fontSize: "0.7rem", color: "#9ca3af", textDecoration: "none" }}
//         >
//           Photo by {main.photographer} on Pexels
//         </a>
//       )}
//     </div>
//   );
// };


// const LifeEcho = ({
//   onBack,
//   isEmbedded = false,
//   initialScenario = null,
//   onAttempt,
//   onAttemptUsed,
// }) => {
//   const [scenarioText, setScenarioText] = useState("");
//   const [selectedScenario, setSelectedScenario] = useState(initialScenario);
//   const [scenarios, setScenarios] = useState([]);
//   const [highlightedIds, setHighlightedIds] = useState([]);
//   const [loadedBatches, setLoadedBatches] = useState(0);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isGeneratingMore, setIsGeneratingMore] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadInitialScenarios();
//   }, []);
//   useEffect(() => {
//     if (initialScenario) setSelectedScenario(initialScenario);
//   }, [initialScenario]);
//   // ✅ TRACKING: log time spent when component unmounts
//   useEffect(() => {
//     return () => {
//       logToolUsage("lifeecho");
//     };
//   }, []);
//   const loadInitialScenarios = async () => {
//     try {
//       const result = await getRandomScenarios();
//       if (result.success && result.scenarios) {
//         setScenarios(result.scenarios);
//         setLoadedBatches(1);
//         highlightRandomScenarios(result.scenarios);
//       }
//     } catch (err) {
//       setError("Failed to load example scenarios");
//     }
//   };

//   const highlightRandomScenarios = (newScenarios) => {
//     if (newScenarios.length < 2) return;
//     const shuffled = [...newScenarios].sort(() => Math.random() - 0.5);
//     setHighlightedIds(shuffled.slice(0, 2).map((s) => s.id));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
//       e.preventDefault();
//       handleGenerateCustomScenario();
//     }
//   };

//   const handleGenerateCustomScenario = async () => {
//     if (!scenarioText.trim()) {
//       setError("Please describe your scenario");
//       return;
//     }
//     if (scenarioText.length < 10) {
//       setError("Please provide more details");
//       return;
//     }
//     setIsGenerating(true);
//     setError("");
//     try {
//       const result = await generateScenario(scenarioText);
//       if (result.success) {
//         const newScenario = {
//           id: Date.now(),
//           title: result.title,
//           story: result.story,
//           tagline: result.tagline,
//           icon: "building",
//           category: "custom",
//         };
//         setScenarios([newScenario, ...scenarios]);

//         // ✅ TRACKING: log custom scenario
//         logLifeEchoSelection({
//           isCustom: true,
//           customText: scenarioText,
//         });

//         setScenarioText("");
//         setSelectedScenario(newScenario);
//       } else {
//         setError(result.error || "Generation failed");
//       }
//     } catch (err) {
//       setError(err.message || "Failed to generate scenario.");
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleGenerateMoreScenarios = async () => {
//     if (loadedBatches >= 7) {
//       setLoadedBatches(0);
//       setScenarios([]);
//       loadInitialScenarios();
//       return;
//     }
//     setIsGeneratingMore(true);
//     setError("");
//     try {
//       const result = await getRandomScenarios();
//       if (result.success && result.scenarios) {
//         setScenarios((prev) => [...prev, ...result.scenarios]);
//         setLoadedBatches((prev) => prev + 1);
//         highlightRandomScenarios(result.scenarios);
//       }
//     } catch (err) {
//       setError("Failed to load new scenarios.");
//     } finally {
//       setIsGeneratingMore(false);
//     }
//   };

//   const renderFormattedText = (text) => {
//     if (!text) return null;
//     return text.split("\n").map((line, index, array) => (
//       <React.Fragment key={index}>
//         {line.replace(/\*\*(.+?)\*\*/g, "$1")}
//         {index < array.length - 1 && <br />}
//       </React.Fragment>
//     ));
//   };

//   const getDescriptionWithoutTagline = (text) => {
//     if (!text) return text;
//     return text.replace(/\*\*Tagline:\*\*\s*.+?(?:\n|$)/gi, "").trim();
//   };

//   const extractTagline = (scenario) => {
//     if (scenario.tagline && !scenario.tagline.includes("**Tagline:**"))
//       return scenario.tagline.trim();
//     const textToSearch =
//       scenario.description || (scenario.story ? scenario.story.join("\n") : "");
//     const taglineMatch = textToSearch.match(
//       /\*\*Tagline:\*\*\s*(.+?)(?:\n|$)/i,
//     );
//     if (taglineMatch) return taglineMatch[1].trim();
//     if (scenario.tagline)
//       return scenario.tagline
//         .replace(/\*\*Tagline:\*\*/i, "")
//         .replace(/\*\*/g, "")
//         .trim();
//     return null;
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100%",
//         background: "transparent",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       {/* HEADER */}
//       <div
//         style={{
//           padding: "0.1rem 1.5rem",
//           flexShrink: 0,
//           background: "transparent",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         {" "}
//         <h1
//           style={{
//             fontSize: "1.4rem",
//             fontWeight: "700",
//             margin: 0,
//             color: "#1f2937",
//           }}
//         >
//           Living insight
//         </h1>
//         {/* <button onClick={onBack} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <X size={18} color="#6b7280" />
//           </button> */}
//       </div>

//       {/* CONTENT */}
//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           background: "transparent",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* SCENARIO LIST */}
//         {!selectedScenario && (
//           <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
//             {/* INPUT ROW */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "1rem",
//                 padding: "0.5rem 1.5rem 0 1.5rem",
//                 maxWidth: "80%",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "0.95rem",
//                   fontWeight: "600",
//                   color: "#1f2937",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 Describe your scenario:
//               </label>
//               <input
//                 type="text"
//                 placeholder="Explain your unique scenario"
//                 value={scenarioText}
//                 onChange={(e) => {
//                   setScenarioText(e.target.value);
//                   setError("");
//                 }}
//                 onKeyPress={handleKeyPress}
//                 disabled={isGenerating}
//                 style={{
//                   flex: 1,
//                   padding: "0.55rem 1rem",
//                   fontSize: "0.9rem",
//                   border: error ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
//                   borderRadius: "10px",
//                   outline: "none",
//                   background: "white",
//                   color: "#6b7280",
//                   opacity: isGenerating ? 0.6 : 1,
//                 }}
//               />
//             </div>

//             {error && (
//               <div
//                 style={{
//                   margin: "0.75rem 1.5rem 0",
//                   padding: "0.75rem 1rem",
//                   background: "#fef2f2",
//                   border: "1px solid #fecaca",
//                   borderRadius: "10px",
//                   color: "#dc2626",
//                   fontSize: "0.85rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.5rem",
//                 }}
//               >
//                 <AlertCircle size={15} />
//                 {error}
//               </div>
//             )}
//             {isGenerating && (
//               <div
//                 style={{
//                   margin: "0.75rem 1.5rem 0",
//                   padding: "0.75rem 1rem",
//                   background: "#eff6ff",
//                   border: "1px solid #bfdbfe",
//                   borderRadius: "10px",
//                   color: "#1e40af",
//                   fontSize: "0.85rem",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "0.5rem",
//                 }}
//               >
//                 <Loader2
//                   size={15}
//                   style={{ animation: "spin 1s linear infinite" }}
//                 />
//                 Generating your custom scenario...
//               </div>
//             )}

//             {/* SCENARIO PILLS */}
//             {scenarios.length > 0 && (
//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: "0.65rem",
//                   padding: "1.25rem 1.5rem 0.5rem 1.5rem",
//                 }}
//               >
//                 {scenarios.map((scenario) => {
//                   const Icon = iconMap[scenario.icon] || Building;
//                   const isHighlighted = highlightedIds.includes(scenario.id);
//                   return (
//                     <button
//                       key={scenario.id}
//                       onClick={() => {
//                         if (isGenerating || isGeneratingMore) return;
//                         setSelectedScenario(scenario);
//                         logLifeEchoSelection({
//                           isCustom: false,
//                           scenarioId: scenario.id,
//                           scenarioTitle: scenario.title,
//                           scenarioIcon: scenario.icon || "clock",
//                         });
//                       }}
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "flex-start",
//                         gap: "4px",
//                         width: "214px",
//                         height: "158px",
//                         padding: "20px",
//                         background: "#F4F6F9",
//                         border: "2px solid #C9A253",
//                         borderRadius: "10px",
//                         cursor: "pointer",
//                         fontSize: "0.9rem",
//                         fontWeight: "500",
//                         color: "#374151",
//                         textAlign: "left",
//                         boxSizing: "border-box",
//                         boxShadow: isHighlighted
//                           ? "0 4px 12px rgba(201,162,83,0.25)"
//                           : "0 1px 3px rgba(0,0,0,0.06)",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: "32px",
//                           height: "32px",
//                           borderRadius: "50%",
//                           background: "#C9A253",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                         }}
//                       >
//                         <Icon size={16} color="white" />
//                       </div>
//                       <span>{scenario.title}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             {/* GENERATE MORE */}
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 padding: "1.5rem",
//                 marginTop: "auto",
//                 flexShrink: 0,
//               }}
//             >
//               <button
//                 onClick={handleGenerateMoreScenarios}
//                 disabled={isGeneratingMore || isGenerating}
//                 style={{
//                   display: "inline-flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: "10px",
//                   width: "157px",
//                   height: "41px",
//                   padding: "10px",
//                   fontSize: "1rem",
//                   fontWeight: "540",
//                   color: "white",
//                   background:
//                     isGeneratingMore || isGenerating ? "#9ca3af" : "#101C34",
//                   border: "none",
//                   borderRadius: "8px",
//                   cursor:
//                     isGeneratingMore || isGenerating
//                       ? "not-allowed"
//                       : "pointer",
//                   boxSizing: "border-box",
//                   boxShadow:
//                     isGeneratingMore || isGenerating
//                       ? "none"
//                       : "4px 4px 10px 0px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 {isGeneratingMore ? (
//                   <>
//                     <Loader2
//                       size={18}
//                       style={{ animation: "spin 1s linear infinite" }}
//                     />
//                     Loading...
//                   </>
//                 ) : loadedBatches >= 7 ? (
//                   <>
//                     <Sparkles size={18} />
//                     Start Over
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles size={18} />
//                     Generate More
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* SCENARIO DETAIL */}
//         {selectedScenario && (
//           <div
//             style={{
//               padding: "0.75rem 1.5rem 1.5rem",
//               animation: "fadeIn 0.3s ease-out",
//             }}
//           >
//             <div
//               style={{
//                 background: "#F5F7FA",
//                 borderRadius: "16px",
//                 padding: "1.5rem 1.75rem",
//                 height: "100%",
//                 boxSizing: "border-box",
//                 border: "2px solid #e2e8f0",
//               }}
//             >
//               {" "}
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   gap: "0.5rem",
//                   marginBottom: "1.1rem",
//                 }}
//               >
//                 <button
//                   onClick={() => setSelectedScenario(null)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     padding: 0,
//                     display: "flex",
//                     alignItems: "center",
//                     flexShrink: 0,
//                     marginTop: "0.25rem",
//                   }}
//                 >
//                   <ChevronLeft size={22} color="#374151" />
//                 </button>
//                 <h2
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: "700",
//                     margin: 0,
//                     color: "#111827",
//                     lineHeight: "1.4",
//                   }}
//                 >
//                   {selectedScenario.title}
//                 </h2>
//               </div>
//               <div
//                 style={{
//                   fontSize: "0.93rem",
//                   lineHeight: "1.75",
//                   color: "#374151",
//                   marginBottom: "1.25rem",
//                   paddingLeft: "1.75rem",
//                 }}
//               >
//                 {selectedScenario.story ? (
//                   selectedScenario.story.map((paragraph, idx) => {
//                     const cleaned = getDescriptionWithoutTagline(paragraph);
//                     if (!cleaned) return null;
//                     return (
//                       <p key={idx} style={{ margin: "0 0 0.85rem 0" }}>
//                         {renderFormattedText(cleaned)}
//                       </p>
//                     );
//                   })
//                 ) : (
//                   <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
//                     {renderFormattedText(
//                       getDescriptionWithoutTagline(
//                         selectedScenario.description,
//                       ),
//                     )}
//                   </p>
//                 )}
//               </div>
//               {extractTagline(selectedScenario) && (
//                 <div style={{ paddingLeft: "1.75rem" }}>
//                   <div
//                     style={{
//                       display: "inline-flex",
//                       alignItems: "center",
//                       gap: "10px",
//                       width: "fit-content",
//                       padding: "10px 14px",
//                       background: "#F5EEDC",
//                       border: "1px solid #C9A253",
//                       borderRadius: "5px",
//                       boxSizing: "border-box",
//                     }}
//                   >
//                     <svg
//                       width="18"
//                       height="14"
//                       viewBox="0 0 24 18"
//                       fill="none"
//                       style={{ flexShrink: 0 }}
//                     >
//                       <path
//                         d="M0 18V10.8C0 7.6 0.8 5.1 2.4 3.2C4 1.3 6.2 0.3 9 0V3.4C7.6 3.7 6.5 4.3 5.7 5.2C4.9 6.1 4.5 7.2 4.5 8.5H9V18H0ZM13.5 18V10.8C13.5 7.6 14.3 5.1 15.9 3.2C17.5 1.3 19.7 0.3 22.5 0V3.4C21.1 3.7 20 4.3 19.2 5.2C18.4 6.1 18 7.2 18 8.5H22.5V18H13.5Z"
//                         fill="#8D6B2E"
//                       />
//                     </svg>
//                     <span
//                       style={{
//                         color: "#8D6B2E",
//                         fontSize: "0.9rem",
//                         fontWeight: "600",
//                         lineHeight: "1.3",
//                         letterSpacing: "0.01em",
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {extractTagline(selectedScenario)}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//           @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//           @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         `}</style>
//     </div>
//   );
// };

// export default LifeEcho;

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  Clock,
  VolumeX,
  Shield,
  Home,
  Building,
  Grid3x3,
} from "lucide-react";
import {
  logLifeEchoSelection,
  logToolUsage,
} from "../../utils/activityTracker";
import { API_BASE_URL } from "../../config/env";

const generateScenario = async (text) => {
  const response = await fetch(`${API_BASE_URL}/api/scenario/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario_text: text }),
  });
  if (!response.ok) throw new Error("Failed to generate scenario");
  return await response.json();
};

const getRandomScenarios = async () => {
  const response = await fetch(`${API_BASE_URL}/api/scenario/random`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch scenarios");
  return await response.json();
};

// ------------------------------------------------------------
// IMAGE CACHE (session-level). The server also caches per keyword,
// so the same keyword (gym, park, hospital...) always returns the
// same photos and Pexels is only called once per keyword.
// ------------------------------------------------------------
const imageCache = new Map();

const getScenarioImages = async (title, text) => {
  const cacheKey = (title || "").trim().toLowerCase();
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const params = new URLSearchParams({
    title: title || "",
    text: (text || "").slice(0, 600),
  });
  const response = await fetch(
    `${API_BASE_URL}/api/scenario/images?${params.toString()}`,
  );
  if (!response.ok) throw new Error("Failed to fetch images");
  const data = await response.json();
  const images = data.images || [];
  if (images.length) imageCache.set(cacheKey, images);
  return images;
};

const iconMap = {
  clock: Clock,
  volume: VolumeX,
  shield: Shield,
  home: Home,
  building: Building,
};

// ------------------------------------------------------------
// IMAGE GALLERY (the right-hand "yellow region")
// ------------------------------------------------------------
const skeletonStyle = {
  background: "#e5e7eb",
  animation: "pulse 1.4s ease-in-out infinite",
};

const ImageGallery = ({ images, loading }) => {
  const [failed, setFailed] = useState([]);

  // reset failures whenever a new image set arrives
  useEffect(() => {
    setFailed([]);
  }, [images]);

  const markFailed = (url) => setFailed((f) => [...f, url]);
  const visible = images.filter((img) => !failed.includes(img.url));

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ ...skeletonStyle, height: 300, borderRadius: 12 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ ...skeletonStyle, flex: 1, height: 110, borderRadius: 10 }} />
          <div style={{ ...skeletonStyle, flex: 1, height: 110, borderRadius: 10 }} />
        </div>
      </div>
    );
  }

  if (!visible.length) return null;

  const [main, ...rest] = visible;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <img
        src={main.url}
        alt={main.alt}
        loading="lazy"
        onError={() => markFailed(main.url)}
        style={{
          width: "100%",
          height: 300,
          objectFit: "cover",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
        }}
      />
      {rest.length > 0 && (
        <div style={{ display: "flex", gap: 10 }}>
          {rest.slice(0, 2).map((img) => (
            <img
              key={img.url}
              src={img.thumb || img.url}
              alt={img.alt}
              loading="lazy"
              onError={() => markFailed(img.url)}
              style={{
                flex: 1,
                minWidth: 0,
                height: 110,
                objectFit: "cover",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
              }}
            />
          ))}
        </div>
      )}
      {main.photographer && (
        <a
          href={main.photographer_url || main.source_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.7rem",
            color: "#9ca3af",
            textDecoration: "none",
          }}
        >
          Photo by {main.photographer} on Pexels
        </a>
      )}
    </div>
  );
};

const LifeEcho = ({
  onBack,
  isEmbedded = false,
  initialScenario = null,
  onAttempt,
  onAttemptUsed,
}) => {
  const [scenarioText, setScenarioText] = useState("");
  const [selectedScenario, setSelectedScenario] = useState(initialScenario);
  const [scenarios, setScenarios] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [totalBatches, setTotalBatches] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState("");

  // photos for the opened scenario
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  useEffect(() => {
    loadInitialScenarios();
  }, []);

  useEffect(() => {
    if (initialScenario) setSelectedScenario(initialScenario);
  }, [initialScenario]);

  // ✅ TRACKING: log time spent when component unmounts
  useEffect(() => {
    return () => {
      logToolUsage("lifeecho");
    };
  }, []);

  // ✅ Fetch keyword-matched photos whenever a scenario is opened
  useEffect(() => {
    if (!selectedScenario) {
      setImages([]);
      setImagesLoading(false);
      return;
    }
    let cancelled = false;
    setImagesLoading(true);
    setImages([]);

    const text =
      selectedScenario.promptText ||
      selectedScenario.description ||
      (selectedScenario.story ? selectedScenario.story.join(" ") : "");

    getScenarioImages(selectedScenario.title, text)
      .then((imgs) => {
        if (!cancelled) setImages(imgs);
      })
      .catch(() => {
        if (!cancelled) setImages([]);
      })
      .finally(() => {
        if (!cancelled) setImagesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedScenario]);

  const loadInitialScenarios = async () => {
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios(result.scenarios);
        setLoadedBatches(1);
        if (result.total_batches) setTotalBatches(result.total_batches);
        highlightRandomScenarios(result.scenarios);
      }
    } catch (err) {
      setError("Failed to load example scenarios");
    }
  };

  const highlightRandomScenarios = (newScenarios) => {
    if (newScenarios.length < 2) return;
    const shuffled = [...newScenarios].sort(() => Math.random() - 0.5);
    setHighlightedIds(shuffled.slice(0, 2).map((s) => s.id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
      e.preventDefault();
      handleGenerateCustomScenario();
    }
  };

  const handleGenerateCustomScenario = async () => {
    if (!scenarioText.trim()) {
      setError("Please describe your scenario");
      return;
    }
    if (scenarioText.length < 10) {
      setError("Please provide more details");
      return;
    }
    setIsGenerating(true);
    setError("");
    try {
      const result = await generateScenario(scenarioText);
      if (result.success) {
        const newScenario = {
          id: Date.now(),
          title: result.title,
          story: result.story,
          tagline: result.tagline,
          icon: "building",
          category: "custom",
          // keep the user's own prompt so keyword matching (gym, park...)
          // works even if the AI-generated title is vague
          promptText: scenarioText,
        };
        setScenarios([newScenario, ...scenarios]);

        // ✅ TRACKING: log custom scenario
        logLifeEchoSelection({
          isCustom: true,
          customText: scenarioText,
        });

        setScenarioText("");
        setSelectedScenario(newScenario);
      } else {
        setError(result.error || "Generation failed");
      }
    } catch (err) {
      setError(err.message || "Failed to generate scenario.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMoreScenarios = async () => {
    if (loadedBatches >= totalBatches) {
      setLoadedBatches(0);
      setScenarios([]);
      loadInitialScenarios();
      return;
    }
    setIsGeneratingMore(true);
    setError("");
    try {
      const result = await getRandomScenarios();
      if (result.success && result.scenarios) {
        setScenarios((prev) => {
          const existing = new Set(prev.map((s) => s.id));
          return [...prev, ...result.scenarios.filter((s) => !existing.has(s.id))];
        });
        setLoadedBatches((prev) => prev + 1);
        if (result.total_batches) setTotalBatches(result.total_batches);
        highlightRandomScenarios(result.scenarios);
      }
    } catch (err) {
      setError("Failed to load new scenarios.");
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, index, array) => (
      <React.Fragment key={index}>
        {line.replace(/\*\*(.+?)\*\*/g, "$1")}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getDescriptionWithoutTagline = (text) => {
    if (!text) return text;
    return text.replace(/\*\*Tagline:\*\*\s*.+?(?:\n|$)/gi, "").trim();
  };

  const extractTagline = (scenario) => {
    if (scenario.tagline && !scenario.tagline.includes("**Tagline:**"))
      return scenario.tagline.trim();
    const textToSearch =
      scenario.description || (scenario.story ? scenario.story.join("\n") : "");
    const taglineMatch = textToSearch.match(
      /\*\*Tagline:\*\*\s*(.+?)(?:\n|$)/i,
    );
    if (taglineMatch) return taglineMatch[1].trim();
    if (scenario.tagline)
      return scenario.tagline
        .replace(/\*\*Tagline:\*\*/i, "")
        .replace(/\*\*/g, "")
        .trim();
    return null;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "0.1rem 1.5rem",
          flexShrink: 0,
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: "700",
            margin: 0,
            color: "#1f2937",
          }}
        >
          Living insight
        </h1>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* SCENARIO LIST */}
        {!selectedScenario && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {/* INPUT ROW */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.5rem 1.5rem 0 1.5rem",
                maxWidth: "80%",
              }}
            >
              <label
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  color: "#1f2937",
                  whiteSpace: "nowrap",
                }}
              >
                Describe your scenario:
              </label>
              <input
                type="text"
                placeholder="Explain your unique scenario"
                value={scenarioText}
                onChange={(e) => {
                  setScenarioText(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                disabled={isGenerating}
                style={{
                  flex: 1,
                  padding: "0.55rem 1rem",
                  fontSize: "0.9rem",
                  border: error ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  outline: "none",
                  background: "white",
                  color: "#6b7280",
                  opacity: isGenerating ? 0.6 : 1,
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  margin: "0.75rem 1.5rem 0",
                  padding: "0.75rem 1rem",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "10px",
                  color: "#dc2626",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={15} />
                {error}
              </div>
            )}
            {isGenerating && (
              <div
                style={{
                  margin: "0.75rem 1.5rem 0",
                  padding: "0.75rem 1rem",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "10px",
                  color: "#1e40af",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Generating your custom scenario...
              </div>
            )}

            {/* SCENARIO PILLS */}
            {scenarios.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.65rem",
                  padding: "1.25rem 1.5rem 0.5rem 1.5rem",
                }}
              >
                {scenarios.map((scenario) => {
                  const Icon = iconMap[scenario.icon] || Building;
                  const isHighlighted = highlightedIds.includes(scenario.id);
                  return (
                    <button
                      key={scenario.id}
                      // prefetch photos on hover so they are ready on click
                      onMouseEnter={() =>
                        getScenarioImages(
                          scenario.title,
                          scenario.description || "",
                        ).catch(() => {})
                      }
                      onClick={() => {
                        if (isGenerating || isGeneratingMore) return;
                        setSelectedScenario(scenario);
                        logLifeEchoSelection({
                          isCustom: false,
                          scenarioId: scenario.id,
                          scenarioTitle: scenario.title,
                          scenarioIcon: scenario.icon || "clock",
                        });
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "4px",
                        width: "214px",
                        height: "158px",
                        padding: "20px",
                        background: "#F4F6F9",
                        border: "2px solid #C9A253",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        color: "#374151",
                        textAlign: "left",
                        boxSizing: "border-box",
                        boxShadow: isHighlighted
                          ? "0 4px 12px rgba(201,162,83,0.25)"
                          : "0 1px 3px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#C9A253",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} color="white" />
                      </div>
                      <span>{scenario.title}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* GENERATE MORE */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1.5rem",
                marginTop: "auto",
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleGenerateMoreScenarios}
                disabled={isGeneratingMore || isGenerating}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "157px",
                  height: "41px",
                  padding: "10px",
                  fontSize: "1rem",
                  fontWeight: "540",
                  color: "white",
                  background:
                    isGeneratingMore || isGenerating ? "#9ca3af" : "#101C34",
                  border: "none",
                  borderRadius: "8px",
                  cursor:
                    isGeneratingMore || isGenerating
                      ? "not-allowed"
                      : "pointer",
                  boxSizing: "border-box",
                  boxShadow:
                    isGeneratingMore || isGenerating
                      ? "none"
                      : "4px 4px 10px 0px rgba(0,0,0,0.15)",
                }}
              >
                {isGeneratingMore ? (
                  <>
                    <Loader2
                      size={18}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Loading...
                  </>
                ) : loadedBatches >= totalBatches ? (
                  <>
                    <Sparkles size={18} />
                    Start Over
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate More
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* SCENARIO DETAIL */}
        {selectedScenario && (
          <div
            style={{
              padding: "0.75rem 1.5rem 1.5rem",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                background: "#F5F7FA",
                borderRadius: "16px",
                padding: "1.5rem 1.75rem",
                height: "100%",
                boxSizing: "border-box",
                border: "2px solid #e2e8f0",
              }}
            >
              {/* TITLE ROW */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  marginBottom: "1.1rem",
                }}
              >
                <button
                  onClick={() => setSelectedScenario(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    marginTop: "0.25rem",
                  }}
                >
                  <ChevronLeft size={22} color="#374151" />
                </button>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    margin: 0,
                    color: "#111827",
                    lineHeight: "1.4",
                  }}
                >
                  {selectedScenario.title}
                </h2>
              </div>

              {/* TWO COLUMNS: text (left) + photos (right) */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  gap: "1.75rem",
                  paddingLeft: "1.75rem",
                }}
              >
                {/* LEFT: text + tagline */}
                <div style={{ flex: "1 1 380px", minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.93rem",
                      lineHeight: "1.75",
                      color: "#374151",
                      marginBottom: "1.25rem",
                    }}
                  >
                    {selectedScenario.story ? (
                      selectedScenario.story.map((paragraph, idx) => {
                        const cleaned = getDescriptionWithoutTagline(paragraph);
                        if (!cleaned) return null;
                        return (
                          <p key={idx} style={{ margin: "0 0 0.85rem 0" }}>
                            {renderFormattedText(cleaned)}
                          </p>
                        );
                      })
                    ) : (
                      <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                        {renderFormattedText(
                          getDescriptionWithoutTagline(
                            selectedScenario.description,
                          ),
                        )}
                      </p>
                    )}
                  </div>

                  {extractTagline(selectedScenario) && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        background: "#F5EEDC",
                        border: "1px solid #C9A253",
                        borderRadius: "5px",
                        boxSizing: "border-box",
                      }}
                    >
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 24 18"
                        fill="none"
                        style={{ flexShrink: 0 }}
                      >
                        <path
                          d="M0 18V10.8C0 7.6 0.8 5.1 2.4 3.2C4 1.3 6.2 0.3 9 0V3.4C7.6 3.7 6.5 4.3 5.7 5.2C4.9 6.1 4.5 7.2 4.5 8.5H9V18H0ZM13.5 18V10.8C13.5 7.6 14.3 5.1 15.9 3.2C17.5 1.3 19.7 0.3 22.5 0V3.4C21.1 3.7 20 4.3 19.2 5.2C18.4 6.1 18 7.2 18 8.5H22.5V18H13.5Z"
                          fill="#8D6B2E"
                        />
                      </svg>
                      <span
                        style={{
                          color: "#8D6B2E",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          lineHeight: "1.3",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {extractTagline(selectedScenario)}
                      </span>
                    </div>
                  )}
                </div>

                {/* RIGHT: photos (the yellow region) */}
                {(imagesLoading || images.length > 0) && (
                  <div
                    style={{
                      flex: "1 1 320px",
                      maxWidth: "440px",
                      minWidth: 0,
                    }}
                  >
                    <ImageGallery images={images} loading={imagesLoading} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
        `}</style>
    </div>
  );
};

export default LifeEcho;