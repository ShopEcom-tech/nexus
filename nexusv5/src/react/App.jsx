import React, { useState } from 'react';

export default function TestApp() {
    const [count, setCount] = useState(0);

    return (
        <div className="p-8 bg-gray-900 text-white rounded-xl border border-purple-500 shadow-2xl max-w-md mx-auto mt-20 font-sans">
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                React Hybrid Core 🚀
            </h1>
            <p className="text-gray-400 mb-6">
                This component is rendered by React 19, inside the Nexus v5 Vanilla architecture.
            </p>

            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                <span className="text-lg font-mono text-purple-300">Count: {count}</span>
                <button
                    onClick={() => setCount(c => c + 1)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg font-bold"
                >
                    Increment
                </button>
            </div>

            <div className="mt-6 text-xs text-gray-500 text-center">
                Powered by React + Vite + Tailwind (via Style)
            </div>
        </div>
    );
}
