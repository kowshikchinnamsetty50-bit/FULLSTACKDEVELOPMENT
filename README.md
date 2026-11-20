# 💧 SipStreak – HydroHero Hunt

A modern, responsive, and gamified web application for personal hydration tracking and live team competitions.

Built with **HTML5, CSS3, and modern Vanilla JavaScript**, persisting all state in **LocalStorage**.

---

## 🌟 The 5 Core Features

### 1. Clean Login & Signup Page
- **Clean Auth Interface**: Toggle smoothly between **Login** and **Sign Up**.
- **User Fields**: Includes Full Name (for signup), Email, and Password fields.
- **Goal Formula Preview**: Automatically shows target calculation based on `Weight × 35ml`.
- **Quick Demo Login**: 1-click login buttons for sample HydroHeroes (`Alex Rivers`, `Elena Rostova`, `David Kim`) across different squads so testing is instantaneous.
- **Redirection & Session**: Seamless transition directly to the dashboard upon login, with header avatar and logout control.

### 2. Personal Hydration Dashboard
- **Personalized Header**: Displays the user's name, team badge, and greeting.
- **Daily Consumption & Target**: Prominently shows consumed milliliters vs. daily target milliliters.
- **Goal Formula**: Accurately calculates target using **`Weight (kg) × 35 ml`** (e.g. 70 kg × 35 = 2,450 ml). Includes an edit modal to adjust body weight anytime.
- **Circular Hydration Indicator**: High-definition circular SVG progress ring with animated stroke fill, real-time percentage text, and animated water droplet icon.
- **Remaining Water Metric**: Dynamically informs the user of remaining ml required to reach the goal, switching to celebratory banner when met.

### 3. Water Logging Buttons
- **Quick Logging Presets**:
  - `+250ml` (Standard Glass 🥛)
  - `+500ml` (Water Bottle 🍶)
  - `+750ml` (Sport Flask 💧)
- **Custom Quantity Input**: Enter any custom water amount (e.g., 350ml) with validation.
- **Immediate Reactive Updates**: Gauge progress, percentage, team totals, and leaderboard ranking update instantaneously upon clicking with water splash pulse animations.
- **LocalStorage Persistence**: All water logs saved under `sipstreak_water_logs` with timestamps, plus a quick "Reset Today" button for testing.

### 4. Team Creation and Joining
- **Create a New Team**: Specify a team name; automatically generates a unique readable code (e.g., `AQUA-2041`, `GLAC-8192`).
- **Join with Unique Code**: Join an existing squad using its team code with one-click code copying.
- **Squad Display**: Shows team name, code, members list with individual progress bars, weights, and goals.
- **4–8 Members Capacity**: Enforces and displays squad capacity status (supports 4 to 8 members per team).
- **Squad Total Water**: Sums total water consumed today across all team members.

### 5. Live Team Leaderboard
- **Live Competing Teams**: Ranks all active teams in real-time.
- **Fair Hydration Scoring**: Teams are ranked by the **average percentage of individual hydration goals achieved**.
- **Rankings & Scores**: Displays ranks, team names, codes, member counts (4–8), total water, and hydration score %.
- **Real-Time Synchronized**: As soon as any user logs water, their team's score updates and the leaderboard re-ranks live.
- **Top 3 Highlight**: Dedicated **Podium Showcase** with Gold 🥇, Silver 🥈, and Bronze 🥉 cards, glowing medals, and distinct table badges.

---

## 🎨 Design & Theme Highlights
- **Color Palette**: Light-Cyan (`#ecfeff`, `#cffafe`), Vibrant Blue (`#0ea5e9`, `#0284c7`), Deep Navy (`#0c4a6e`), and Pure White (`#ffffff`).
- **Visuals**: Ambient floating water bubbles, circular SVG progress with KaTeX-clean proportions, drop ripples, and glassmorphic cards.
- **Responsive**: Fully responsive across mobile smartphones, tablets, and desktop displays.

---

## 🚀 How to Run

Simply open [index.html](file:///c:/Users/Mohith/Desktop/fsd1/index.html) in any modern web browser:
- Double-click `index.html` or right-click -> "Open with" -> Chrome / Edge / Firefox.
- Or serve locally via any static file server:
  ```powershell
  npx serve .
  # or
  python -m http.server 3000
  ```
