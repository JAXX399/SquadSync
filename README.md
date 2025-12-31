# SquadSync 🌍✈️

**The ultimate collaborative trip planner for you and your squad.**

SquadSync transforms chaotic group chat planning into a sleek, real-time dashboard. Coordinate availability, manage multiple trips, and sync up with your friends efficiently.

[**🔴 Live Demo: https://squadsync-cxm.vercel.app**](https://squadsync-cxm.vercel.app/)

![SquadSync Banner](https://via.placeholder.com/1200x400?text=SquadSync+Dashboard+Preview)

## ✨ Key Features

- **Real-Time Availability Sync**: Mark yourself as "Free" or "Busy" for specific dates. Updates appear instantly for everyone.
- **Group Trip Management**: Organize multiple trips (Goa 2026, Family Reunion, etc.) with isolated calendars.
- **Invites & Joining**: Invite friends securely via User ID or share a **Trip ID** for instant access.
- **Admin Dashboard**: Powerful control panel to manage users, trips, and perform system-wide resets.
- **Google Authentication**: fast and secure sign-in with your existing Google account.
- **Glassmorphism UI**: A premium, modern interface designed for a delightful user experience.

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite
- **Styling**: Vanilla CSS (Glassmorphism Design System)
- **Backend / Database**: Google Firebase (Firestore & Auth)
- **Hosting**: Firebase Hosting / Vercel (Ready to deploy)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- A Google Firebase Project (Free Tier)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/squadsync.git
    cd squadsync
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    - Create a project at [firebase.google.com](https://console.firebase.google.com/).
    - Enable **Authentication** (Google Provider).
    - Enable **Firestore Database**.
    - Copy your config keys into `src/firebase.js`:
    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT.appspot.com",
      messagingSenderId: "...",
      appId: "..."
    };
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🛡️ Admin Access

Scale your community management with the built-in Admin Portal.
- **Access**: Click "Admin Access" in the dashboard footer.
- **Default Password**: *Check source code or ask admin* (Change this in `src/components/AdminDashboard.jsx`).
- **Capabilities**:
    - ⚡ **Avada Kedavra**: Instantly wipe all data for a fresh start.
    - 🗑️ **User/Trip Deletion**: maintain community standards.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by Israr*
