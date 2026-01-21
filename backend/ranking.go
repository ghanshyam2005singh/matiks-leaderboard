package main

import "sort"

func CalculateRanks(users []*User) []*User {
	sort.Slice(users, func(i, j int) bool {
		if users[i].Rating == users[j].Rating {
			return users[i].Username < users[j].Username
		}
		return users[i].Rating > users[j].Rating
	})

	currentRank := 1
	for i := 0; i < len(users); i++ {
		if i > 0 && users[i].Rating != users[i-1].Rating {
			currentRank = i + 1
		}
		users[i].Rank = currentRank
	}

	return users
}

func GetLeaderboardPage(users []*User, page int, pageSize int) []*User {
	start := (page - 1) * pageSize
	end := start + pageSize

	if start >= len(users) {
		return []*User{}
	}

	if end > len(users) {
		end = len(users)
	}

	return users[start:end]
}
