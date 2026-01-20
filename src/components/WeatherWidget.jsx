import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Gauge, ArrowUp, Moon, Sunrise, Eye, Umbrella, Calendar, AlertTriangle, Map as MapIcon, Navigation, Waves, ArrowDown } from 'lucide-react';

export default function WeatherWidget({ weatherData, loading }) {
    if (loading || !weatherData) return <div className="card">Загрузка погоды...</div>;

    const current = weatherData.current;
    const currentCode = current.weather_code;
    const isDay = current.is_day === 1;
    const daily = weatherData.daily;

    // --- HELPER FUNCTIONS ---
    const calculateMoonPhase = (date) => {
        const d = new Date(date);
        const newMoon = new Date('2000-01-06T18:14:00Z');
        const days = (d - newMoon) / (1000 * 60 * 60 * 24);
        const cycle = 29.53058867;
        const phase = (days % cycle) / cycle;
        return phase; // 0-1
    };

    const getMoonPhase = (date) => {
        const p = calculateMoonPhase(date);
        if (p < 0.03 || p > 0.97) return { name: 'Новолуние', icon: '🌑' };
        if (p < 0.25) return { name: 'Растущая Луна', icon: '🌒' };
        if (p < 0.28) return { name: 'Первая Четверть', icon: '🌓' };
        if (p < 0.5) return { name: 'Растущая Луна', icon: '🌔' };
        if (p < 0.53) return { name: 'Полнолуние', icon: '🌕' };
        if (p < 0.75) return { name: 'Убывающая Луна', icon: '🌖' };
        if (p < 0.78) return { name: 'Последняя Четверть', icon: '🌗' };
        return { name: 'Убывающая Луна', icon: '🌘' };
    };

    const getNextMoonEvent = (date) => {
        const d = new Date(date);
        const cycle = 29.53058867;
        const phase = calculateMoonPhase(d);
        let eventLabel = '';
        let targetDate = new Date(d);

        if (phase < 0.5) {
            const daysTo = (0.5 - phase) * cycle;
            targetDate.setDate(d.getDate() + daysTo);
            eventLabel = 'Полнолуние';
        } else {
            const daysTo = (1 - phase) * cycle;
            targetDate.setDate(d.getDate() + daysTo);
            eventLabel = 'Новолуние';
        }
        return `${eventLabel} ${targetDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`;
    };

    const moon = getMoonPhase(new Date());
    const nextMoonEvent = getNextMoonEvent(new Date());

    // Mock Tides Data (as per screenshot requirement)
    const tides = [
        { time: '00:30', val: '1.2м', type: 'high' },
        { time: '06:45', val: '0.4м', type: 'low' },
        { time: '12:15', val: '1.1м', type: 'high' },
    ];

    const getWeatherIcon = (code, isDay, size = 20) => {
        // Authentic Apple Weather Colors
        if (code <= 1 && !isDay) return <Moon size={size} className="text-slate-300" fill="currentColor" strokeWidth={0} />;
        if (code <= 1) return <Sun size={size} className="text-yellow-400" fill="currentColor" strokeWidth={0} />;
        if (code <= 3) return <Cloud size={size} className="text-gray-300" fill="currentColor" strokeWidth={0} />;
        if (code > 3 && code < 95) return <CloudRain size={size} className="text-blue-400" fill="currentColor" strokeWidth={0} />;
        return <CloudRain size={size} className="text-indigo-400" fill="currentColor" strokeWidth={0} />;
    };

    const getWeatherDescription = (code) => {
        const codes = {
            0: 'Ясно', 1: 'Преим. ясно', 2: 'Перем. облачность', 3: 'Пасмурно',
            45: 'Туман', 48: 'Туман', 51: 'Морось', 53: 'Морось', 55: 'Морось',
            61: 'Дождь', 63: 'Дождь', 65: 'Сильный дождь', 80: 'Ливень', 81: 'Ливень',
            95: 'Гроза', 99: 'Град'
        };
        return codes[code] || 'Неизвестно';
    };

    const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.getDate() === today.getDate()) return 'Сегодня';
        // Capitalize first letter for Russian layout consistency
        const day = date.toLocaleDateString('ru-RU', { weekday: 'short' });
        return day.charAt(0).toUpperCase() + day.slice(1);
    };

    // --- SUB-COMPONENTS (Dark Theme) ---

    // 1. Apple-style Translucent Card
    const DarkCard = ({ title, icon: Icon, children, className, style }) => (
        <div style={{
            background: 'rgba(20, 60, 30, 0.4)', // Semi-transparent dark green
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            ...style
        }} className={className}>
            {title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', opacity: 0.7 }}>
                    {Icon && <Icon size={14} />}
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{title}</span>
                </div>
            )}
            {children}
        </div>
    );

    // 2. 10-Day Row
    const ForecastRow = ({ time, max, min, code }) => {
        const range = 40;
        const left = ((min - 5) / range) * 100;
        const width = ((max - min) / range) * 100;
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ width: '50px', fontWeight: 600, fontSize: '1rem' }}>{getDayName(time)}</span>
                <div style={{ width: '30px', display: 'flex', justifyContent: 'center' }}>{getWeatherIcon(code, true, 20)}</div>
                <div style={{ flex: 1, margin: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', opacity: 0.7, width: '25px', textAlign: 'right' }}>{Math.round(min)}°</span>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute', left: `${Math.max(0, left)}%`, width: `${Math.max(10, width)}%`, height: '100%',
                            background: 'linear-gradient(90deg, #68d391, #facc15, #f87171)', borderRadius: '2px'
                        }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, width: '25px' }}>{Math.round(max)}°</span>
                </div>
            </div>
        );
    };

    // 3. Sun Curve SVG
    const SunCurve = ({ isDay }) => (
        <div style={{ position: 'relative', height: '50px', width: '100%', marginTop: 'auto' }}>
            <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <path d="M5,45 Q50,0 95,45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M5,45 Q50,0 95,45" fill="none" stroke="url(#sun-grad)" strokeWidth="3" strokeDasharray="100" strokeDashoffset={isDay ? "0" : "100"} />
                <circle cx="50" cy="22.5" r="4" fill="#FDB813" style={{ opacity: isDay ? 1 : 0 }} />
                <defs>
                    <linearGradient id="sun-grad" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#FDB813" /><stop offset="100%" stopColor="#F97316" /></linearGradient>
                </defs>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '-10px', opacity: 0.7 }}>
                <span>Восход</span><span>Закат</span>
            </div>
        </div>
    );

    // 4. Moon Visual (Gray Crater Style)
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
            <svg width="50" height="50" viewBox="0 0 64 64" style={{ transform: 'rotate(180deg)', overflow: 'visible' }}>
                <circle cx="32" cy="32" r="28" fill="#e2e8f0" filter="url(#glow-moon)" />
                <circle cx="18" cy="20" r="4" fill="#cbd5e1" opacity="0.8" />
                <circle cx="44" cy="25" r="5" fill="#cbd5e1" opacity="0.8" />
                <circle cx="28" cy="42" r="6" fill="#cbd5e1" opacity="0.8" />
                <circle cx="48" cy="48" r="2.5" fill="#cbd5e1" opacity="0.8" />
                <defs>
                    <filter id="glow-moon" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <path d={getShadowPath(phase)} fill="#052e16" opacity="0.98" />
            </svg>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div style={{
            background: 'linear-gradient(to bottom, #1a3c20, #052e16)', // Deep Forest Green
            color: 'white',
            borderRadius: '24px',
            padding: '2rem',
            fontFamily: '-apple-system, system-ui, sans-serif',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}>
            {/* HEADER */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 500, letterSpacing: '0.02em' }}>Флорианополис</div>
                <div style={{ fontSize: '5rem', fontWeight: 200, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {Math.round(current.temperature_2m)}°
                </div>
                <div style={{ fontSize: '1.2rem', opacity: 0.7, fontWeight: 500, marginTop: '0.25rem' }}>
                    {getWeatherDescription(currentCode)}  |  Ощущается: {Math.round(current.apparent_temperature)}°
                </div>
            </div>

            {/* GRID LAYOUT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* ROW 1: Alerts & Wind Map */}
                <div className="weather-grid-row">
                    {/* Alert Card */}
                    <DarkCard title="Штормовое Предупреждение" icon={AlertTriangle}>
                        <div style={{ marginTop: '0.5rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#60a5fa' }}>Предупреждение о ветре</h4>
                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.4 }}>
                                Ожидается сильный ветер на южном побережье (Naufragados). Порывы до 65 км/ч с 14:00.
                            </p>
                            <div style={{ marginTop: '1rem', height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.6 }}>Источник: Defesa Civil SC</div>
                        </div>
                    </DarkCard>

                    {/* Wind Map Visual */}
                    <DarkCard title="Карта Ветра" icon={MapIcon} style={{
                        background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/floripa-map.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '160px'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <Navigation size={32} style={{ transform: `rotate(${current.wind_direction_10m}deg)` }} />
                            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.5rem' }}>{Math.round(current.wind_speed_10m)} км/ч</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Порывы {Math.round(current.wind_gusts_10m)} км/ч</div>
                        </div>
                    </DarkCard>
                </div>

                {/* ROW 2: Hourly Scroll */}
                <DarkCard style={{ padding: '1rem 0' }}>
                    <div style={{ padding: '0 1.5rem 0.5rem 1.5rem', fontSize: '0.8rem', opacity: 0.7, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
                        Ясное небо ожидается около 17:00
                    </div>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '2rem', padding: '1rem 1.5rem', scrollbarWidth: 'none' }}>
                        {(() => {
                            const now = new Date();
                            now.setMinutes(0, 0, 0); // Round to hour
                            // Find index where time is now or future
                            const startIndex = weatherData.hourly.time.findIndex(t => new Date(t) >= now);
                            const safeStart = startIndex !== -1 ? startIndex : 0;

                            // Show next 25 hours (covers "Tomorrow")
                            return weatherData.hourly.time.slice(safeStart, safeStart + 25).map((t, i) => {
                                const originalIndex = safeStart + i;
                                const date = new Date(t);
                                const h = date.getHours();
                                const isNow = i === 0;
                                // Approx day/night for icons (6 to 19 is day)
                                const hourIsDay = h >= 6 && h <= 19;

                                return (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '40px' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{isNow ? 'Сейчас' : `${h}:00`}</span>
                                        {getWeatherIcon(weatherData.hourly.weather_code[originalIndex], hourIsDay, 24)}
                                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{Math.round(weatherData.hourly.temperature_2m[originalIndex])}°</span>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </DarkCard>

                {/* ROW 3: Mega Grid (10-Day + Bento) */}
                <div className="weather-mega-grid">

                    {/* COL 1: 10-Day Forecast */}
                    <DarkCard title="Прогноз на 10 дней" icon={Calendar}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {daily.time.map((t, i) => (
                                <ForecastRow key={i} time={t} max={daily.temperature_2m_max[i]} min={daily.temperature_2m_min[i]} code={daily.weather_code[i]} />
                            ))}
                        </div>

                        {/* MOON & TIDES INFO (Integrated) */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

                                {/* 1. Moon Side */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <MoonVisual phase={calculateMoonPhase(new Date())} />
                                    </div>
                                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', lineHeight: 1.2 }}>{moon.name}</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.2rem' }}>
                                        {nextMoonEvent}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div style={{ width: '1px', height: '80px', background: 'rgba(255,255,255,0.1)' }}></div>

                                {/* 2. Tides Side */}
                                <div style={{ flex: 1.2 }}>
                                    <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Waves size={12} /> Прогноз приливов <br /> (Barra)
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {tides.map((tide, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.9 }}>
                                                    {tide.type === 'high' ? <ArrowUp size={12} className="text-blue-400" /> : <ArrowDown size={12} className="text-orange-400" />}
                                                    {tide.time}
                                                </div>
                                                <div style={{ fontWeight: 600, color: tide.type === 'high' ? '#60a5fa' : '#fb923c' }}>{tide.val}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Tides Advice */}
                            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: 'rgba(255,255,255,0.8)' }}>
                                <Droplets size={14} className="flex-shrink-0 mt-[2px] text-blue-300" />
                                <span style={{ lineHeight: 1.4 }}>Идеальное время для сбора мидий (Marisco) во время отлива.</span>
                            </div>
                        </div>
                    </DarkCard>

                    {/* COL 2: Bento Grid of Stats */}
                    <div className="weather-bento-grid">

                        {/* UV Index */}
                        <DarkCard title="УФ-ИНДЕКС" icon={Sun} style={{ height: '160px' }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Низкий до конца дня</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0.5rem 0' }}>{weatherData.hourly.uv_index[0]}</div>
                            <div style={{ height: '4px', background: 'linear-gradient(90deg, green, yellow, red, purple)', borderRadius: '2px', width: '100%' }}>
                                <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '50%', marginTop: '-3px', marginLeft: `${(weatherData.hourly.uv_index[0] / 11) * 100}%`, border: '2px solid #1a3c20' }}></div>
                            </div>
                        </DarkCard>

                        {/* Sunrise/Sunset */}
                        <DarkCard title="ВОСХОД" icon={Sunrise} style={{ height: '160px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 500 }}>{formatTime(daily.sunrise[0])}</div>
                            <SunCurve isDay={isDay} />
                        </DarkCard>

                        {/* Wind */}
                        <DarkCard title="ВЕТЕР" icon={Wind} style={{ height: '160px' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                {/* Circular Compass UI */}
                                <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ position: 'absolute', top: 2, fontSize: '0.6rem', fontWeight: 'bold' }}>С</span>
                                    <span style={{ position: 'absolute', right: 4, fontSize: '0.6rem', fontWeight: 'bold' }}>В</span>
                                    <span style={{ position: 'absolute', bottom: 2, fontSize: '0.6rem', fontWeight: 'bold' }}>Ю</span>
                                    <span style={{ position: 'absolute', left: 4, fontSize: '0.6rem', fontWeight: 'bold' }}>З</span>
                                    <ArrowUp size={32} style={{ transform: `rotate(${current.wind_direction_10m}deg)` }} fill="white" />
                                </div>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px' }}>{Math.round(current.wind_speed_10m)}</div>
                                </div>
                            </div>
                        </DarkCard>

                        {/* Visibility or Rain */}
                        <DarkCard title="ОСАДКИ" icon={Umbrella} style={{ height: '160px' }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>За 24 часа</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 500, margin: 'auto 0' }}>{daily.precipitation_sum[0]} мм</div>
                        </DarkCard>

                        {/* Feels Like */}
                        <DarkCard title="ОЩУЩАЕТСЯ" icon={Thermometer} style={{ height: '160px' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 500 }}>{Math.round(current.apparent_temperature)}°</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 'auto' }}>Из-за ветра холоднее.</div>
                        </DarkCard>

                        {/* Humidity */}
                        <DarkCard title="ВЛАЖНОСТЬ" icon={Droplets} style={{ height: '160px' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 500 }}>{current.relative_humidity_2m}%</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 'auto' }}>Точка росы сейчас 18°.</div>
                        </DarkCard>

                        {/* Visibility */}
                        <DarkCard title="ВИДИМОСТЬ" icon={Eye} style={{ height: '160px' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 500 }}>{Math.round(current.visibility / 1000)} км</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: 'auto' }}>Отличная видимость.</div>
                        </DarkCard>

                        {/* Pressure */}
                        <DarkCard title="ДАВЛЕНИЕ" icon={Gauge} style={{ height: '160px' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ borderTop: '10px solid white', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', width: '80px', height: '40px', borderRadius: '80px 80px 0 0', opacity: 0.2 }}></div>
                                <div style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 700 }}>{Math.round(current.surface_pressure)}</div>
                            </div>
                            <div style={{ textAlign: 'center', width: '100%', fontSize: '0.8rem', opacity: 0.7 }}>гПа</div>
                        </DarkCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
