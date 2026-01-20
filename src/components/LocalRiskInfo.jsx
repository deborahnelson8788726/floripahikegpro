import { AlertTriangle, Map, Shield, Zap } from 'lucide-react';

export default function LocalRiskInfo() {
    const risks = [
        { title: "Жара и Обезвоживание", text: "При >30°C расход воды 1л/час. На открытых тропах (Coroa/Naufragados) риск теплового удара критический.", icon: <Zap className="text-orange-500" /> },
        { title: "Сильный Ветер (South/East)", text: "Порывы >40км/ч на прибрежных утесах могут привести к потере равновесия. Избегать Gravatá и Galheta.", icon: <AlertTriangle className="text-red-500" /> },
        { title: "Слепые Зоны", text: "Отсутствие связи в южной части острова (Naufragados, Saquinho, Lagoinha). Всегда имейте офлайн-карты.", icon: <Map className="text-blue-500" /> },
        { title: "Фауна: Змеи и Клещи", text: "В высокой траве (Capim-Limão) высокая активность змей Jararaca. Рекомендуются гетры или высокие ботинки.", icon: <Shield className="text-green-600" /> }
    ];

    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🛡️ Сводка локальных рисков (Floripa Expert)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                {risks.map((risk, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ marginTop: '0.25rem' }}>{risk.icon}</div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0', fontWeight: 'bold' }}>{risk.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: '#4a5568', margin: 0, lineHeight: '1.4' }}>{risk.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
