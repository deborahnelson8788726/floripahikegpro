import { useState } from 'react';
import { Filter, Signal, Droplets, Sun, Clock, Mountain } from 'lucide-react';

export default function SmartTrailFilters({ onFilterChange }) {
    const [activeFilters, setActiveFilters] = useState({
        weather: 'any',
        difficulty: 'any',
        duration: 'any',
        signal: false,
        noMud: false
    });

    const categories = [
        {
            id: 'weather', label: 'Погода', options: [
                { id: 'any', label: 'Любая' },
                { id: 'shade', label: 'Тень (Жара)' },
                { id: 'safe', label: 'Без риска обвалов' }
            ]
        },
        {
            id: 'difficulty', label: 'Сложность', options: [
                { id: 'any', label: 'Любая' },
                { id: 'easy', label: 'Легкий' },
                { id: 'medium', label: 'Средний' },
                { id: 'hard', label: 'Сложный' }
            ]
        },
        {
            id: 'duration', label: 'Длительность', options: [
                { id: 'any', label: 'Любая' },
                { id: 'short', label: '< 1ч' },
                { id: 'medium', label: '1-3ч' },
                { id: 'long', label: '> 3ч' }
            ]
        }
    ];

    const toggleBoolean = (key) => {
        const next = { ...activeFilters, [key]: !activeFilters[key] };
        setActiveFilters(next);
        onFilterChange(next);
    };

    const setDropdown = (key, value) => {
        const next = { ...activeFilters, [key]: value };
        setActiveFilters(next);
        onFilterChange(next);
    };

    return (
        <div style={{ background: '#f8faf9', borderBottom: '1px solid #e2e8f0', padding: '1.5rem 2rem', borderRadius: '24px 24px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Filter size={20} className="text-green-700" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, fontFamily: '"Georgia", serif' }}>Умные фильтры (PRO)</h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {categories.map(cat => (
                    <div key={cat.id} style={{ flex: 1, minWidth: '130px' }}>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: '#718096', marginBottom: '0.2rem', fontWeight: '600' }}>
                            {cat.label}
                        </label>
                        <select
                            value={activeFilters[cat.id]}
                            onChange={(e) => setDropdown(cat.id, e.target.value)}
                            style={{
                                width: '100%',
                                height: '36px',
                                padding: '0 0.5rem',
                                borderRadius: '0.4rem',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.75rem',
                                background: '#fff',
                                outline: 'none'
                            }}
                        >
                            {cat.options.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                ))}

                <button
                    onClick={() => toggleBoolean('signal')}
                    style={{
                        height: '36px',
                        flex: 1,
                        minWidth: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        padding: '0 0.5rem',
                        borderRadius: '0.4rem',
                        border: '1px solid',
                        borderColor: activeFilters.signal ? '#3182ce' : '#e2e8f0',
                        background: activeFilters.signal ? '#ebf8ff' : '#fff',
                        color: activeFilters.signal ? '#2c5282' : '#4a5568',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Signal size={13} /> Связь
                </button>

                <button
                    onClick={() => toggleBoolean('noMud')}
                    title="Тропы, которые высыхают через 24ч после дождя"
                    style={{
                        height: '36px',
                        flex: 1,
                        minWidth: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        padding: '0 0.5rem',
                        borderRadius: '0.4rem',
                        border: '1px solid',
                        borderColor: activeFilters.noMud ? '#38a169' : '#e2e8f0',
                        background: activeFilters.noMud ? '#f0fff4' : '#fff',
                        color: activeFilters.noMud ? '#22543d' : '#4a5568',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <Droplets size={13} /> Без грязи
                </button>
            </div>
        </div>
    );
}
