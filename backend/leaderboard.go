package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"sort"
	"strconv"
	"sync"
	"time"
)

var store *UserStore
var seedOnce sync.Once // Ensures seeding happens only once

func init() {
	store = NewUserStore()
	rand.Seed(time.Now().UnixNano())

	// Auto-seed on startup
	seedOnce.Do(func() {
		autoSeedDatabase()
	})
}

// Auto-seed function that runs on server startup
func autoSeedDatabase() {
	fmt.Println("🌱 Auto-seeding database on startup...")

	firstNames := []string{
		"rahul", "priya", "amit", "sneha", "vikram", "anjali", "raj", "pooja",
		"arjun", "neha", "rohan", "kavya", "aditya", "ishita", "karan", "divya",
		"sanjay", "meera", "naveen", "riya",
	}

	lastNames := []string{
		"kumar", "sharma", "patel", "singh", "gupta", "reddy", "verma", "mathur",
		"agarwal", "joshi", "rao", "burman", "kapoor", "nair", "das", "iyer",
	}

	for i := 0; i < 10000; i++ {
		firstName := firstNames[rand.Intn(len(firstNames))]
		lastName := lastNames[rand.Intn(len(lastNames))]
		username := fmt.Sprintf("%s_%s%d", firstName, lastName, rand.Intn(1000))
		rating := rand.Intn(4901) + 100
		store.AddUser(username, rating)
	}

	fmt.Printf("✅ Auto-seeding completed! Total users: %d\n", len(store.GetAllUsers()))
}

func GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	pageStr := r.URL.Query().Get("page")
	page := 1
	if pageStr != "" {
		page, _ = strconv.Atoi(pageStr)
	}

	pageSize := 50

	users := store.GetAllUsers()
	users = CalculateRanks(users)

	paginatedUsers := GetLeaderboardPage(users, page, pageSize)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"users":       paginatedUsers,
		"total":       len(users),
		"page":        page,
		"total_pages": (len(users) + pageSize - 1) / pageSize,
	})
}

func SearchUsers(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Search query required", http.StatusBadRequest)
		return
	}

	results := store.SearchByUsername(query)

	// need to calculate global rank for each search result
	allUsers := store.GetAllUsers()
	allUsers = CalculateRanks(allUsers)

	// create a map to store ranks
	rankMap := make(map[int]int)
	for _, user := range allUsers {
		rankMap[user.ID] = user.Rank
	}

	// assign ranks to search results
	for _, user := range results {
		user.Rank = rankMap[user.ID]
	}

	// sort by rank
	sort.Slice(results, func(i, j int) bool {
		return results[i].Rank < results[j].Rank
	})

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// Keep manual seed endpoint for testing (optional)
func SeedDatabase(w http.ResponseWriter, r *http.Request) {
	// Check if already seeded
	if len(store.GetAllUsers()) > 0 {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Database already seeded",
			"total":   len(store.GetAllUsers()),
		})
		return
	}

	autoSeedDatabase()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Database seeded with 10,000 users",
		"total":   len(store.GetAllUsers()),
	})
}

func UpdateRating(w http.ResponseWriter, r *http.Request) {
	var req struct {
		UserID int `json:"user_id"`
		Rating int `json:"rating"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.Rating < 100 || req.Rating > 5000 {
		http.Error(w, "Rating must be between 100 and 5000", http.StatusBadRequest)
		return
	}

	success := store.UpdateRating(req.UserID, req.Rating)
	if !success {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Rating updated successfully",
	})
}

// background task - simulates live rating updates
func SimulateRatingUpdates() {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		users := store.GetAllUsers()
		if len(users) == 0 {
			continue
		}

		randomUser := users[rand.Intn(len(users))]

		change := rand.Intn(101) - 50
		newRating := randomUser.Rating + change

		if newRating < 100 {
			newRating = 100
		}
		if newRating > 5000 {
			newRating = 5000
		}

		store.UpdateRating(randomUser.ID, newRating)
	}
}
