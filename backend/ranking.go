package main

import "sort"

// calculate ranks for all users
// users with same rating get same rank
func CalculateRanks(users []*User) []*User {
	// sort by rating (highest first)
	sort.Slice(users, func(i, j int) bool {
		if users[i].Rating == users[j].Rating {
			// if rating same, sort by username
			return users[i].Username < users[j].Username
		}
		return users[i].Rating > users[j].Rating
	})

	// assign ranks
	currentRank := 1
	for i := 0; i < len(users); i++ {
		// if rating changed, update rank
		if i > 0 && users[i].Rating != users[i-1].Rating {
			currentRank = i + 1
		}
		users[i].Rank = currentRank
	}

	return users
}

// get specific page of leaderboard
func GetLeaderboardPage(users []*User, page int, pageSize int) []*User {
	start := (page - 1) * pageSize
	end := start + pageSize

	// check if page is out of bounds
	if start >= len(users) {
		return []*User{}
	}

	if end > len(users) {
		end = len(users)
	}

	return users[start:end]
}
