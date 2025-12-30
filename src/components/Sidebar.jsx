import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, documentId } from 'firebase/firestore';

const Sidebar = ({ currentTrip, user, onExitTrip }) => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!currentTrip || currentTrip.members.length === 0) return;

        // Limiting to 10 for basic MVP compliance with 'in' query limits
        const q = query(collection(db, "users"), where(documentId(), 'in', currentTrip.members.slice(0, 10)));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setMembers(users);
        });
        return unsubscribe;

    }, [currentTrip]);

    const handleInvite = async () => {
        const friendId = prompt("Enter your friend's User ID (they can find it on their Dashboard):");
        if (!friendId) return;
        if (friendId === user.uid) { alert("You can't invite yourself!"); return; }

        try {
            await addDoc(collection(db, "invites"), {
                toUid: friendId.trim(),
                fromUid: user.uid,
                fromName: user.displayName || 'Friend',
                tripId: currentTrip.id,
                tripName: currentTrip.name,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            alert("Invite sent!");
        } catch (error) {
            alert("Failed to send invite: " + error.message);
        }
    };

    return (
        <aside className="glass-panel sidebar" style={{
            width: '280px',
            padding: 'var(--spacing-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            flexShrink: 0
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <button onClick={onExitTrip} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}>
                    ← Back to Dashboard
                </button>
                <h3 style={{
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem',
                    marginTop: '0.5rem'
                }}>
                    {currentTrip.name}
                </h3>
            </div>

            <div>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                    Trip Members
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {members.map(member => (
                        <li key={member.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.05)'
                        }}>
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'gray',
                                overflow: 'hidden'
                            }}>
                                {member.photoURL && <img src={member.photoURL} alt="" style={{ width: '100%', height: '100%' }} />}
                            </div>
                            <span>{member.name}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <button className="btn-primary" style={{ width: '100%' }} onClick={handleInvite}>
                    + Invite Friend
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
