import { MapPin, Clock, Activity, Ruler, Info, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TrailsGuide({ trails, onTrailSelect }) {
    if (!trails) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'RECOMMENDED': return <CheckCircle size={16} className="text-green-500" />;
            case 'CAUTION': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'NOT_RECOMMENDED': return <ShieldAlert size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-gray-400" />;
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontFamily: '"Georgia", serif' }}>
                🏔️ Оперативный статус маршрутов
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {trails.map(trail => {
                    const algo = trail.algorithm || { score: 0, status: 'NODATA', reasons: [], label: 'НЕТ ДАННЫХ', color: 'gray' };

                    return (
                        <div key={trail.id} id={`trail-${trail.id}`}
                            onClick={() => onTrailSelect && onTrailSelect(trail)}
                            style={{
                                border: `1px solid ${algo.color === 'green' ? '#48bb78' : algo.color === 'yellow' ? '#ed8936' : algo.color === 'red' ? '#f56565' : '#e2e8f0'}`,
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                background: '#fff',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                            }}
                        >
                            {/* Status Badge Over Image */}
                            <div style={{
                                position: 'absolute',
                                top: '0.75rem',
                                left: '0.75rem',
                                background: 'rgba(255,255,255,0.9)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '1rem',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                zIndex: 1,
                                whiteSpace: 'nowrap'
                            }}>
                                {getStatusIcon(algo.status)}
                                <span style={{ color: '#1a202c' }}>{algo.label}</span>
                                <span style={{ color: '#718096', marginLeft: '0.25rem' }}>({algo.score}/100)</span>
                            </div>

                            <img
                                src={trail.image}
                                alt={trail.name}
                                style={{
                                    width: '100%',
                                    height: '180px',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />

                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{trail.name}</h3>
                                </div>

                                {/* Algorithm Reasons (Short) */}
                                {algo.reasons && algo.reasons.length > 0 && (
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: '#718096',
                                        background: '#f8fafc',
                                        padding: '0.5rem',
                                        borderRadius: '0.4rem',
                                        marginBottom: '1rem'
                                    }}>
                                        {algo.reasons.join(' • ')}
                                    </div>
                                )}

                                <p style={{ color: '#4a5568', marginBottom: '1rem', fontSize: '0.85rem', flex: 1 }}>{trail.description}</p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', borderTop: '1px solid #edf2f7', paddingTop: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4a5568' }}>
                                        <Activity size={14} /> {trail.difficulty}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4a5568' }}>
                                        <Clock size={14} /> {trail.duration}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#4a5568' }}>
                                        <Ruler size={14} /> {trail.distance}
                                    </div>
                                    {trail.technical?.cellSignal && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#2b6cb0' }}>
                                            📶 Связь есть
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

