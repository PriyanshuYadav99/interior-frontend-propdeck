import {
  Bed,
  Sofa,
  Utensils,
  Maximize2,
  TreePine,
  Factory,
  AlignJustify,
  Crown,
  Flower2,
} from "lucide-react";

export const ROOMS = [
  { id: "master_bedroom", name: "Master Bedroom", icon: Bed },
  { id: "living_room", name: "Living Room", icon: Sofa },
  { id: "kitchen", name: "Kitchen", icon: Utensils },
];

export const STYLES = [
  { id: "modern", name: "Modern", icon: Maximize2 },
  { id: "scandinavian", name: "Scandinavian", icon: TreePine },
  { id: "industrial", name: "Industrial", icon: Factory },
  { id: "minimalist", name: "Minimalist", icon: AlignJustify },
  { id: "traditional", name: "Traditional", icon: Crown },
  { id: "bohemian", name: "Bohemian", icon: Flower2 },
];

export const FLAT_TYPES = [
  { id: "1bhk", name: "1BHK" },
  { id: "2bhk", name: "2BHK" },
  { id: "3bhk", name: "3BHK" },
  { id: "villa", name: "Villa" },
  { id: "bungalow", name: "Bungalow" },
  { id: "rowhouse", name: "Row House" },
];

// Persistent top nav tabs — the only way the user switches between the
// three main tools (room design / living insight / explore nearby).
export const NAV_TABS = [
  { id: "default", label: "Room design" },
  { id: "scenario", label: "Living insight" },
  { id: "virtualTour", label: "Explore nearby" },
];
