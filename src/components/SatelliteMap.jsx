export default function SatelliteMap() {
    return (
        <div className="card satellite-map">
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>🌪️ Карта Ветра и Циклонов (Live)</h2>
            <div style={{ width: '100%', height: '350px', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <iframe
                    width="100%"
                    height="350"
                    src="https://embed.windy.com/embed2.html?lat=-27.595&lon=-48.548&zoom=9&level=surface&overlay=wind&menu=&message=&marker=&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
                    frameBorder="0"
                    style={{ display: 'block' }}
                ></iframe>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#718096' }}>
                Карта показывает ветер и движение циклонов в реальном времени. Используйте для планирования безопасных походов.
            </p>
        </div>
    );
}
