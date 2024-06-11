package main

import (
	"log"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

type Submission struct {
	gorm.Model

	ID              uint     `gorm:"type:integer;primaryKey;unique"`
	PrimaryAliases  []string `gorm:"type:text;not null"`
	FeaturedAliases []string `gorm:"type:text"`
	WaveURL         string   `gorm:"type:text"`
	AdminURL        string   `gorm:"type:text"`
	Votes           []Vote
	Disqualified    bool `gorm:"type:boolean"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type Vote struct {
	ID           uint `gorm:"primaryKey;autoIncrement;unique"`
	OwnerID      uint `gorm:"type:integer;not null"`
	Value        uint `gorm:"type:integer;not null"`
	SubmissionID uint `gorm:"type:integer;not null;index"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

type User struct {
	gorm.Model

	ID        uint   `gorm:"primaryKey;autoIncrement;unique"`
	Name      string `gorm:"type:text"`
	AvatarURL string `gorm:"type:text"`
	IsAdmin   bool   `gorm:"type:integer"`
}

func init() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	db.AutoMigrate(&Submission{}, &Vote{}, &User{})

	log.Println("database connection established", db) // TODO: remove db from this it just needs to be used somewhere
}
