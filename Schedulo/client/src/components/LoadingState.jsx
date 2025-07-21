import React from 'react';

export default function Loader({ loading, setLoading }) {
    if (!loading) return null;

    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center h-full w-full bg-blue-100 font-montserrat overflow-hidden" style={{fontFamily:'Montserrat , sans-serif'}}>
            {/* Spinner */}
            <div className="relative w-36 h-36">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-8 border-t-pink-500 border-b-blue-400 border-r-yellow-400 border-l-transparent rounded-full animate-spin-slow shadow-2xl"></div>

                {/* Orbiting dot with offset radius */}
                <div className="w-5 h-5 bg-yellow-400 rounded-full absolute top-1/2 left-1/2 animate-orbit transform -translate-x-1/2 -translate-y-1/2" style={{ marginTop: '8px' }}></div>
            </div>

            {/* Headline */}
            <h1 className="mt-10 text-6xl font-extrabold tracking-wide text-indigo-700 drop-shadow-xl">
                Loading Search Magic
            </h1>
            <p className="mt-2 text-xl font-medium text-yellow-400 tracking-wide">
                Summoning spectacular events just for you
            </p>

            {/* Animation styles */}
            <style jsx="true">{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        @keyframes orbit {
  0% {
    transform: rotate(0deg) translateX(40px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(40px) rotate(-360deg);
  }
}

        .animate-orbit {
          transform-origin: center;
          animation: orbit 2.2s linear infinite;
        }
      `}</style>
        </div>
    );
}