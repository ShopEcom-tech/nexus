import React from 'react';
import ReactDOM from 'react-dom/client';
import FeatureExplorer from './components/FeatureExplorer';
import './tailadmin_layer/index.css'; // Ensure Tailwind styles are loaded

const featuresRoot = document.getElementById('react-features-root');

if (featuresRoot) {
    ReactDOM.createRoot(featuresRoot).render(
        <React.StrictMode>
            <FeatureExplorer />
        </React.StrictMode>
    );
    console.log('🚀 FeatureExplorer Mounted');
} else {
    console.warn('⚠️ React root #react-features-root not found');
}
