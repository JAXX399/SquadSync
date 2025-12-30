import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

const StatusModal = ({ isOpen, onClose, date, user, statusesForDate = [], currentTrip }) => {
    const [statusType, setStatusType] = useState('free');
    const [reason, setReason] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            const myStatus = statusesForDate.find(s => s.userId === user.uid);
            if (myStatus) {
                setStatusType(myStatus.type);
                setReason(myStatus.reason || '');
                setCurrentStatus(myStatus);
            } else {
                setStatusType('free');
                setReason('');
                setCurrentStatus(null);
            }
        }
    }, [isOpen, user, statusesForDate]);

    if (!isOpen) return null;

    // Key now must include tripId to be unique per trip context
    // Actually, we can just store the document. 
    // Document ID strategy: date_userId_tripId (to allow user to be busy in one trip but free in another? 
    // Actually, physically you are busy globally. But for this app's logic requested: "Group based". 
    // Let's scope to trip.
    const dateKey = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
    const docId = user && currentTrip ? `${dateKey}_${user.uid}_${currentTrip.id}` : '';

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user || !dateKey || !currentTrip) return;

        setIsSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};
            const displayName = userData.name || user.displayName;

            await setDoc(doc(db, "statuses", docId), {
                date: dateKey,
                tripId: currentTrip.id, // THE CRITICAL ADDITION
                userId: user.uid,
                userName: displayName,
                userPhoto: userData.photoURL || null,
                type: statusType,
                reason: reason,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            onClose();
        } catch (error) {
            console.error("Save error:", error);
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Clear status?")) return;
        setIsSaving(true);
        try {
            await deleteDoc(doc(db, "statuses", docId));
            setCurrentStatus(null);
            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div className="glass-panel modal-content" onClick={e => e.stopPropagation()} style={{
                width: '500px',
                maxHeight: '85vh',
                background: 'hsla(var(--hue), 10%, 10%, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>

                <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--glass-border)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                        {date?.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </h3>
                </div>

                <div style={{ padding: 'var(--spacing-lg)', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Group Activity
                        </h4>
                        {statusesForDate.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.6 }}>No data for this trip yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {statusesForDate.map((status, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        background: 'var(--glass-surface)',
                                        borderRadius: 'var(--radius-sm)',
                                        borderLeft: `3px solid ${status.type === 'free' ? 'var(--status-free)' : 'var(--status-busy)'}`
                                    }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{status.userName}</div>
                                        <div style={{
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: status.type === 'free' ? 'rgba(0, 207, 141, 0.2)' : 'rgba(255, 92, 92, 0.2)',
                                            color: status.type === 'free' ? 'var(--status-free)' : 'var(--status-busy)',
                                            fontSize: '0.7rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase'
                                        }}>
                                            {status.type}
                                        </div>
                                        {status.reason && (<div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{status.reason}</div>)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="status-options" style={{ display: 'flex', gap: '1rem' }}>
                                <label className={`status-option ${statusType === 'free' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: statusType === 'free' ? 'var(--status-free)' : 'transparent', textAlign: 'center', color: statusType === 'free' ? 'black' : 'white' }}>
                                    <input type="radio" name="status" value="free" checked={statusType === 'free'} onChange={() => setStatusType('free')} style={{ display: 'none' }} />
                                    Available
                                </label>
                                <label className={`status-option ${statusType === 'busy' ? 'active' : ''}`} style={{ flex: 1, padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: statusType === 'busy' ? 'var(--status-busy)' : 'transparent', textAlign: 'center', color: 'white' }}>
                                    <input type="radio" name="status" value="busy" checked={statusType === 'busy'} onChange={() => setStatusType('busy')} style={{ display: 'none' }} />
                                    Busy
                                </label>
                            </div>

                            <div>
                                <input type="text" placeholder="Reason / Note" value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                {currentStatus && (
                                    <button type="button" onClick={handleDelete} style={{ color: '#ff4d4d', background: 'transparent', border: 'none', cursor: 'pointer', marginRight: 'auto' }}>Delete</button>
                                )}
                                <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
