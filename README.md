# Matiks Leaderboard System

A scalable leaderboard platform built for handling 10,000+ concurrent users with real-time ranking updates and instant search.

## 🎯 Problem Statement

Built as part of Matiks Full-Stack Engineer Internship assignment. The system manages a gaming leaderboard where:
- Thousands of players compete simultaneously
- Ratings update every few seconds
- Users can search for any player and see their live global rank
- Players with same rating get same rank (tie-aware ranking)

## 🛠️ Tech Stack

**Backend:** Go (Golang)
- Gorilla Mux for routing
- In-memory storage for performance
- CORS enabled for cross-origin requests

**Frontend:** React Native (Expo)
- TypeScript
- Axios for API calls
- Tab navigation (Leaderboard + Search)

## 🚀 Features

### Core Functionality
- **10,000+ Users:** Handles large-scale user data efficiently
- **Tie-Aware Ranking:** Users with same rating get same rank
- **Live Updates:** Background simulation updates ratings every 2 seconds
- **Fast Search:** Search by username with instant results
- **Pagination:** Leaderboard shows 50 users per page
- **Pull-to-Refresh:** Refresh leaderboard data on mobile

### Rating System
- Rating range: 100 to 5000
- Random rating changes: ±50 points every 2 seconds
- Maintains boundaries (never goes below 100 or above 5000)

## 📁 Project Structure

```
matiks-leaderboard/
├── backend/
│   ├── main.go           # Server setup
│   ├── models.go         # Data structures
│   ├── ranking.go        # Ranking logic
│   └── leaderboard.go    # API handlers
└── frontend/
    ├── app/
    │   └── (tabs)/       # Tab navigation
    │       ├── index.tsx # Leaderboard screen
    │       └── search.tsx# Search screen
    └── services/
        └── api.ts        # API calls
```

## 🏃 How to Run

### Backend
```bash
cd backend
go mod download
go run .
```

Backend runs on `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npx expo start
```

Press:
- `w` for web browser
- `a` for Android emulator
- `i` for iOS simulator

## 🧪 Testing

### 1. Seed Database
```bash
curl -X POST http://localhost:8080/api/seed
```

This creates 10,000 test users with random ratings.

### 2. Get Leaderboard
```bash
curl http://localhost:8080/api/leaderboard
curl http://localhost:8080/api/leaderboard?page=2
```

### 3. Search Users
```bash
curl "http://localhost:8080/api/search?q=rahul"
```

## 🧠 Design Decisions

For production with millions of users, would use:
- **Redis** for caching ranks
- **PostgreSQL** for persistent storage
- **Message queue** for rating updates

### Ranking Algorithm
```go
// Sort by rating (descending)
sort.Slice(users, func(i, j int) bool {
    if users[i].Rating == users[j].Rating {
        return users[i].Username < users[j].Username
    }
    return users[i].Rating > users[j].Rating
})

// Assign ranks (same rating = same rank)
currentRank := 1
for i := 0; i < len(users); i++ {
    if i > 0 && users[i].Rating != users[i-1].Rating {
        currentRank = i + 1
    }
    users[i].Rank = currentRank
}
```


## 📝 API Endpoints

```
GET  /api/leaderboard?page=1  - Get paginated leaderboard
GET  /api/search?q=username   - Search users by username
POST /api/seed                - Seed 10,000 test users
POST /api/update-rating       - Update user rating
GET  /health                  - Health check
```

## 🎯 Assignment Requirements Met

✅ Manages 10,000+ users
✅ Correct tie-aware ranking
✅ Random score updates simulation
✅ Fast user search with global rank
✅ React Native (Expo) frontend
✅ Golang backend
✅ Responsive UI
✅ Pull-to-refresh
✅ Pagination

---

**Note:** This is a demo project for internship assignment. For production use, add proper error handling, database persistence, authentication, and monitoring.