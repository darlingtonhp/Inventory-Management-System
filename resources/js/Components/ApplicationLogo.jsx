import React from 'react';

export default function ApplicationLogo(props) {
    return (
        <svg {...props} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Hexagon framing */}
            <path 
                d="M50 8L86.4 29V71L50 92L13.6 71V29L50 8Z" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            
            {/* Isometric inner box divisions */}
            <path 
                d="M50 50L86.4 29" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
            />
            <path 
                d="M50 50L13.6 29" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
            />
            <path 
                d="M50 50V92" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
            />
            
            {/* Inner data nodes (representing intelligence / smart inventory) */}
            <circle cx="50" cy="50" r="7" fill="#6366F1" className="animate-pulse" />
            <circle cx="50" cy="25" r="4.5" fill="currentColor" />
            <circle cx="28" cy="62" r="4.5" fill="currentColor" />
            <circle cx="72" cy="62" r="4.5" fill="currentColor" />
            
            {/* Soft node connector indicators */}
            <line x1="50" y1="29" x2="50" y2="43" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="32" y1="60" x2="44" y2="53" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="68" y1="60" x2="56" y2="53" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
    );
}
