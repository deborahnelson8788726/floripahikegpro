import React, { useState, useEffect } from 'react';
import { Moon, Waves, ArrowUp, ArrowDown, Droplets } from 'lucide-react';

const MoonVisual = ({ phase }) => {
    const getShadowPath = (p) => {
        const r = 28;
        const cx = 32;
        const cy = 32;
        const rx = r * Math.cos(2 * Math.PI * p);
        let d = "";
        if (p < 0.5) {
            d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${Math.abs(rx)} ${r} 0 0 ${rx > 0 ? 1 : 0} ${cx} ${cy - r}`;
        } else {
            d = `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${Math.abs(rx)} ${r} 0 0 ${rx < 0 ? 1 : 0} ${cx} ${cy - r}`;
        }
        return d;
    };

    return (
        <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(180deg)', overflow: 'visible' }}>
            <circle cx="32" cy="32" r="28" fill="#e2e8f0" filter="url(#glow-moon-tides)" />
            {/* Craters */}
            <circle cx="18" cy="20" r="4" fill="#cbd5e1" opacity="0.8" />
            <circle cx="44" cy="25" r="5" fill="#cbd5e1" opacity="0.8" />
            <circle cx="28" cy="42" r="6" fill="#cbd5e1" opacity="0.8" />
            <circle cx="48" cy="48" r="2.5" fill="#cbd5e1" opacity="0.8" />

            <defs>
                <filter id="glow-moon-tides" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path d={getShadowPath(phase)} fill="#0f172a" opacity="0.98" />
        </svg>
    );
};

export default function TidesAndMoon() {
    const [moonPhase, setMoonPhase] = useState(null);
    const [tides, setTides] = useState([]);
    const [nextEvent, setNextEvent] = useState({ label: '', date: '' });
    const [phaseValue, setPhaseValue] = useState(0);

    useEffect(() => {
        // 1. Calculate Moon Phase
        const calculateMoonData = () => {
            const date = new Date();
            const newMoon = new Date('2000-01-06T18:14:00Z');
            const days = (date - newMoon) / (1000 * 60 * 60 * 24);
            const cycle = 29.53058867;
            const phase = (days % cycle) / cycle; // 0-1
            setPhaseValue(phase);

            let name = '';
            // Precise naming
            if (phase < 0.03 || phase > 0.97) name = 'Новолуние';
            else if (phase < 0.25) name = 'Растущая Луна'; // Waxing Crescent
            else if (phase < 0.28) name = 'Первая Четверть';
            else if (phase < 0.5) name = 'Растущая Луна'; // Waxing Gibbous
            else if (phase < 0.53) name = 'Полнолуние';
            else if (phase < 0.75) name = 'Убывающая Луна'; // Waning Gibbous
            else if (phase < 0.78) name = 'Последняя Четверть';
            else name = 'Убывающая Луна'; // Waning Crescent

            // Next event calculation
            let eventLabel = '';
            let targetDate = new Date();
            // Simple logic: if waxing -> next is Full. If waning -> next is New.
            if (phase < 0.5) {
                const daysTo = (0.5 - phase) * cycle;
                targetDate.setDate(date.getDate() + daysTo);
                eventLabel = 'Полнолуние';
            } else {
                const daysTo = (1 - phase) * cycle;
                targetDate.setDate(date.getDate() + daysTo);
                eventLabel = 'Новолуние';
            }

            const dateStr = targetDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

            setMoonPhase({ name });
            setNextEvent({ label: eventLabel, date: dateStr });
        };

        // 2. Mock Tides
        const calculatePseudoTides = () => {
            const now = new Date();
            // Deterministic mock based on day so it doesn't jitter on re-renders, but here simpler is fine for demo

            // Hardcode reasonable times for "Today" visualization
            // High tides usually 12h apart.
            const t1 = new Date(now); t1.setHours(0, 30);
            const t2 = new Date(now); t2.setHours(6, 45);
            const t3 = new Date(now); t3.setHours(12, 15);
            const t4 = new Date(now); t4.setHours(18, 50);

            setTides([
                { time: '00:30', val: '1.2м', type: 'high' },
                { time: '06:45', val: '0.4м', type: 'low' },
                { time: '12:15', val: '1.1м', type: 'high' },
            ]);
        };

        calculateMoonData();
        calculatePseudoTides();
    }, []);

    if (!moonPhase) return null;

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'linear-gradient(to bottom right, #f8fafc, #eff6ff)' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Moon size={18} className="text-slate-700" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', color: '#334155' }}>
                    Луна и Приливы
                </h3>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* MOON VISUAL */}
                <div style={{ flex: '0 0 120px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ marginBottom: '1rem', width: '64px', height: '64px' }}>
                        <MoonVisual phase={phaseValue} />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2, color: '#1e293b', marginBottom: '0.5rem' }}>
                        {moonPhase.name.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {nextEvent.label} {nextEvent.date}
                    </div>
                </div>

                <div style={{ width: '1px', height: '120px', background: '#cbd5e1' }}></div>

                {/* TIDES LIST */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', lineHeight: 1.2 }}>
                        <Waves size={14} />
                        <span>Прогноз приливов<br />(Barra)</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {tides.map((tide, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: '#334155' }}>
                                    {tide.type === 'high'
                                        ? <ArrowUp size={16} className="text-blue-500" />
                                        : <ArrowDown size={16} className="text-orange-500" />
                                    }
                                    {tide.time}
                                </div>
                                <div style={{ fontWeight: 700, color: tide.type === 'high' ? '#3b82f6' : '#f97316' }}>
                                    {tide.val}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ background: '#f1f5f9', padding: '0.75rem 1.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Droplets size={12} style={{ marginTop: '2px' }} />
                    <span style={{ lineHeight: 1.4 }}>Идеальное время для сбора мидий (Marisco) во время отлива.</span>
                </div>
            </div>
        </div>
    );
}

