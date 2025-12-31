import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const Dashboard = ({ user, onSelectTrip, onAdminClick }) => {
    const [trips, setTrips] = useState([]);
    const [invites, setInvites] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [newTripName, setNewTripName] = useState('');
    const [joinTripId, setJoinTripId] = useState('');

    // 1. Fetch My Trips
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "trips"), where("members", "array-contains", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTrips(fetchedTrips);
        });
        return unsubscribe;
    }, [user]);

    // 2. Fetch My Invites
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "invites"), where("toUid", "==", user.uid), where("status", "==", "pending"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedInvites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setInvites(fetchedInvites);
        });
        return unsubscribe;
    }, [user]);

    const handleCreateTrip = async (e) => {
        e.preventDefault();
        if (!newTripName.trim()) return;
        try {
            await addDoc(collection(db, "trips"), {
                name: newTripName,
                hostId: user.uid,
                members: [user.uid],
                createdAt: new Date().toISOString()
            });
            setIsCreating(false);
            setNewTripName('');
        } catch (error) {
            alert("Error creating trip: " + error.message);
        }
    };

    const handleJoinTrip = async (e) => {
        e.preventDefault();
        const tid = joinTripId.trim();
        if (!tid) return;

        try {
            // Check if trip exists
            const tripRef = doc(db, "trips", tid);
            const tripSnap = await getDoc(tripRef);

            if (!tripSnap.exists()) {
                alert("Trip not found! Please check the ID.");
                return;
            }

            const tripData = tripSnap.data();
            if (tripData.members.includes(user.uid)) {
                alert("You are already a member of this trip!");
                return;
            }

            // Add user to trip
            await updateDoc(tripRef, {
                members: arrayUnion(user.uid)
            });

            // Cleanup: Remove any pending invites for this trip if they exist (optional polish)
            // For now just basic join is fine.

            setIsJoining(false);
            setJoinTripId('');
            alert(`Success! You joined ${tripData.name}`);

        } catch (error) {
            console.error(error);
            alert("Error joining trip: " + error.message);
        }
    };

    const handleAcceptInvite = async (invite) => {
        try {
            const tripRef = doc(db, "trips", invite.tripId);
            await updateDoc(tripRef, { members: arrayUnion(user.uid) });
            await updateDoc(doc(db, "invites", invite.id), { status: 'accepted' });
        } catch (error) { console.error(error); alert("Error accepting invite."); }
    };

    const copyUserId = () => {
        navigator.clipboard.writeText(user.uid);
        const btn = document.getElementById('copy-btn');
        if (btn) btn.innerText = "Copied!";
        setTimeout(() => { if (btn) btn.innerText = "Copy"; }, 2000);
    };

    const copyTripId = (e, tripId) => {
        e.stopPropagation(); // Prevent opening the trip
        navigator.clipboard.writeText(tripId);
        alert("Trip ID copied! Share this with friends so they can join.");
    };

    return (
        <div style={{
            padding: '3rem',
            maxWidth: '1200px',
            margin: '0 auto',
            color: 'var(--text-primary)',
            animation: 'fadeIn 0.8s ease'
        }}>
            <style>
                {`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
            .trip-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
            .trip-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 15px 30px rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2); }
            `}
            </style>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <div>
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '0.5rem',
                        fontWeight: '300',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Hello, <span style={{ fontWeight: '600' }}>{user.displayName?.split(' ')[0] || 'Traveler'}</span>
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.8 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>ID:</span>
                        <code style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {user.uid.substring(0, 8)}...
                        </code>
                        <button id="copy-btn" onClick={copyUserId} className="btn-icon" style={{ fontSize: '0.8rem', padding: '6px 12px', borderRadius: '20px', background: 'var(--glass-surface)' }}>
                            Copy
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={user.photoURL} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} alt="" />
                    <button className="btn-icon" onClick={() => auth.signOut()}>Sign Out</button>
                </div>
            </div>

            {/* Invites Section */}
            {invites.length > 0 && (
                <div style={{ marginBottom: '4rem', animation: 'slideIn 0.5s ease' }}>
                    <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem', color: '#ffbd2e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📬</span> Pending Invitations
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {invites.map(invite => (
                            <div key={invite.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #ffbd2e' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{invite.tripName}</h4>
                                    <span style={{ color: 'var(--text-secondary)' }}>Invited by {invite.fromName}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button className="btn-primary" onClick={() => handleAcceptInvite(invite)}>Accept Journey</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trips Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '400' }}>Your Adventures</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-icon" onClick={() => { setIsJoining(!isJoining); setIsCreating(false); }} style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '1rem', border: '1px solid var(--glass-border)' }}>
                        🔗 Join via ID
                    </button>
                    <button className="btn-primary" onClick={() => { setIsCreating(true); setIsJoining(false); }} style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '1rem' }}>
                        + Create New Trip
                    </button>
                </div>
            </div>

            {isCreating && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', animation: 'slideIn 0.3s ease', border: '1px solid var(--text-accent)' }}>
                    <input
                        type="text"
                        placeholder="Where are you going? (e.g. Paris 2026)"
                        value={newTripName}
                        onChange={(e) => setNewTripName(e.target.value)}
                        autoFocus
                        style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <button className="btn-primary" onClick={handleCreateTrip} style={{ padding: '1rem 2rem' }}>Create</button>
                    <button className="btn-icon" onClick={() => setIsCreating(false)} style={{ padding: '1rem' }}>Cancel</button>
                </div>
            )}

            {isJoining && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', animation: 'slideIn 0.3s ease', border: '1px solid var(--text-accent)' }}>
                    <input
                        type="text"
                        placeholder="Enter Trip ID (Ask the host)"
                        value={joinTripId}
                        onChange={(e) => setJoinTripId(e.target.value)}
                        autoFocus
                        style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '8px', color: 'white' }}
                    />
                    <button className="btn-primary" onClick={handleJoinTrip} style={{ padding: '1rem 2rem' }}>Join Trip</button>
                    <button className="btn-icon" onClick={() => setIsJoining(false)} style={{ padding: '1rem' }}>Cancel</button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {trips.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
                        <p style={{ fontSize: '1.2rem' }}>No trips yet.</p>
                        <p>Start a new adventure, join a friend, or wait for an invite!</p>
                    </div>
                ) : (
                    trips.map((trip, idx) => (
                        <div
                            key={trip.id}
                            className="glass-panel trip-card"
                            onClick={() => onSelectTrip(trip)}
                            style={{
                                padding: '2rem',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '24px',
                                animation: `fadeIn 0.5s ease forwards ${idx * 0.1}s`,
                                opacity: 0 // Start hidden for animation
                            }}
                        >
                            {/* Abstract Decorative Blob */}
                            <div style={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 100,
                                height: 100,
                                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                                filter: 'blur(50px)',
                                opacity: 0.3
                            }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', position: 'relative' }}>{trip.name}</h4>
                                <button
                                    onClick={(e) => copyTripId(e, trip.id)}
                                    title="Copy Trip ID"
                                    className="btn-icon"
                                    style={{
                                        padding: '8px', /* Larger padding */
                                        fontSize: '1.2rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative', /* Fix stacking context */
                                        zIndex: 20 /* Ensure it is above the card link */
                                    }}
                                >
                                    🔗
                                </button>
                            </div>

                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }}></span>
                                {trip.members.length} Traveler{trip.members.length !== 1 ? 's' : ''}
                            </div>

                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <span style={{ fontSize: '0.9rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    Open Planner →
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: '5rem', textAlign: 'center', opacity: 0.3 }}>
                <button onClick={onAdminClick} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                    Admin Portal
                </button>
            </div>

        </div>
    );
};

export default Dashboard;
