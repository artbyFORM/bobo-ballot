# bobo-ballot backend

## Requirements
bobo-ballot requires Go version 1.22.4 or above.

## Running backend
To run, you must first set the required environment variables:

```sh
BALLOT_ENVIRONMENT = DEV    # may be DEV or PROD
BALLOT_DATABASE = SQLITE    # may by SQLITE or POSTGRES
BALLOT_PORT = 8080          # specify port to listen on

POSTGRES_URL = postgresql://user:pass@127.0.0.1:5432/db # must replace with own postgres url (if using postgres)
```

Then, to download the required packages, run:
```sh
$ go mod download
```

To build and run the binary, run:
```sh
$ go build -o ./main
$ ./main
```

or, alternatively:
```sh
$ go run .
```