package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	r := gin.Default()

	api := r.Group("/api")

	submissions := api.Group("/submissions")
	submissions.POST("/add", apiSubmissionsAdd)
	submissions.GET("/get", apiSubmissionsGet)

	fmt.Println("server running")
	r.Run()
}
