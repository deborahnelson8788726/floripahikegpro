import { useState, useEffect } from 'react';
import { trails } from '../data/trails';
import { Sun, Cloud, Wind, CloudRain, MapPin, Calendar, ArrowRight, TrendingUp } from 'lucide-react';

export default function TrailSuggester() {
    const [suggestedTrail, setSuggestedTrail] = useState(null);
    const [alternatives, setAlternatives] = useState([]);
    const [reason, setReason] = useState("");

    useEffect(() => {
        // Rotation Logic
        const getSuggestion = () => {
            const today = new Date();
            const oneDay = 24 * 60 * 60 * 1000;
            const twoWeeksIndex = Math.floor(today.getTime() / (14 * oneDay));
            const trailIndex = twoWeeksIndex % trails.length;
            const mainTrail = trails[trailIndex];

            // Get 3 alternatives (just next ones in array for simplicity)
            const alts = [
                trails[(trailIndex + 1) % trails.length],
                trails[(trailIndex + 2) % trails.length],
                trails[(trailIndex + 3) % trails.length]
            ];

            let reasonText = "";
            let icon = null;

            switch (mainTrail.bestFor) {
                case "sunny":
                    reasonText = "Отличная погода для панорамных видов! ☀️";
                    icon = <Sun size={18} className="text-yellow-500" />;
                    break;
                case "cloudy":
                    reasonText = "Идеально для прохладной прогулки без жары ☁️";
                    icon = <Cloud size={18} className="text-gray-500" />;
                    break;
                case "windy":
                    reasonText = "Свежий ветер с океана освежит на этом маршруте 🌬️";
                    icon = <Wind size={18} className="text-blue-400" />;
                    break;
                case "rainy":
                    reasonText = "Водопады сейчас особенно полноводны! 🌧️";
                    icon = <CloudRain size={18} className="text-blue-600" />;
                    break;
                default:
                    reasonText = "Маршрут недели, который стоит посетить!";
                    icon = <Calendar size={18} className="text-green-500" />;
            }

            setSuggestedTrail(mainTrail);
            setAlternatives(alts);
            setReason({ text: reasonText, icon: icon });
        };

        getSuggestion();
    }, []);

    if (!suggestedTrail) return null;

    const scrollToTrail = (id) => {
        const element = document.getElementById(`trail-${id}`);
        if (element) {
            // Remove selection from others
            document.querySelectorAll('.card-selected').forEach(c => c.classList.remove('card-selected'));

            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('card-selected');
        }
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.05)',
            marginBottom: '1.5rem'
        }}>
            {/* Header - now part of the card flow, or could be separate? Let's keep inside but spans full width or just top left? */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <TrendingUp size={24} className="text-green-700" />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, fontFamily: '"Georgia", serif', color: '#1a3c20' }}>
                    Рекомендация Недели
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', alignItems: 'start' }}>

                {/* LEFT: Featured Trail */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '280px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <img
                            src={suggestedTrail.image}
                            alt={suggestedTrail.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                            padding: '1.5rem', color: 'white'
                        }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, marginBottom: '0.5rem', fontFamily: '"Georgia", serif', color: '#fff' }}>{suggestedTrail.name}</h3>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>
                                <span>⏱️ {suggestedTrail.duration}</span>
                                <span>📏 {suggestedTrail.distance}</span>
                                <span>⛰️ {suggestedTrail.difficulty}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                        <div style={{ flex: 1, background: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#166534', fontWeight: 500 }}>
                            {reason.icon}
                            {reason.text}
                        </div>
                        <button
                            onClick={() => scrollToTrail(suggestedTrail.id)}
                            style={{
                                background: '#1a3c20',
                                color: '#fff',
                                padding: '0 1.5rem',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            <MapPin size={18} /> Переити
                        </button>
                    </div>
                </div>

                {/* RIGHT: Alternatives */}
                <div style={{ background: '#f8faf9', padding: '1.5rem', borderRadius: '16px', height: '100%', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: '#718096', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                        Другие отличные варианты
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {alternatives.map(trail => (
                            <div key={trail.id}
                                onClick={() => scrollToTrail(trail.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '0.75rem', borderRadius: '12px',
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#48bb78'; e.currentTarget.style.transform = 'translateX(4px)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateX(0)' }}
                            >
                                <img src={trail.image} alt="" style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#2d3748', fontFamily: '"Georgia", serif' }}>{trail.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>{trail.distance} • {trail.difficulty}</div>
                                </div>
                                <ArrowRight size={16} className="text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
