package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	fmt.Println("Starting Matiks Leaderboard API...")

	router := mux.NewRouter()

	// setup routes
	router.HandleFunc("/api/leaderboard", GetLeaderboard).Methods("GET")
	router.HandleFunc("/api/search", SearchUsers).Methods("GET")
	router.HandleFunc("/api/seed", SeedDatabase).Methods("POST")
	router.HandleFunc("/api/update-rating", UpdateRating).Methods("POST")

	// health check endpoint
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Server is running!"))
	}).Methods("GET")

	// start background simulation
	go SimulateRatingUpdates()

	// cors setup
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: false,
	})

	handler := c.Handler(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	listenAddr := "0.0.0.0:" + port

	fmt.Printf("Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(listenAddr, handler))
}
