package main

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

type Vote struct {
	gorm.Model

	ID           uint `gorm:"primarykey;autoIncrement;unique"`
	SubmissionID int  `gorm:"type:integer"`
	OwnerID      uint `gorm:"type:integer;not null"`
	Value        uint `gorm:"type:integer;not null"`

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
	var err error

	// TODO: connect with secret not hardcode
	db, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  "postgres://postgres:MNINpVepmJ6LLvr@137.66.33.63:5432/postgres",
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	}))

	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	db.AutoMigrate(&Submission{}, &Vote{}, &User{})
}
