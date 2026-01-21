import { AlertTriangle, Info, Calendar } from 'lucide-react';

export default function NewsFeed({ weather }) {
    // Dynamic Daily Update Logic
    const getDailyUpdate = () => {
        const now = new Date();
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

    const staticNews = [
        {
            id: 1,
            type: 'warning',
            title: "Высокая температура: Предупреждение",
            date: "18 Янв 2026",
            content: "Defesa Civil предупреждает о волне жары на этой неделе. Температура на открытых участках троп может достигать 35°C. Рекомендуется избегать хайкинга с 11:00 до 16:00.",
            source: "Defesa Civil SC",
            url: "https://www.defesacivil.sc.gov.br/categoria/aviso/"
        },
        {
            id: 2,
            type: 'info',
            title: "Восстановление тропы Naufragados",
            date: "10 Янв 2026",
            content: "Завершены работы по укреплению участков тропы после декабрьских штормов. Маршрут полностью открыт и безопасен для посещения.",
            source: "Floripa Mil Grau",
            url: "https://www.instagram.com/floripamilgrau"
        },
        {
            id: 3,
            type: 'event',
            title: "Групповой поход: 'Рассвет на Morro da Coroa'",
            date: "25 Янв 2026",
            content: "Местный клуб 'Trilheiros da Ilha' организует открытый поход на Lagoinha do Leste. Сбор в 04:30 на пляже Pântano do Sul. Участие бесплатное.",
            source: "Trilheiros da Ilha",
            url: "https://www.instagram.com/trilheiros_da_ilha"
        },
        {
            id: 4,
            type: 'info',
            title: "Новая маркировка на Trilha do Gravatá",
            date: "Дек 2025",
            content: "Обновлены указатели на развилках. Теперь ориентироваться стало проще, особенно для новичков.",
            source: "Floripa.sc.gov.br",
            url: "https://www.pmf.sc.gov.br"
        }
    ];

    const news = [getDailyUpdate(), ...staticNews];

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
                            {item.url && (
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
