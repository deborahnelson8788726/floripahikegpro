import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { beachQualityData, airQualityData, marineLifeData } from '../data/environmentalData';
import { Waves, Wind, Fish, AlertCircle, Info } from 'lucide-react';

export default function EnvironmentalMap() {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const layerGroups = useRef({
        water: L.layerGroup(),
        air: L.layerGroup(),
        marine: L.layerGroup()
    });

    const [layers, setLayers] = useState({
        water: true,
        air: true,
        marine: true
    });

    useEffect(() => {
        if (!mapRef.current) return;
        if (mapInstance.current) return;

        // Initialize Map
        mapInstance.current = L.map(mapRef.current).setView([-27.6, -48.5], 10);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(mapInstance.current);

        // Add Layer Groups to Map
        layerGroups.current.water.addTo(mapInstance.current);
        layerGroups.current.air.addTo(mapInstance.current);
        layerGroups.current.marine.addTo(mapInstance.current);

    }, []);

    // Update Layers
    useEffect(() => {
        if (!mapInstance.current) return;

        const { water, air, marine } = layerGroups.current;
        water.clearLayers();
        air.clearLayers();
        marine.clearLayers();

        if (layers.water) {
            beachQualityData.forEach(beach => {
                const color = beach.status === 'suitable' ? '#22c55e' : '#ef4444';
                const statusText = beach.status === 'suitable' ? 'Пригодно для купания' : 'НЕ ПРИГОДНО';

                L.circleMarker(beach.coords, {
                    radius: 8,
                    fillColor: color,
                    color: '#fff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.9
                }).bindPopup(`
                    <div style="font-family: sans-serif;">
                        <h4 style="margin: 0 0 4px 0;">${beach.name}</h4>
                        <div style="font-weight: bold; color: ${color}; margin-bottom: 4px;">${statusText}</div>
                        <div style="font-size: 0.8rem; color: #666;">Источник: ${beach.source}</div>
                        <div style="font-size: 0.8rem; color: #666;">Обновлено: ${beach.update}</div>
                    </div>
                `).addTo(water);
            });
        }

        if (layers.air) {
            airQualityData.forEach(station => {
                let color = '#22c55e';
                if (station.status === 'moderate') color = '#eab308';
                if (station.status === 'poor') color = '#f97316';
                if (station.status === 'unhealthy') color = '#ef4444';

                L.circleMarker(station.coords, {
                    radius: 12,
                    fillColor: color,
                    color: color,
                    weight: 1,
                    opacity: 0.5,
                    fillOpacity: 0.3
                }).bindPopup(`
                    <div style="font-family: sans-serif;">
                        <h4 style="margin: 0 0 4px 0;">Станция: ${station.location}</h4>
                        <div style="display: flex; gap: 10px; margin-bottom: 4px;">
                            <span>AQI: <b>${station.aqi}</b></span>
                            <span>PM2.5: <b>${station.pm25}</b></span>
                        </div>
                        <div style="font-size: 0.8rem; color: #666;">Обновлено: ${station.update}</div>
                    </div>
                `).addTo(air);
            });
        }

        if (layers.marine) {
            marineLifeData.forEach(item => {
                const isWhale = item.type === 'whale';
                const emoji = isWhale ? '🐋' : '🪼';
                const color = isWhale ? '#3b82f6' : '#a855f7';

                const icon = L.divIcon({
                    className: 'custom-marine-icon',
                    html: `<div style="font-size: 20px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${emoji}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                L.marker(item.coords, { icon }).bindPopup(`
                    <div style="font-family: sans-serif;">
                        <h4 style="margin: 0 0 4px 0;">${isWhale ? 'Наблюдение китов' : 'Медузы'}</h4>
                        <div style="margin-bottom: 4px;">${item.note}</div>
                        <div style="font-size: 0.8rem; color: #666;">Локация: ${item.location}</div>
                        <div style="font-size: 0.75rem; color: #888; margin-top: 4px; font-style: italic;">
                            ${isWhale ? 'Сезонное явление' : 'Берегитесь ожогов'}
                        </div>
                    </div>
                `).addTo(marine);
            });
        }

    }, [layers]);

    const toggleLayer = (layerName) => {
        setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
    };

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '500px' }}>
            <div style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1a202c' }}>
                    🌱 ЭКОЛОГИЧЕСКАЯ ОБСТАНОВКА
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => toggleLayer('water')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0', background: layers.water ? '#f0fdf4' : '#fff', color: layers.water ? '#166534' : '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        <Waves size={14} /> Вода
                    </button>
                    <button
                        onClick={() => toggleLayer('air')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0', background: layers.air ? '#fffbeb' : '#fff', color: layers.air ? '#b45309' : '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        <Wind size={14} /> Воздух
                    </button>
                    <button
                        onClick={() => toggleLayer('marine')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #e2e8f0', background: layers.marine ? '#eff6ff' : '#fff', color: layers.marine ? '#1e40af' : '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                        <Fish size={14} /> Фауна
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

                {/* Legend Overlay */}
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(255, 255, 255, 0.9)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', zIndex: 1000, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Легенда:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span> Вода safe / Air good</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span> Вода unsafe / Air bad</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }}></span> Air moderate</div>
                </div>
            </div>
        </div>
    );
}
