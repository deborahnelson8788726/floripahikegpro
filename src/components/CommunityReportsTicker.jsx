import { useState, useRef } from 'react';
import { MessageSquare, User, Send, Camera } from 'lucide-react';

export default function CommunityReportsTicker() {
    const [reports, setReports] = useState([
        { id: 1, trail: "Lagoinha do Leste", user: "PRO_Hunter", time: "2ч назад", text: "Грязно после дождя, камни скользкие. Необходимы ботинки с хорошим протектором.", weather: "🌧️" },
        { id: 2, trail: "Naufragados", user: "FloripaTrilhas", time: "5ч назад", text: "Тропа в отличном состоянии. Воды в ручьях много.", weather: "☀️" },
        { id: 3, trail: "Morro da Coroa", user: "ZenHiker", time: "10ч назад", text: "На гребне сильный ветер, сдувает. Нужна ветровка.", weather: "💨" }
    ]);

    const [newReport, setNewReport] = useState({ trail: '', text: '', image: null });
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewReport({ ...newReport, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newReport.text || !newReport.trail) return;

        const report = {
            id: Date.now(),
            trail: newReport.trail,
            user: "Hiker_" + Math.floor(Math.random() * 1000),
            time: "Только что",
            text: newReport.text,
            weather: "📝",
            image: newReport.image
        };

        setReports([report, ...reports]);
        setNewReport({ trail: '', text: '', image: null });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #edf2f7', paddingBottom: '0.5rem' }}>
                <MessageSquare size={18} className="text-purple-600" />
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>Оперативные отчеты сообщества</h3>
            </div>

            {/* NEW REPORT FORM */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <input
                    type="text"
                    placeholder="Название тропы..."
                    value={newReport.trail}
                    onChange={(e) => setNewReport({ ...newReport, trail: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}
                />
                <textarea
                    placeholder="Что там сейчас? (грязь, ветер, завалы...)"
                    value={newReport.text}
                    onChange={(e) => setNewReport({ ...newReport, text: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '0.4rem', border: '1px solid #e2e8f0', fontSize: '0.8rem', minHeight: '60px', resize: 'vertical' }}
                />

                {/* Image Preview */}
                {newReport.image && (
                    <div style={{ marginBottom: '0.5rem', position: 'relative', display: 'inline-block' }}>
                        <img src={newReport.image} alt="Preview" style={{ height: '60px', borderRadius: '0.4rem', border: '1px solid #e2e8f0' }} />
                        <button
                            type="button"
                            onClick={() => setNewReport({ ...newReport, image: null })}
                            style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: 'none', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        style={{ background: '#edf2f7', color: '#4a5568', border: 'none', padding: '0.5rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                        <Camera size={16} />
                    </button>
                    <button type="submit" style={{ flex: 1, background: '#4a5568', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <Send size={14} /> Отправить отчет
                    </button>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {reports.map(report => (
                    <div key={report.id} style={{ fontSize: '0.85rem', borderBottom: '1px solid #f7fafc', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 'bold', color: '#2d3748' }}>{report.trail} {report.weather}</span>
                            <span style={{ color: '#a0aec0', fontSize: '0.75rem' }}>{report.time}</span>
                        </div>
                        <p style={{ margin: '0 0 0.5rem 0', fontStyle: 'italic', color: '#4a5568' }}>"{report.text}"</p>
                        {report.image && (
                            <div style={{ marginBottom: '0.5rem' }}>
                                <img src={report.image} alt="Report attachment" style={{ maxWidth: '100%', borderRadius: '0.4rem', maxHeight: '150px', objectFit: 'cover' }} />
                            </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#718096', fontSize: '0.75rem' }}>
                            <User size={12} /> {report.user}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
