FROM golang:alpine

WORKDIR /app

COPY go.sum go.mod ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -o /main

EXPOSE 8080

CMD ["/docker-gs-ping"]