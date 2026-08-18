import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context
interface MarqueeContextType {
    isMarqueePaused: boolean;
    setIsMarqueePaused: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create a context for the marquee state
export const MarqueeContext = createContext<MarqueeContextType | undefined>(undefined);

export const useMarquee = (): MarqueeContextType => {
    const context = useContext(MarqueeContext);
    if (!context) {
        throw new Error('useMarquee must be used within a MarqueeProvider');
    }
    return context;
};

interface MarqueeProviderProps {
    children: ReactNode;
}

export const MarqueeProvider: React.FC<MarqueeProviderProps> = ({ children }) => {
    const [isMarqueePaused, setIsMarqueePaused] = useState<boolean>(false);

    return (
        <MarqueeContext.Provider value={{ isMarqueePaused, setIsMarqueePaused }}>
            {children}
        </MarqueeContext.Provider>
    );
};
