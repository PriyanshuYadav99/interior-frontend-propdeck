import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Home, Loader2 } from "lucide-react";
import { fetchAreaNews } from "../../services/api";

const CARD_WIDTH = 466;
const CARD_GAP = 16;

const LocalWatch = ({ onBack, zipCode }) => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!zipCode) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAreaNews(zipCode);
        if (data.success) {
          setCards(data.cards || []);
          setCategories(data.categories || []);
          setActiveCategory("All");
        } else {
          setError(data.error || "Could not load local news");
        }
      } catch (err) {
        console.error("[LocalWatch] fetch failed:", err);
        setError("Failed to load local news");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [zipCode]);

  const filteredCards =
    activeCategory === "All"
      ? cards
      : cards.filter((c) => c.category === activeCategory);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();
    // reset scroll position whenever the filtered set changes
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [filteredCards.length, activeCategory]);

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * (CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
  };

  const pillStyle = (active) => ({
    padding: "0.4rem 0.85rem",
    borderRadius: "20px",
    border: active ? "none" : "1px solid #e5e7eb",
    background: active ? "#C9A253" : "white",
    color: active ? "white" : "#374151",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  });

  const arrowButtonStyle = (side) => ({
    position: "absolute",
    [side]: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 5,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {!zipCode ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            No address on file yet — local news will appear here once your
            address is set.
          </p>
        </div>
      ) : (
        <>
          {/* Category filter pills — replaces the search bar */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setActiveCategory("All")}
              style={pillStyle(activeCategory === "All")}
            >
              All({cards.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={pillStyle(activeCategory === cat.name)}
              >
                {cat.name}({cat.count})
              </button>
            ))}
          </div>

          {/* Cards carousel */}
          <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
            {loading ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader2
                  size={32}
                  color="#9333ea"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </div>
            ) : error ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>
                  {error}
                </p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  No local news found for this category.
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={scrollRef}
                  onScroll={updateScrollButtons}
                  style={{
                    height: "100%",
                    display: "flex",
                    gap: `${CARD_GAP}px`,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    scrollbarWidth: "none",
                  }}
                >
                  {filteredCards.map((card) => (
                    <div
                      key={card.id}
                      style={{
                        scrollSnapAlign: "start",
                        width: `${CARD_WIDTH}px`,
                        height: "418px",
                        flexShrink: 0,
                        background: "#FBF8F0",
                        border: "2px solid #B8B5AC",
                        borderRadius: "10px",
                        padding: "20px",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            background: "#E9D9B3",
                            color: "#6b5636",
                            fontSize: "0.72rem",
                            fontWeight: "600",
                            padding: "0.3rem 0.7rem",
                            borderRadius: "12px",
                          }}
                        >
                          {card.category}
                        </span>
                        {card.date && (
                          <span
                            style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                          >
                            {card.date}
                          </span>
                        )}
                      </div>

                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "#1f2937",
                          margin: 0,
                          lineHeight: 1.35,
                        }}
                      >
                        {card.title}
                      </h4>

                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.6rem",
                        }}
                      >
                        {card.bullets.map((b, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                              alignItems: "flex-start",
                              fontSize: "0.82rem",
                              color: "#4b5563",
                              lineHeight: 1.45,
                            }}
                          >
                            <span
                              style={{
                                flexShrink: 0,
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                border: "1.5px solid #6b7280",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.6rem",
                                marginTop: "2px",
                              }}
                            >
                              ✓
                            </span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>

                      {card.why_helps && (
                        <div
                          style={{
                            background: "#E9D9B3",
                            borderRadius: "10px",
                            padding: "10px",
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "flex-start",
                            marginTop: "auto",
                          }}
                        >
                          <Home
                            size={15}
                            color="#6b5636"
                            style={{ marginTop: "2px", flexShrink: 0 }}
                          />
                          <div>
                            <p
                              style={{
                                fontSize: "0.75rem",
                                fontWeight: "700",
                                color: "#6b5636",
                                margin: "0 0 0.25rem 0",
                              }}
                            >
                              Why This Helps a Home Buyer:
                            </p>
                            <p
                              style={{
                                fontSize: "0.75rem",
                                color: "#6b5636",
                                margin: 0,
                                lineHeight: 1.4,
                              }}
                            >
                              {card.why_helps}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {canScrollLeft && (
                  <button
                    onClick={() => scrollByCard(-1)}
                    style={arrowButtonStyle("left")}
                    aria-label="Previous card"
                  >
                    <ChevronLeft size={18} color="#374151" />
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={() => scrollByCard(1)}
                    style={arrowButtonStyle("right")}
                    aria-label="Next card"
                  >
                    <ChevronRight size={18} color="#374151" />
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LocalWatch;