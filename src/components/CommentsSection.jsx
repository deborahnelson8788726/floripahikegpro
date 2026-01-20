import { useState } from 'react';
import { User, Instagram, MessageSquare, Send } from 'lucide-react';

export default function CommentsSection() {
    const [comments, setComments] = useState([
        {
            id: 1,
            name: "Алексей",
            instagram: "@alex_hiker",
            content: "Вчера ходил на Lagoinha. Тропа немного размыта после дождя, но вид того стоит! 🌋",
            date: "Вчера, 14:30"
        },
        {
            id: 2,
            name: "Мария Силва",
            instagram: "@maria.travels",
            content: "Кто собирается на Gravatá в эти выходные? Ищу компанию! 👋",
            date: "Сегодня, 09:15"
        }
    ]);

    const [newComment, setNewComment] = useState({ name: '', instagram: '', content: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.name || !newComment.content) return;

        const comment = {
            id: Date.now(),
            name: newComment.name,
            instagram: newComment.instagram.startsWith('@') ? newComment.instagram : `@${newComment.instagram}`,
            content: newComment.content,
            date: "Только что"
        };

        setComments([comment, ...comments]);
        setNewComment({ name: '', instagram: '', content: '' });
    };

    return (
        <div className="card comments-section" style={{ gridColumn: '1 / -1' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare /> Сообщество хайкеров
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', backgroundColor: '#f7fafc', padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Оставить отчет</h3>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                    <input
                        type="text"
                        placeholder="Ваше имя"
                        value={newComment.name}
                        onChange={e => setNewComment({ ...newComment, name: e.target.value })}
                        style={{ padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #cbd5e0' }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Instagram (напр. @user)"
                        value={newComment.instagram}
                        onChange={e => setNewComment({ ...newComment, instagram: e.target.value })}
                        style={{ padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #cbd5e0' }}
                    />
                </div>
                <textarea
                    placeholder="Как сходили? Какое состояние тропы?"
                    rows="3"
                    value={newComment.content}
                    onChange={e => setNewComment({ ...newComment, content: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', border: '1px solid #cbd5e0', marginTop: '1rem', resize: 'vertical' }}
                    required
                ></textarea>
                <button type="submit" className="btn" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Отправить
                </button>
            </form>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {comments.map(comment => (
                    <div key={comment.id} style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{comment.name}</span>
                                {comment.instagram && (
                                    <a
                                        href={`https://instagram.com/${comment.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#d53f8c', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}
                                    >
                                        <Instagram size={14} /> {comment.instagram}
                                    </a>
                                )}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#718096' }}>{comment.date}</span>
                        </div>
                        <p style={{ color: '#2d3748' }}>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
