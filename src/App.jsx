import { useState, useEffect } from 'react'
import WeatherWidget from './components/WeatherWidget'
import NewsFeed from './components/NewsFeed'
import TrailsGuide from './components/TrailsGuide'
import SatelliteMap from './components/SatelliteMap'
import EnvironmentalMap from './components/EnvironmentalMap'
import InteractiveMap from './components/InteractiveMap'
import TrailSuggester from './components/TrailSuggester'
import SmartTrailFilters from './components/SmartTrailFilters'
import CommunityReportsTicker from './components/CommunityReportsTicker'
import LocalRiskInfo from './components/LocalRiskInfo'
import ChecklistPrep from './components/ChecklistPrep'
import TidesAndMoon from './components/TidesAndMoon'
import { trails } from './data/trails'
import { calculateTrailScore } from './utils/scoringAlgorithm'

function App() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [filters, setFilters] = useState({
        weather: 'any',
        difficulty: 'any',
        duration: 'any',
        signal: false,
        noMud: false
    });
    const [selectedTrail, setSelectedTrail] = useState(null);

    const handleTrailSelect = (trail) => {
        setSelectedTrail(trail);
        // Scroll to map
        const mapElement = document.getElementById('interactive-map');
        if (mapElement) {
            mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    useEffect(() => {
        const fetchWeather = () => {
            const lat = -27.5969;
            const lon = -48.5495;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&hourly=temperature_2m,weather_code,uv_index&timezone=America%2FSao_Paulo`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const enrichedWeather = {
                        ...data,
                        recentRain24h: data.daily.precipitation_sum[0] || 0
                    };
                    setWeather(enrichedWeather);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching weather:", err);
                    setLoading(false);
                });
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000); // 5 minutes

        return () => clearInterval(interval);
    }, []);

    const scoredTrails = weather ? trails.map(trail => {
        const extraction = calculateTrailScore(trail, weather, alerts);
        return { ...trail, algorithm: extraction };
    }) : trails;

    const filteredTrails = scoredTrails.filter(trail => {
        if (filters.difficulty !== 'any' && trail.technical.difficulty !== filters.difficulty) return false;
        if (filters.signal && !trail.technical.cellSignal) return false;
        if (filters.duration !== 'any') {
            const mins = trail.technical.durationMins;
            if (filters.duration === 'short' && mins >= 60) return false;
            if (filters.duration === 'medium' && (mins < 60 || mins > 180)) return false;
            if (filters.duration === 'long' && mins <= 180) return false;
        }
        if (filters.noMud && weather?.recentRain24h > 2) return false;
        return true;
    }).sort((a, b) => {
        const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
        const diffA = difficultyOrder[a.technical.difficulty] || 4;
        const diffB = difficultyOrder[b.technical.difficulty] || 4;
        return diffA - diffB;
    });

    return (
        <div className="container dashboard-pro" style={{
            minHeight: '100vh',
            color: '#1d1d1f'
        }}>
            <header style={{
                padding: '5rem 0',
                marginBottom: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5)), url("/header-bg-nature.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 35%',
                borderRadius: '24px',
                color: '#fff',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                maxWidth: '800px',
                width: '100%',
                margin: '0 auto 3rem auto'
            }}>
                <div style={{ marginBottom: '1.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                    <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#f0fdf4', fontWeight: 700, marginBottom: '0.5rem', opacity: 0.9 }}>
                        Осн. 2026 • Санта-Катарина
                    </div>
                    <h1 style={{
                        fontSize: '4.5rem',
                        margin: 0,
                        fontWeight: 400,
                        letterSpacing: '-0.03em',
                        color: '#fff',
                        fontFamily: '"Georgia", serif',
                        lineHeight: 1
                    }}>
                        Floripa Hiking PRO
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#f0fdf4',
                        margin: '1rem 0 0 0',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        fontFamily: '"Georgia", serif',
                        lineHeight: 1.6,
                        opacity: 0.95
                    }}>
                        Оперативное руководство по диким тропам острова.
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '0.5rem 1rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    backdropFilter: 'blur(4px)'
                }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></span>
                    <span style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>В РАБОТЕ / БЕЗОПАСНО</span>
                </div>
            </header>

            {/* SINGLE COLUMN LAYOUT (Mobile Optimized Order 1-11) */}
            <main style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

                {/* 1) Прогноз погоды */}
                <WeatherWidget weatherData={weather} loading={loading} />

                {/* 2) Рекомендации недели */}
                <TrailSuggester />

                {/* 3) 📰 Новости хайкинга Флорипы */}
                <NewsFeed />

                {/* 4) 🗺️ ИНТЕРАКТИВНАЯ КАРТА МАРШРУТОВ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.5rem 0 0 0' }}>🗺️ ИНТЕРАКТИВНАЯ КАРТА МАРШРУТОВ</h2>
                    <InteractiveMap selectedTrail={selectedTrail} />
                </div>

                {/* 5) Умные фильтры (PRO) и 🏔️ Оперативный статус маршрутов */}
                <div className="card" style={{ padding: 0, overflow: 'visible' }}>
                    <SmartTrailFilters onFilterChange={setFilters} />
                    <TrailsGuide trails={filteredTrails} onTrailSelect={handleTrailSelect} />
                </div>

                {/* 6) 🌱 ЭКОЛОГИЧЕСКАЯ ОБСТАНОВКА */}
                <EnvironmentalMap />

                {/* 7) 🌪️ Карта Ветра и Циклонов (Live) */}
                <SatelliteMap />

                {/* 8) Офлайн-чеклисты */}
                <ChecklistPrep />

                {/* 9) ⚖️ Правила принятия решений */}
                <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>
                        ⚖️ Правила принятия решений
                    </h3>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#4a5568', lineHeight: '1.6', margin: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><b>ПОСЛЕ ДОЖДЯ:</b> Не выходить в течение 48ч после сильных ливней (риск оползней и селей).</li>
                        <li style={{ marginBottom: '0.5rem' }}><b>ВЕТЕР:</b> При порывах {'>'} 30км/ч избегать открытых гребней (Coroa) и скалистых берегов (Matadeiro).</li>
                        <li style={{ marginBottom: '0.5rem' }}><b>ЖАРА:</b> В пик {'>'} 30°C только лесные маршруты (Costa da Lagoa, Peri).</li>
                    </ul>
                </div>

                {/* 10) 🛡️ Сводка локальных рисков */}
                <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.4)' }}>
                    <LocalRiskInfo />
                </div>



                {/* 11) Оперативные отчеты сообщества */}
                <CommunityReportsTicker />

            </main>

            <footer style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', color: '#94a3b8', fontSize: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
                    <span>OFFICIAL DATA: Open-Meteo API</span>
                    <span>SAFETY: Defesa Civil SC</span>
                    <span>ENV: IMA/SC</span>
                </div>
                <p>FLORIPA HIKING PRO ENGINE v2.6.3 • 2026 Operational Dashboard</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.6 }}>Данный инструмент предназначен исключительно для опытных хайкеров. <br />Разработчики не несут ответственности за ваши решения в горах.</p>
            </footer>
        </div >
    )
}

export default App
