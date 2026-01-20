import { CheckSquare, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ChecklistPrep() {
    const sections = [
        {
            title: "Базовый набор PRO",
            items: ["Трекинговые ботинки", "Минимум 2л воды", "Офлайн-карта (Wikiloc/Maps.me)", "Powerbank", "Аптечка первой помощи"]
        },
        {
            title: "Подготовка к жаре",
            items: ["Солевые таблетки (электролиты)", "Кепка/Панама", "SPF 50+", "Старт до 08:00"]
        }
    ];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Floripa Hiking PRO - Offline Checklist", 20, 20);

        doc.setFontSize(12);
        doc.text("Generated on: " + new Date().toLocaleDateString(), 20, 30);

        let yPos = 45;

        sections.forEach(section => {
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(section.title, 20, yPos);
            yPos += 10;

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            section.items.forEach(item => {
                doc.text(`[   ]  ${item}`, 20, yPos);
                yPos += 8;
            });
            yPos += 10;
        });

        doc.text("Safety First! Always tell someone where you are going.", 20, yPos + 10);

        doc.save("floripa-hiking-checklist.pdf");
    };

    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #edf2f7', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckSquare size={18} className="text-green-600" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>Офлайн-чеклисты</h3>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    style={{ background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                >
                    <Download size={14} /> PDF
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sections.map((section, i) => (
                    <div key={i}>
                        <h4 style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0', color: '#718096' }}>{section.title}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {section.items.map((item, j) => (
                                <label key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#4a5568', cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ cursor: 'pointer' }} /> {item}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
