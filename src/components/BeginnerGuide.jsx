import { Backpack, Droplets, Sun, Footprints, AlertTriangle } from 'lucide-react';

export default function BeginnerGuide() {
    return (
        <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem', background: '#f0fff4', borderRadius: '1rem', border: '1px solid #c6f6d5' }}>
            <h2 style={{ textAlign: 'center', color: '#2f855a', marginBottom: '1.5rem' }}>🎒 Советы для начинающих хайкеров</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#c6f6d5', padding: '0.5rem', borderRadius: '50%' }}>
                        <Droplets size={24} color="#2f855a" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#276749' }}>Вода</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>Берите минимум 1.5 литра воды на человека. На многих тропах нет источников питьевой воды.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#fefcbf', padding: '0.5rem', borderRadius: '50%' }}>
                        <Sun size={24} color="#b7791f" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#975a16' }}>Защита от солнца</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>Солнце во Флорипе очень активное. Обязательно используйте крем SPF 50+, очки и головной убор.</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#e2e8f0', padding: '0.5rem', borderRadius: '50%' }}>
                        <Footprints size={24} color="#4a5568" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#2d3748' }}>Обувь</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>Используйте закрытые кроссовки с хорошим протектором. Шлепанцы опасны на скалистых участках!</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#fed7d7', padding: '0.5rem', borderRadius: '50%' }}>
                        <AlertTriangle size={24} color="#c53030" />
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: '#9b2c2c' }}>Безопасность</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>Не ходите в одиночку на сложные маршруты (Lagoinha do Leste). Скачайте оффлайн карты.</p>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Backpack size={32} color="#38a169" />
                <p style={{ margin: 0, fontStyle: 'italic', color: '#718096' }}>"Уносите с собой только фотографии, оставляйте только следы." Пожалуйста, не оставляйте мусор на природе! 🌿</p>
            </div>
        </div>
    );
}
