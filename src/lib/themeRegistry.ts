export interface ThemePreset {
    id: string;
    name: string;
    primary: string;
    bg: string;
    font: string;
    isLight?: boolean;
    tag: "Haute Luxury" | "High Tech" | "Monolith Dark" | "Editorial Light" | "Avant-Garde";
    description: string;
}

export interface FontPreset {
    id: string;
    name: string;
    family: string;
    category: "Display" | "Sans-Serif" | "Editorial Serif" | "Monospace";
    sampleText: string;
    description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: "royale",
        name: "Obsidian Royale",
        primary: "#D4AF37",
        bg: "#050505",
        font: "Syncopate",
        tag: "Haute Luxury",
        description: "Pure obsidian luxury with 24k gold accents and geometric precision."
    },
    {
        id: "monaco",
        name: "Monaco Rosso",
        primary: "#FF2D55",
        bg: "#0B0C0E",
        font: "Syncopate",
        tag: "Haute Luxury",
        description: "Carbon fiber aerodynamics with Ferrari-inspired racing crimson."
    },
    {
        id: "tokyo",
        name: "Tokyo Cyberpunk",
        primary: "#00F0FF",
        bg: "#06070B",
        font: "Space Grotesk",
        tag: "High Tech",
        description: "High-voltage neon cyan over midnight Shibuya OLED dark."
    },
    {
        id: "matrix",
        name: "Terminal 01",
        primary: "#00FF66",
        bg: "#000000",
        font: "JetBrains Mono",
        tag: "High Tech",
        description: "Phosphor cathode green on pitch black for sovereign engineers."
    },
    {
        id: "glacial",
        name: "Glacial Slate",
        primary: "#38BDF8",
        bg: "#07111E",
        font: "Plus Jakarta Sans",
        tag: "Monolith Dark",
        description: "Arctic frost cyan over deep Nordic fjord blue slate."
    },
    {
        id: "nebula",
        name: "Nebula Core",
        primary: "#C084FC",
        bg: "#0F172A",
        font: "Outfit",
        tag: "Monolith Dark",
        description: "Cosmic ultraviolet aura over deep space oceanic midnight."
    },
    {
        id: "titanium",
        name: "Titanium Stealth",
        primary: "#CBD5E1",
        bg: "#09090B",
        font: "Manrope",
        tag: "Monolith Dark",
        description: "Monolithic brushed platinum on aerospace titanium stealth."
    },
    {
        id: "bordeaux",
        name: "Bordeaux Grand Cru",
        primary: "#E11D48",
        bg: "#12070D",
        font: "Playfair Display",
        tag: "Haute Luxury",
        description: "Vintage French burgundy on warm royal mahogany wood."
    },
    {
        id: "emerald",
        name: "Emerald Vault",
        primary: "#10B981",
        bg: "#062016",
        font: "Cormorant Garamond",
        tag: "Haute Luxury",
        description: "Deep sovereign malachite green with Swiss banking prestige."
    },
    {
        id: "velvet",
        name: "Midnight Velvet",
        primary: "#A855F7",
        bg: "#120B1E",
        font: "Playfair Display",
        tag: "Haute Luxury",
        description: "Amethyst violet luxury draped over deep midnight shadows."
    },
    {
        id: "kyoto",
        name: "Kyoto Bloom",
        primary: "#FDA4AF",
        bg: "#110E12",
        font: "Syne",
        tag: "Avant-Garde",
        description: "Delicate sakura blossom blush over warm Japanese charcoal."
    },
    {
        id: "solana",
        name: "Solana Aurora",
        primary: "#6366F1",
        bg: "#080816",
        font: "Space Grotesk",
        tag: "High Tech",
        description: "Electric indigo-violet glow on zero-gravity cosmic void."
    },
    {
        id: "champagne",
        name: "Champagne Noir",
        primary: "#F5F5DC",
        bg: "#0A0A0A",
        font: "Bodoni Moda",
        tag: "Haute Luxury",
        description: "Cream alabaster silk over minimalist high-fashion black."
    },
    {
        id: "etheric",
        name: "Etheric White",
        primary: "#3B82F6",
        bg: "#F8FAFC",
        font: "Plus Jakarta Sans",
        isLight: true,
        tag: "Editorial Light",
        description: "Architectural gallery white with vibrant sapphire cobalt accents."
    },
    {
        id: "sahara",
        name: "Sahara Minimal",
        primary: "#D97706",
        bg: "#FAF8F5",
        font: "Cinzel",
        isLight: true,
        tag: "Editorial Light",
        description: "Warm desert parchment with Mediterranean terracotta copper."
    },
    {
        id: "ivory",
        name: "Antique Ivory",
        primary: "#8B4513",
        bg: "#FFFDF5",
        font: "Cinzel",
        isLight: true,
        tag: "Editorial Light",
        description: "Warm Venetian heritage paper with refined bronze amber tones."
    }
];

