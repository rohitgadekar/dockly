import React from "react";
import {
    SiReact,
    SiTypescript,
    SiJavascript,
    SiPython,
    SiRust,
    SiGo,
    SiCplusplus,
    SiOpenjdk,
    SiPhp,
    SiRuby,
    SiSwift,
    SiKotlin,
    SiSolidity,
    SiHtml5,
    SiCss3,
    SiNextdotjs,
    SiVuedotjs,
    SiTailwindcss,
    SiSvelte,
    SiAngular,
    SiVite,
    SiRedux,
    SiFlutter,
    SiNodedotjs,
    SiGraphql,
    SiPostgresql,
    SiMongodb,
    SiRedis,
    SiSupabase,
    SiPrisma,
    SiFirebase,
    SiDjango,
    SiFastapi,
    SiExpress,
    SiDocker,
    SiKubernetes,
    SiAmazonwebservices,
    SiGooglecloud,
    SiLinux,
    SiCloudflare,
    SiVercel,
    SiGit,
    SiGithub,
    SiOpenai,
    SiPytorch,
    SiTensorflow,
    SiFigma,
} from "react-icons/si";
import { Code2 } from "lucide-react";

export interface TechPreset {
    key: string;
    name: string;
    category: "Languages" | "Frontend" | "Backend" | "Cloud" | "AI & Data" | "Tools";
    color: string;
    icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

export const TECH_PRESETS: TechPreset[] = [
    // Languages
    { key: "typescript", name: "TypeScript", category: "Languages", color: "#3178C6", icon: SiTypescript },
    { key: "javascript", name: "JavaScript", category: "Languages", color: "#F7DF1E", icon: SiJavascript },
    { key: "python", name: "Python", category: "Languages", color: "#3776AB", icon: SiPython },
    { key: "rust", name: "Rust", category: "Languages", color: "#DEA584", icon: SiRust },
    { key: "go", name: "Go / Golang", category: "Languages", color: "#00ADD8", icon: SiGo },
    { key: "solidity", name: "Solidity", category: "Languages", color: "#656565", icon: SiSolidity },
    { key: "cplusplus", name: "C++", category: "Languages", color: "#00599C", icon: SiCplusplus },
    { key: "java", name: "Java", category: "Languages", color: "#ED8B00", icon: SiOpenjdk },
    { key: "swift", name: "Swift", category: "Languages", color: "#F05138", icon: SiSwift },
    { key: "kotlin", name: "Kotlin", category: "Languages", color: "#7F52FF", icon: SiKotlin },
    { key: "php", name: "PHP", category: "Languages", color: "#777BB4", icon: SiPhp },
    { key: "ruby", name: "Ruby", category: "Languages", color: "#CC342D", icon: SiRuby },
    { key: "html5", name: "HTML5", category: "Languages", color: "#E34F26", icon: SiHtml5 },
    { key: "css3", name: "CSS3", category: "Languages", color: "#1572B6", icon: SiCss3 },

    // Frontend
    { key: "react", name: "React", category: "Frontend", color: "#61DAFB", icon: SiReact },
    { key: "nextjs", name: "Next.js", category: "Frontend", color: "#FFFFFF", icon: SiNextdotjs },
    { key: "tailwindcss", name: "Tailwind CSS", category: "Frontend", color: "#06B6D4", icon: SiTailwindcss },
    { key: "vuedotjs", name: "Vue.js", category: "Frontend", color: "#4FC08D", icon: SiVuedotjs },
    { key: "svelte", name: "Svelte", category: "Frontend", color: "#FF3E00", icon: SiSvelte },
    { key: "angular", name: "Angular", category: "Frontend", color: "#DD0031", icon: SiAngular },
    { key: "vite", name: "Vite", category: "Frontend", color: "#646CFF", icon: SiVite },
    { key: "redux", name: "Redux", category: "Frontend", color: "#764ABC", icon: SiRedux },
    { key: "flutter", name: "Flutter", category: "Frontend", color: "#02569B", icon: SiFlutter },

    // Backend
    { key: "nodejs", name: "Node.js", category: "Backend", color: "#5FA04E", icon: SiNodedotjs },
    { key: "postgresql", name: "PostgreSQL", category: "Backend", color: "#4169E1", icon: SiPostgresql },
    { key: "graphql", name: "GraphQL", category: "Backend", color: "#E10098", icon: SiGraphql },
    { key: "supabase", name: "Supabase", category: "Backend", color: "#3ECF8E", icon: SiSupabase },
    { key: "redis", name: "Redis", category: "Backend", color: "#DC382D", icon: SiRedis },
    { key: "mongodb", name: "MongoDB", category: "Backend", color: "#47A248", icon: SiMongodb },
    { key: "prisma", name: "Prisma", category: "Backend", color: "#5A67D8", icon: SiPrisma },
    { key: "fastapi", name: "FastAPI", category: "Backend", color: "#009688", icon: SiFastapi },
    { key: "django", name: "Django", category: "Backend", color: "#092E20", icon: SiDjango },
    { key: "express", name: "Express", category: "Backend", color: "#FFFFFF", icon: SiExpress },
    { key: "firebase", name: "Firebase", category: "Backend", color: "#FFCA28", icon: SiFirebase },

    // Cloud & DevOps
    { key: "docker", name: "Docker", category: "Cloud", color: "#2496ED", icon: SiDocker },
    { key: "kubernetes", name: "Kubernetes", category: "Cloud", color: "#326CE5", icon: SiKubernetes },
    { key: "aws", name: "AWS", category: "Cloud", color: "#FF9900", icon: SiAmazonwebservices },
    { key: "googlecloud", name: "Google Cloud", category: "Cloud", color: "#4285F4", icon: SiGooglecloud },
    { key: "cloudflare", name: "Cloudflare", category: "Cloud", color: "#F38020", icon: SiCloudflare },
    { key: "vercel", name: "Vercel", category: "Cloud", color: "#FFFFFF", icon: SiVercel },
    { key: "linux", name: "Linux", category: "Cloud", color: "#FCC624", icon: SiLinux },

    // AI & Data
    { key: "openai", name: "OpenAI / LLMs", category: "AI & Data", color: "#10A37F", icon: SiOpenai },
    { key: "pytorch", name: "PyTorch", category: "AI & Data", color: "#EE4C2C", icon: SiPytorch },
    { key: "tensorflow", name: "TensorFlow", category: "AI & Data", color: "#FF6F00", icon: SiTensorflow },

    // Tools & Design
    { key: "figma", name: "Figma", category: "Tools", color: "#F24E1E", icon: SiFigma },
    { key: "git", name: "Git", category: "Tools", color: "#F05032", icon: SiGit },
    { key: "github", name: "GitHub", category: "Tools", color: "#FFFFFF", icon: SiGithub },
];

export const TECH_MAP = new Map<string, TechPreset>(
    TECH_PRESETS.map((item) => [item.key.toLowerCase(), item])
);

export function getTechIconInfo(keyOrName: string) {
    if (!keyOrName) {
        return {
            name: "Skill",
            key: "skill",
            color: "#3ECF8E",
            icon: Code2,
            category: "Languages" as const,
        };
    }

    const cleanKey = keyOrName.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Direct match
    if (TECH_MAP.has(cleanKey)) {
        return TECH_MAP.get(cleanKey)!;
    }

    // Name match
    const foundByName = TECH_PRESETS.find(
        (p) => p.name.toLowerCase() === keyOrName.toLowerCase()
    );
    if (foundByName) return foundByName;

    // Fuzzy match
    const foundFuzzy = TECH_PRESETS.find(
        (p) =>
            p.key.includes(cleanKey) ||
            cleanKey.includes(p.key) ||
            p.name.toLowerCase().includes(keyOrName.toLowerCase())
    );
    if (foundFuzzy) return foundFuzzy;

    return {
        name: keyOrName,
        key: keyOrName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        color: "#3ECF8E",
        icon: Code2,
        category: "Languages" as const,
    };
}
