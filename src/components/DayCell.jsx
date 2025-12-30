import React from 'react';

const DayCell = ({ date, isCurrentMonth, statusList = [], onClick, isSelected }) => {
    if (!date) return <div className="day-cell empty"></div>;

    // Generate consistent color from string
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    return (
        <div
            className={`day-cell ${!isCurrentMonth ? 'dimmed' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(date)}
            style={{
                background: isSelected ? 'var(--glass-highlight)' : 'var(--glass-surface)',
                border: `1px solid ${isSelected ? 'var(--text-accent)' : 'var(--glass-border)'}`,
                borderRadius: 'var(--radius-sm)',
                minHeight: '100px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = 'var(--glass-highlight)')}
            onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = 'var(--glass-surface)')}
        >
            <span style={{
                fontWeight: isSelected ? '700' : '400',
                color: isSelected ? 'var(--text-accent)' : 'var(--text-primary)',
                alignSelf: 'flex-end',
                fontSize: '0.9rem',
                marginBottom: '4px'
            }}>
                {date.getDate()}
            </span>

            {/* Status Pills */}
            <div className="status-list" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {statusList.map((status, idx) => {
                    // User Identity Color
                    const userColor = stringToColor(status.userName || 'Unknown');
                    // Status Signal Color
                    const statusSignal = status.type === 'free' ? 'var(--status-free)' : 'var(--status-busy)';

                    return (
                        <div
                            key={idx}
                            title={`${status.userName}: ${status.reason || status.type}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '2px 6px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.1)',
                                borderLeft: `3px solid ${statusSignal}`,
                                fontSize: '0.75rem',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {/* User Avatar Dot */}
                            <div style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                background: userColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: '#fff',
                                flexShrink: 0
                            }}>
                                {status.userName ? status.userName.substring(0, 2).toUpperCase() : '?'}
                            </div>

                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', color: 'var(--text-secondary)' }}>
                                {status.reason || status.type}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DayCell;
