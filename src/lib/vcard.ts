/**
 * Utility for generating and triggering download of high-fidelity vCard (.vcf)
 * for seamless "Add to Contacts" integration on iOS, Android, macOS, and Windows.
 */

export interface VCardData {
    fullName?: string;
    username?: string;
    bio?: string;
    role?: string;
    email?: string;
    websiteUrl?: string;
    bookingUrl?: string;
    avatarUrl?: string;
    socials?: Array<{ platform: string; url: string }>;
}

export function generateVCard(data: VCardData): string {
    const name = (data.fullName || data.username || "Anonymous").trim();
    // Split into first and last name for N field
    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const lines: string[] = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name}`,
        `N:${lastName};${firstName};;;`,
    ];

    if (data.role) {
        lines.push(`TITLE:${data.role}`);
    }

    lines.push(`ORG:Dockly Pro Estate`);

    if (data.email) {
        lines.push(`EMAIL;TYPE=INTERNET,PREF:${data.email}`);
    }

    const estateUrl = data.websiteUrl || (data.username ? `https://dockly.pro/${data.username}` : "https://dockly.pro");
    lines.push(`URL;TYPE=WORK:${estateUrl}`);

    if (data.bookingUrl) {
        lines.push(`URL;TYPE=CALENDAR:${data.bookingUrl}`);
    }

    if (data.bio) {
        // Sanitize bio to single line for vCard NOTE
        const sanitizedBio = data.bio.replace(/(\r\n|\n|\r)/gm, " ").trim();
        lines.push(`NOTE:${sanitizedBio}`);
    }

    // Include custom social references if available
    if (data.socials && data.socials.length > 0) {
        data.socials.forEach(s => {
            if (s.url) {
                const label = s.platform.replace("custom:", "").toUpperCase();
                lines.push(`X-SOCIALPROFILE;type=${label}:${s.url}`);
            }
        });
    }

    lines.push("END:VCARD");
    return lines.join("\r\n");
}

export function downloadVCard(data: VCardData): void {
    const vcardString = generateVCard(data);
    const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8;" });
    const filename = `${(data.username || data.fullName || "estate").toLowerCase().replace(/[^a-z0-9]/g, "-")}-contact.vcf`;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
