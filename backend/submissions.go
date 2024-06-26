package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Submission struct {
	gorm.Model

	ID              uint     `gorm:"type:integer;primarykey;unique" json:"id"`
	Title           string   `gorm:"type:text"`
	PrimaryAliases  []string `gorm:"type:text;not null"`
	FeaturedAliases []string `gorm:"type:text"`
	WaveURL         string   `gorm:"type:text"`
	AdminURL        string   `gorm:"type:text"`
	Votes           []Vote
	Disqualified    bool `gorm:"type:boolean"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

/*
	Reinitializes all values from the submission that should not be assigned by outside sources
*/
func (s *Submission) Flatten() {
	s.Votes = []Vote{}
	s.Disqualified = false
}

func apiSubmissionsAdd(c *gin.Context) {
	var sub Submission

	err := c.ShouldBindJSON(&sub)
	if err != nil {
		c.JSON(400, gin.H{
			"success": "false",
			"error":   err.Error(),
		})
		return
	}

	fmt.Println(sub)
	sub.Flatten()

	tx := db.Begin()
	defer func() {
		if rec := recover(); rec != nil {
			tx.Rollback()
		}
	}()

	if err := tx.Error; err != nil {
		c.JSON(500, gin.H{
			"success": "false",
			"error":   err.Error(),
		})
		return
	}

	if err := tx.Create(&sub).Error; err != nil {
		tx.Rollback()

		c.JSON(500, gin.H{
			"success": "false",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": "true",
		"result":  sub,
	})

	if err := tx.Commit().Error; err != nil {
		c.JSON(500, gin.H{
			"success": "false",
			"error":   err.Error(),
		})
		return
	}
}

func apiSubmissionsGet(c *gin.Context) {
	var subs []Submission

	if err := db.Find(&subs).Error; err != nil {
		c.JSON(500, gin.H{
			"success": "false",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"success": "true",
		"result":  subs,
	})
}

func apiVoteAdd(c *gin.Context) {

}