export const FONT_PRESETS: FontPreset[] = [
    {
        id: "syncopate",
        name: "Syncopate",
        family: "Syncopate",
        category: "Display",
        sampleText: "ARCHITECTURAL ESTEEM",
        description: "Ultra-wide, commanding haute-couture display geometry."
    },
    {
        id: "syne",
        name: "Syne",
        family: "Syne",
        category: "Display",
        sampleText: "RADICAL CONTEMPORARY",
        description: "Avant-garde Paris design studio typography with sculptural curves."
    },
    {
        id: "space",
        name: "Space Grotesk",
        family: "Space Grotesk",
        category: "Sans-Serif",
        sampleText: "NEXT-GEN SYSTEMS",
        description: "Techno-brutalist engineering font built for Web3 and deep tech."
    },
    {
        id: "outfit",
        name: "Outfit",
        family: "Outfit",
        category: "Sans-Serif",
        sampleText: "DIGITAL MASTERY",
        description: "Pristine geometric sans with balanced weight and executive polish."
    },
    {
        id: "plus",
        name: "Plus Jakarta Sans",
        family: "Plus Jakarta Sans",
        category: "Sans-Serif",
        sampleText: "VENTURE VELOCITY",
        description: "High-growth executive tech sans with crisp international legibility."
    },
    {
        id: "inter",
        name: "Inter",
        family: "Inter",
        category: "Sans-Serif",
        sampleText: "SOVEREIGN INTERFACE",
        description: "The gold standard of Silicon Valley UI design and micro-precision."
    },
    {
        id: "manrope",
        name: "Manrope",
        family: "Manrope",
        category: "Sans-Serif",
        sampleText: "AEROSPACE PRECISION",
        description: "Semi-geometric modern typeface with refined proportions."
    },
    {
        id: "cormorant",
        name: "Cormorant Garamond",
        family: "Cormorant Garamond",
        category: "Editorial Serif",
        sampleText: "HAUTE HORLOGERIE",
        description: "Prestigious classical serif reminiscent of luxury Swiss watchmakers."
    },
    {
        id: "bodoni",
        name: "Bodoni Moda",
        family: "Bodoni Moda",
        category: "Editorial Serif",
        sampleText: "VOGUE COUTURE",
        description: "High-contrast dramatic serifs evoking Milanese fashion editorial."
    },
    {
        id: "playfair",
        name: "Playfair Display",
        family: "Playfair Display",
        category: "Editorial Serif",
        sampleText: "HERITAGE VALUATION",
        description: "Timeless transitional serif for stately, distinguished profiles."
    },
    {
        id: "cinzel",
        name: "Cinzel",
        family: "Cinzel",
        category: "Editorial Serif",
        sampleText: "IMPERIAL RECORD",
        description: "Classical Roman inscriptional capitals for eternal dignity."
    },
    {
        id: "jetbrains",
        name: "JetBrains Mono",
        family: "JetBrains Mono",
        category: "Monospace",
        sampleText: "CONST SOVEREIGN = TRUE;",
        description: "Developer-first monospace engineered for code and architecture."
    }
];

export const ACCENT_PALETTES = [
    { label: "Maison Gold", hex: "#D4AF37" },
    { label: "Rosso Corsa", hex: "#FF2D55" },
    { label: "Neon Cyan", hex: "#00F0FF" },
    { label: "Emerald Malachite", hex: "#10B981" },
    { label: "Phosphor Green", hex: "#00FF66" },
    { label: "Solana Violet", hex: "#6366F1" },
    { label: "Cosmic Purple", hex: "#C084FC" },
    { label: "Frost Azure", hex: "#38BDF8" },
    { label: "Sakura Blush", hex: "#FDA4AF" },
    { label: "Desert Amber", hex: "#D97706" },
    { label: "Platinum Titanium", hex: "#CBD5E1" },
    { label: "Pure Alabaster", hex: "#F5F5DC" }
];

export const resolveTheme = (userTheme?: any): ThemePreset => {
    const defaultTheme = THEME_PRESETS[0]; // royale
    if (!userTheme) return defaultTheme;

    // Find base preset if id matches
    const preset = THEME_PRESETS.find(p => p.id === userTheme.id) || defaultTheme;

    const bg = userTheme.bg || preset.bg || "#050505";
    const isLight = Boolean(
        userTheme.isLight !== undefined
            ? userTheme.isLight
            : (preset.isLight ||
               userTheme.id === "etheric" ||
               userTheme.id === "ivory" ||
               userTheme.id === "sahara" ||
               bg === "#F8FAFC" ||
               bg === "#FAF8F5" ||
               bg === "#FFFDF5")
    );

    return {
        ...preset,
        ...userTheme,
        id: userTheme.id || preset.id,
        name: userTheme.name || preset.name,
        primary: userTheme.primary || preset.primary || "#D4AF37",
        bg,
        font: userTheme.font || preset.font || "Syncopate",
        isLight
    };
};

