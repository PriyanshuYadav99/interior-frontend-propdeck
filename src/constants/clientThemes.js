// src/constants/clientThemes.js
//
// DEFAULT_THEME = the colours your app uses TODAY. Do not change these.
// Every other client only lists the keys that are different.
// Any key a client does not list falls back to the default.

const DEFAULT_THEME = {
  pageBg: "#F8F5EF",        // outer card + list panel background

  tabBg: "#101C34",         // active top tab background
  tabText: "#ffffff",       // active top tab text

  pillBg: "#C9A253",        // active unit / room / style pill background
  pillBorder: "#C9A253",    // active pill border colour
  pillText: "#ffffff",      // active pill text + icon

  btnBg: "#101C34",         // Generate Design + Generate More buttons
  btnText: "#ffffff",

  accent: "#9333ea",        // spinners + custom prompt border

  cardBg: "#F4F6F9",        // Living insight scenario cards
  cardBorder: "#C9A253",
  iconBg: "#C9A253",        // circle behind the scenario icon
  iconColor: "#ffffff",

  detailBg: "#F5F7FA",      // opened scenario panel
  detailBorder: "#e2e8f0",

  tagBg: "#F5EEDC",         // quote / tagline box
  tagBorder: "#C9A253",
  tagText: "#8D6B2E",

  catBg: "#C9A253",         // Explore nearby active category pill
  catBorder: "#d1d5db",
  catText: "#ffffff",

  ratingBg: "#C9A253",      // star rating pill
  streetIcon: "#C9A253",    // street view icon
  marker: "#16223B",        // Google Maps markers
};

const THEMES = {
  default: DEFAULT_THEME,

  "the-wow-tower": {
    fontFamily: '"Sora", sans-serif',

    tabBg: "rgba(232, 190, 98, 0.3)",
    tabText: "#E1A035",

    pillBg: "rgba(232, 190, 98, 0.3)",
    pillBorder: "#E8BE62",
    pillText: "#E1A035",

    btnBg: "#E1A035",
    btnText: "#ffffff",

    cardBg: "rgba(232, 190, 98, 0.1)",
    cardBorder: "#E8BE62",
    iconBg: "rgba(232, 190, 98, 0.3)",
    iconColor: "#E1A035",

    detailBg: "#F5F7FA",
    detailBorder: "#B8B5AC",

    tagBg: "rgba(232, 190, 98, 0.1)",
    tagBorder: "#E8BE62",
    tagText: "#E1A035",

    catBg: "rgba(232, 190, 98, 0.2)",
    catBorder: "#E8BE62",
    catText: "#E1A035",

    ratingBg: "#E8BE62",
    streetIcon: "#E1A035",
  },
  "nakheel": {
    fontFamily: '"Sora", sans-serif',

    tabBg: "#006280",
    tabText: "#ffffff",

    pillBg: "#D6E6F5",
    pillBorder: "#7FA9D1",
    pillText: "#2B5C8A",

    btnBg: "#2F6480",
    btnText: "#ffffff",

    cardBg: "rgba(127, 169, 209, 0.1)",
    cardBorder: "#7FA9D1",
    iconBg: "rgba(127, 169, 209, 0.25)",
    iconColor: "#2B5C8A",

    detailBg: "#F5F7FA",
    detailBorder: "#B8C4CE",

    tagBg: "rgba(127, 169, 209, 0.1)",
    tagBorder: "#7FA9D1",
    tagText: "#2B5C8A",

    catBg: "rgba(127, 169, 209, 0.2)",
    catBorder: "#7FA9D1",
    catText: "#2B5C8A",

    ratingBg: "#006280",
    streetIcon: "#2B5C8A",
  },
  // Add future clients here. Example:
  // "another-client": { btnBg: "#0F766E", pillBg: "#0F766E" },
  "spring-field": {
    fontFamily: '"Sora", sans-serif',

    tabBg: "#24418F",
    tabText: "#ffffff",

    pillBg: "rgba(36, 65, 143, 0.3)",
    pillBorder: "#24418F",
    pillText: "#24418F",

    btnBg: "#1A1A2E",
    btnText: "#ffffff",

    cardBg: "rgba(36, 65, 143, 0.1)",
    cardBorder: "#24418F",
    iconBg: "rgba(36, 65, 143, 0.25)",
    iconColor: "#24418F",

    detailBg: "#F5F7FA",
    detailBorder: "#B8C4CE",

    tagBg: "rgba(36, 65, 143, 0.1)",
    tagBorder: "#24418F",
    tagText: "#24418F",

    catBg: "rgba(36, 65, 143, 0.2)",
    catBorder: "#24418F",
    catText: "#24418F",

    ratingBg: "#24418F",
    streetIcon: "#24418F",
  },
  "fam": {
    fontFamily: '"Sora", sans-serif',

    pageBg: "#F8F5EF",        // outer card + list panel background

  tabBg: "#101C34",         // active top tab background
  tabText: "#ffffff",       // active top tab text

  pillBg: "#C9A253",        // active unit / room / style pill background
  pillBorder: "#C9A253",    // active pill border colour
  pillText: "#ffffff",      // active pill text + icon

  btnBg: "#101C34",         // Generate Design + Generate More buttons
  btnText: "#ffffff",

  accent: "#9333ea",        // spinners + custom prompt border

  cardBg: "#F4F6F9",        // Living insight scenario cards
  cardBorder: "#C9A253",
  iconBg: "#C9A253",        // circle behind the scenario icon
  iconColor: "#ffffff",

  detailBg: "#F5F7FA",      // opened scenario panel
  detailBorder: "#e2e8f0",

  tagBg: "#F5EEDC",         // quote / tagline box
  tagBorder: "#C9A253",
  tagText: "#8D6B2E",

  catBg: "#C9A253",         // Explore nearby active category pill
  catBorder: "#d1d5db",
  catText: "#ffffff",

  ratingBg: "#C9A253",      // star rating pill
  streetIcon: "#C9A253",    // street view icon
  marker: "#16223B", 
  },
};

export const getTheme = (clientName) => ({
  ...DEFAULT_THEME,
  ...(THEMES[String(clientName || "").toLowerCase()] || {}),
});

// pageBg -> --c-page-bg, tabBg -> --c-tab-bg, etc.
export const themeToCssVars = (theme) =>
  Object.fromEntries(
    Object.entries(theme).map(([key, value]) => [
      `--c-${key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}`,
      value,
    ]),
  );