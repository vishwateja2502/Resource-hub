import React from 'react';

export default function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0); }
        }
        @keyframes floatX {
          0% { transform: translateX(0); }
          50% { transform: translateX(18px); }
          100% { transform: translateX(0); }
        }
        @keyframes floatXY {
          0% { transform: translate(0,0); }
          50% { transform: translate(12px, -12px); }
          100% { transform: translate(0,0); }
        }
      `}</style>
      {/* Book - top 8% left 6% */}
      <svg style={{position:'absolute',top:'8%',left:'6%',opacity:0.33,zIndex:0,animation:'floatY 7.2s ease-in-out infinite'}} width="100" height="100" viewBox="0 0 24 24" fill="#fca5a5">
        <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
        <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
        <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
      </svg>
      {/* Cap - top 18% right 10% */}
      <svg style={{position:'absolute',top:'18%',right:'10%',opacity:0.29,zIndex:0,animation:'floatY 8.7s ease-in-out infinite'}} width="80" height="80" viewBox="0 0 24 24" fill="#fca5a5">
        <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 0 1-2 0v-3.09l-7 3.91-9-5 1.18-.66L12 15l8.82-4.91L23 9l-11-6z"/>
      </svg>
      {/* Book - bottom 12% left 13% */}
      <svg style={{position:'absolute',bottom:'12%',left:'13%',opacity:0.28,zIndex:0,animation:'floatX 6.5s ease-in-out infinite'}} width="90" height="90" viewBox="0 0 24 24" fill="#fca5a5">
        <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
        <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
        <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
      </svg>
      {/* Book - bottom 7% right 7% */}
      <svg style={{position:'absolute',bottom:'7%',right:'7%',opacity:0.36,zIndex:0,animation:'floatXY 9.1s ease-in-out infinite'}} width="110" height="110" viewBox="0 0 24 24" fill="#fca5a5">
        <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
        <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
        <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
      </svg>
      {/* Pencil - top 40% left 3% */}
      <svg style={{position:'absolute',top:'40%',left:'3%',opacity:0.31,zIndex:0,animation:'floatX 10.2s ease-in-out infinite'}} width="85" height="85" viewBox="0 0 24 24" fill="#fca5a5">
        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92.92l8.06-8.06 1.83 1.83-8.06 8.06H5.92v-1.83zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
      </svg>
      {/* Lightbulb - top 12% left 50% */}
      <svg style={{position:'absolute',top:'12%',left:'50%',transform:'translateX(-50%)',opacity:0.25,zIndex:0,animation:'floatY 8.2s ease-in-out infinite'}} width="80" height="80" viewBox="0 0 24 24" fill="#fca5a5">
        <path d="M9 21h6v-1H9v1zm3-19C7.48 2 4 5.48 4 10c0 2.38 1.19 4.47 3 5.74V18c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-4.52-3.48-8-8-8zm3 15H8v-1.26C6.19 14.47 5 12.38 5 10c0-3.87 3.13-7 7-7s7 3.13 7 7c0 2.38-1.19 4.47-3 5.74V17z"/>
      </svg>
      {/* Globe - top 60% right 4% */}
      <svg style={{position:'absolute',top:'60%',right:'4%',opacity:0.27,zIndex:0,animation:'floatXY 11.5s ease-in-out infinite'}} width="95" height="95" viewBox="0 0 24 24" fill="#fca5a5">
        <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2" fill="none"/>
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="#f87171" strokeWidth="1.5" fill="none"/>
      </svg>
      {/* Ruler - bottom 13% left 55% */}
      <svg style={{position:'absolute',bottom:'13%',left:'55%',opacity:0.23,zIndex:0,animation:'floatX 12.7s ease-in-out infinite'}} width="85" height="85" viewBox="0 0 24 24" fill="#fca5a5">
        <rect x="3" y="17" width="18" height="4" rx="1.5" fill="#fca5a5" stroke="#f87171" strokeWidth="1.5"/>
        <rect x="5" y="19" width="1.5" height="2" fill="#f87171"/>
        <rect x="8" y="19" width="1.5" height="2" fill="#f87171"/>
        <rect x="11" y="19" width="1.5" height="2" fill="#f87171"/>
        <rect x="14" y="19" width="1.5" height="2" fill="#f87171"/>
        <rect x="17" y="19" width="1.5" height="2" fill="#f87171"/>
      </svg>
    </>
  );
} 