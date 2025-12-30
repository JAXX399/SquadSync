import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const CreateProfile = ({ user, onProfileCreated }) => {
    const [name, setName] = useState(user.displayName || '');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                age: age,
                gender: gender,
                email: user.email,
                photoURL: user.photoURL,
                joinedAt: new Date().toISOString()
            });
            console.log("Profile created!");
            onProfileCreated();
        } catch (error) {
            console.error("Error creating profile:", error);
            alert("Error saving profile: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="login-container" style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            <div className="glass-panel" style={{
                padding: '3rem',
                width: '90%',
                maxWidth: '450px',
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Complete Your Profile</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Tell us a bit about yourself to join the group.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                                min="1"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    background: 'hsla(0, 0%, 0%, 0.2)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    outline: 'none'
                                }}
                            >
                                <option value="" disabled>Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSaving}
                        style={{ marginTop: '1rem' }}
                    >
                        {isSaving ? 'Creating Profile...' : 'Join Group'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProfile;
