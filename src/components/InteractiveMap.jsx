import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trails } from '../data/trails';

export default function InteractiveMap({ selectedTrail }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return;

        // Initialize Map
        mapInstance.current = L.map(mapRef.current).setView([-27.6, -48.5], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapInstance.current);

        // Add Markers
        trails.forEach(trail => {
            let color = '#22c55e'; // green
            if (trail.technical.difficulty === 'medium') color = '#eab308'; // yellow
            if (trail.technical.difficulty === 'hard') color = '#ef4444'; // red

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });

            const marker = L.marker(trail.technical.coords, { icon }).addTo(mapInstance.current);

            // Interaction: Click marker -> Highlight Card
            marker.on('click', () => {
                const el = document.getElementById(`trail-${trail.id}`);
                if (el) {
                    // Remove selection from others
                    document.querySelectorAll('.card-selected').forEach(c => c.classList.remove('card-selected'));

                    // Scroll and Select
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('card-selected');
                }
            });

            // Store marker reference
            markersRef.current[trail.id] = marker;

            marker.bindPopup(`
                <div style="font-family: sans-serif; min-width: 150px;">
                    <img src="${trail.image}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
                    <h4 style="margin: 0 0 4px 0; font-size: 0.9rem;">${trail.name}</h4>
                    <div style="font-size: 0.75rem; color: #666; margin-bottom: 8px;">${trail.difficulty} • ${trail.duration}</div>
                    <button onclick="(function(){
                        const el = document.getElementById('trail-${trail.id}');
                        if(el) {
                            // Remove selection from others
                            document.querySelectorAll('.card-selected').forEach(c => c.classList.remove('card-selected'));
                            
                            // Scroll and Select
                            el.scrollIntoView({behavior:'smooth', block: 'center'});
                            el.classList.add('card-selected');
                        }
                    })()" 
                            style="width: 100%; padding: 4px; background: #1a202c; color: white; border: none; border-radius: 4px; font-size: 0.7rem; cursor: pointer;">
                        Смотреть детали
                    </button>
                </div>
            `);
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // NEW Effect: React to selectedTrail changes
    useEffect(() => {
        if (selectedTrail && mapInstance.current && markersRef.current[selectedTrail.id]) {
            const marker = markersRef.current[selectedTrail.id];
            mapInstance.current.flyTo(marker.getLatLng(), 13, { duration: 1.5 });
            marker.openPopup();
        }
    }, [selectedTrail]);

    return (
        <div
            id="interactive-map"
            className="card"
            ref={mapRef}
            style={{
                padding: 0,
                overflow: 'hidden',
                height: '500px',
                gridColumn: '1 / -1',
                zIndex: 1, // Ensure it doesn't overlap header wrongly but shows popups
                background: '#e5e7eb'
            }}
        />
    );
}
