import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import Calendar from './components/Calendar';
import StatusModal from './components/StatusModal';
import Login from './components/Login';
import CreateProfile from './components/CreateProfile';
import Dashboard from './components/Dashboard';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, doc, where } from 'firebase/firestore';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation State
  const [currentTrip, setCurrentTrip] = useState(null); // If null -> Show Dashboard
  const [showAdmin, setShowAdmin] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuses, setStatuses] = useState({});

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const unsubProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            setUserProfile(null);
          }
          setAuthLoading(false);
        });
        return () => unsubProfile();
      } else {
        setUserProfile(null);
        setAuthLoading(false);
        setCurrentTrip(null); // Reset trip on logout
        setShowAdmin(false);
      }
    });
    return unsubscribe;
  }, []);

  // 2. Statuses Listener (Scoped to Current Trip)
  useEffect(() => {
    if (!user || !currentTrip) return;

    // Filter statuses where tripId == currentTrip.id
    const q = query(collection(db, "statuses"), where("tripId", "==", currentTrip.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newStatuses = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!newStatuses[data.date]) {
          newStatuses[data.date] = [];
        }
        newStatuses[data.date].push(data);
      });
      setStatuses(newStatuses);
    });

    return unsubscribe;
  }, [user, currentTrip]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const formattedDate = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : '';

  if (authLoading) return <div className="glass-panel" style={{ margin: '2rem', padding: '2rem', textAlign: 'center' }}>Loading access...</div>;

  if (!user) return <Login />;
  if (!userProfile) return <CreateProfile user={user} onProfileCreated={() => { }} />;

  // ADMIN VIEW
  if (showAdmin) {
    // Lazy load could be here, but direct is fine
    const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
    return (
      <React.Suspense fallback={<div>Loading Admin...</div>}>
        <AdminDashboard onExit={() => setShowAdmin(false)} />
      </React.Suspense>
    );
  }

  // MAIN NAVIGATION SWITCH
  if (!currentTrip) {
    return <Dashboard user={user} onSelectTrip={setCurrentTrip} onAdminClick={() => setShowAdmin(true)} />;
  }

  return (
    <Layout>
      <Sidebar currentTrip={currentTrip} user={user} onExitTrip={() => setCurrentTrip(null)} />
      <div className="glass-panel content-area" style={{
        flex: 1,
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, lineHeight: 1 }}>
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <span style={{ color: 'var(--text-accent)', fontSize: '0.9rem', fontWeight: 'bold' }}>{currentTrip.name}</span>
          </div>

          <div className="view-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem', background: 'var(--glass-surface)', padding: '5px 10px', borderRadius: '20px' }}>
              <img src={userProfile.photoURL || user.photoURL} alt="Me" style={{ width: 24, height: 24, borderRadius: '50%' }} />
              <span style={{ fontSize: '0.9rem' }}>{userProfile.name}</span>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }}></div>

            <button className="btn-icon" onClick={() => handleMonthChange(-1)}>&lt;</button>
            <button className="btn-icon" onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <Calendar
            currentYear={currentDate.getFullYear()}
            currentMonth={currentDate.getMonth()}
            statuses={statuses}
            onDayClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      <StatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        user={user}
        currentTrip={currentTrip}
        statusesForDate={statuses[formattedDate] || []}
      />
    </Layout>
  );
}

export default App;
