import React, { useState, useEffect, useRef } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Login = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

    const handleLogin = async () => {
        try {
            setErrorMsg('');
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            setErrorMsg(error.message);
        }
    };

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { clientX, clientY } = e;
        const { width, height } = containerRef.current.getBoundingClientRect();
        const x = (clientX / width) * 100;
        const y = (clientY / height) * 100;
        containerRef.current.style.setProperty('--mouse-x', `${x}%`);
        containerRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    return (
        <div
            ref={containerRef}
            className="login-container"
            onMouseMove={handleMouseMove}
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '2rem',
                position: 'relative',
                overflow: 'hidden',
                background: '#0f0c29', // Fallback
                '--mouse-x': '50%',
                '--mouse-y': '50%'
            }}
        >
            {/* Dynamic Background */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(120, 40, 200, 0.15) 0%, transparent 40%),
                    radial-gradient(circle at 80% 20%, rgba(50, 50, 150, 0.1) 0%, transparent 20%),
                    linear-gradient(to bottom, #000428, #004e92)
                `,
                zIndex: 0
            }}></div>

            {/* Subtle Grid */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                zIndex: 1,
                opacity: 0.5
            }}></div>

            <div className="glass-panel" style={{
                zIndex: 10,
                padding: '4rem 3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2.5rem',
                maxWidth: '480px',
                width: '90%',
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(20px)',
                animation: 'float 6s ease-in-out infinite'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'inline-flex',
                        padding: '16px',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.01))',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        letterSpacing: '-1.5px',
                        background: 'linear-gradient(to right, #fff, #b3cdd1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                        TripPlanner
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        maxWidth: '300px',
                        margin: '0 auto',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        Collaborative adventures, <br /> simplified.
                    </p>
                </div>

                <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }}></div>

                <div style={{ width: '100%' }}>
                    <button
                        onClick={handleLogin}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            background: isHovering ? '#fff' : 'rgba(255,255,255,0.95)',
                            color: '#1f2937',
                            padding: '18px',
                            borderRadius: '16px',
                            border: 'none',
                            fontSize: '1.05rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isHovering ? 'scale(1.02) translateY(-2px)' : 'none',
                            boxShadow: isHovering ? '0 20px 40px -10px rgba(255, 255, 255, 0.2)' : '0 10px 20px -5px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                {errorMsg && (
                    <div style={{
                        color: '#f87171',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '1rem',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center'
                    }}>
                        <span>⚠️</span> {errorMsg}
                    </div>
                )}
            </div>

            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                    100% { transform: translateY(0px); }
                }
                `}
            </style>
        </div>
    );
};

export default Login;
