package main

import (
	"sync"
	"time"
)

type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Rating    int       `json:"rating"`
	Rank      int       `json:"rank"`
	CreatedAt time.Time `json:"created_at"`
}
type UserStore struct {
	users    map[int]*User
	userList []*User
	mu       sync.RWMutex
	nextID   int
}

func NewUserStore() *UserStore {
	return &UserStore{
		users:    make(map[int]*User),
		userList: make([]*User, 0),
		nextID:   1,
	}
}

func (s *UserStore) AddUser(username string, rating int) *User {
	s.mu.Lock()
	defer s.mu.Unlock()

	user := &User{
		ID:        s.nextID,
		Username:  username,
		Rating:    rating,
		CreatedAt: time.Now(),
	}

	s.users[user.ID] = user
	s.userList = append(s.userList, user)
	s.nextID++

	return user
}

func (s *UserStore) UpdateRating(userID int, newRating int) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	user, exists := s.users[userID]
	if !exists {
		return false
	}

	user.Rating = newRating
	return true
}

func (s *UserStore) GetAllUsers() []*User {
	s.mu.RLock()
	defer s.mu.RUnlock()

	usersCopy := make([]*User, len(s.userList))
	copy(usersCopy, s.userList)
	return usersCopy
}

func (s *UserStore) SearchByUsername(searchTerm string) []*User {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var results []*User

	for _, user := range s.userList {
		if contains(user.Username, searchTerm) {
			results = append(results, user)
		}
	}

	return results
}

func contains(str, substr string) bool {
	strLower := ""
	substrLower := ""

	for _, ch := range str {
		if ch >= 'A' && ch <= 'Z' {
			strLower += string(ch + 32)
		} else {
			strLower += string(ch)
		}
	}

	for _, ch := range substr {
		if ch >= 'A' && ch <= 'Z' {
			substrLower += string(ch + 32)
		} else {
			substrLower += string(ch)
		}
	}
	for i := 0; i <= len(strLower)-len(substrLower); i++ {
		if strLower[i:i+len(substrLower)] == substrLower {
			return true
		}
	}
	return false
}
