import { AlertTriangle, Info, Calendar } from 'lucide-react';

import { trails } from '../data/trails';

export default function NewsFeed({ weather }) {
    // 1. Helper for seeded random (stable for 24h)
    const getSeededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const now = new Date();
    const daySeed = now.getDate() + (now.getMonth() + 1) * 31 + now.getFullYear() * 365;

    // 2. Dynamic Daily Update (Weather)
    const getDailyUpdate = () => {
        const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
        const dateStr = `${now.getDate()} ${months[now.getMonth()]}`;

        let weatherText = "Загрузка данных погоды...";
        if (weather && weather.current) {
            const temp = Math.round(weather.current.temperature_2m);
            const wind = Math.round(weather.current.wind_speed_10m);
            const isStormy = wind > 30 || (weather.current.precipitation > 0);

            weatherText = `• ${isStormy ? '⚠️ Осторожно: Возможен шторм/осадки' : '✅ Погодные условия благоприятные'}.
• Температура: ${temp}°C, ветер ${wind} км/ч.
• Качество воды: Проверьте карту IMA (обновляется еженедельно).
• Следите за обновлениями Defesa Civil.`;
        }

        return {
            id: 101,
            type: 'daily',
            title: `⚡ Daily Update: ${dateStr}`,
            date: "Сегодня",
            content: weatherText,
            source: "Weather Radar / Defesa Civil",
            url: "https://www.defesacivil.sc.gov.br/categoria/alerta/"
        };
    };

    // 3. Procedural News Generator
    const generateDynamicNews = () => {
        const generated = [];
        const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

        // A. Seasonal Warning (Based on Month)
        const month = now.getMonth(); // 0-11
        let seasonalAlert = null;
        if (month >= 11 || month <= 2) { // Summer
            seasonalAlert = {
                title: "Сезон жары: Высокий риск перегрева",
                content: "В летний период избегайте открытых троп (Lagoinha, Galheta) с 11:00 до 15:00. Берите минимум 2л воды."
            };
        } else if (month >= 5 && month <= 7) { // Winter
            seasonalAlert = {
                title: "Зимний сезон: Ранний закат",
                content: "Темнеет рано (17:30). Планируйте возвращение заранее и всегда берите налобный фонарь."
            };
        } else { // Shoulder
            seasonalAlert = {
                title: "Межсезонье: Активность фауны",
                content: "Сезон миграции птиц и активности мелкой фауны. Будьте внимательны на лесных участках."
            };
        }

        generated.push({
            id: 201,
            type: 'warning',
            title: seasonalAlert.title,
            date: `Сезон ${now.getFullYear()}`,
            content: seasonalAlert.content,
            source: "Floripa Safe Hiking",
            url: "#"
        });

        // B. Dynamic Trail Update (Random Trail)
        const trailIndex = Math.floor(getSeededRandom(daySeed) * trails.length);
        const randomTrail = trails[trailIndex];
        const updates = [
            "Проведена расчистка тропы волонтерами. Путь свободен.",
            "Наблюдается небольшая эрозия после дождей, будьте осторожны.",
            "Установлены новые указатели на развилках.",
            "Идеальные условия для посещения на этой неделе."
        ];
        const updateText = updates[Math.floor(getSeededRandom(daySeed + 1) * updates.length)];

        generated.push({
            id: 202,
            type: 'info',
            title: `Обновление: ${randomTrail.name}`,
            date: `${now.getDate()} ${months[now.getMonth()]}`,
            content: updateText,
            source: "Community Report",
            url: "#"
        });

        // C. Weekend Event (If Fri/Sat/Sun)
        const day = now.getDay();
        if (day === 5 || day === 6 || day === 0) {
            const nextDay = day === 5 ? "Субботу" : "Воскресенье";
            const eventTrailIndex = Math.floor(getSeededRandom(daySeed + 2) * trails.length);
            const eventTrail = trails[eventTrailIndex];

            generated.push({
                id: 203,
                type: 'event',
                title: `Групповой поход: ${eventTrail.name}`,
                date: "В эти выходные",
                content: `Открытый сбор группы на ${nextDay}. Старт в 08:00. Участие бесплатное, уровень: ${eventTrail.difficulty}.`,
                source: "Trilheiros da Ilha",
                url: "#"
            });
        }

        return generated;
    };

    const news = [getDailyUpdate(), ...generateDynamicNews()];

    const getIcon = (type) => {
        switch (type) {
            case 'daily': return <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FCD34D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>;
            case 'warning': return <AlertTriangle className="text-red-500" size={20} />;
            case 'info': return <Info className="text-blue-500" size={20} />;
            case 'event': return <Calendar className="text-green-500" size={20} />;
            default: return <Info size={20} />;
        }
    };

    return (
        <div className="card news-feed">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0, lineHeight: 1.2 }}>📰 Новости хайкинга Флорипы</h2>
                <span style={{ fontSize: '0.8rem', color: '#718096', background: '#EDF2F7', padding: '0.2rem 0.5rem', borderRadius: '0.25rem' }}>
                    Обновлено: {new Date().getDate()} {['Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'][new Date().getMonth()]}
                </span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '1200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {news.map(item => (
                    <div key={item.id} style={{
                        padding: '1rem',
                        backgroundColor: item.type === 'daily' ? '#FFFFF0' : '#f7fafc',
                        borderRadius: '0.5rem',
                        borderLeft: item.type === 'warning' ? '4px solid #e53e3e' : item.type === 'event' ? '4px solid #48bb78' : item.type === 'daily' ? '4px solid #FCD34D' : '4px solid #3182ce',
                        border: item.type === 'daily' ? '1px solid #FCD34D' : 'none',
                        borderLeftWidth: '4px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {getIcon(item.type)}
                                <span style={{ fontSize: '0.8rem', color: '#718096', fontWeight: item.type === 'daily' ? 'bold' : 'normal' }}>{item.date}</span>
                            </div>
                            {item.url && item.url !== "#" && (
                                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#3182ce', textDecoration: 'none', border: '1px solid #bee3f8', padding: '2px 6px', borderRadius: '4px' }}>
                                    🔗 {item.source}
                                </a>
                            )}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#4a5568', whiteSpace: 'pre-line' }}>{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
