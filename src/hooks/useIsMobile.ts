import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            // Check if viewport width is less than 1024px (tablet/mobile)
            const width = window.innerWidth;
            const isMobileDevice = width < 1024;
            
            // Also check user agent for mobile devices
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            
            setIsMobile(isMobileDevice || isMobileUA);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    return isMobile;
};
