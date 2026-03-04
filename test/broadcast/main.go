package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
)

func request(conn net.Conn, token string) {
	fmt.Fprintf(conn, token)
	data, err := bufio.NewReader(conn).ReadString('\n')
	if err != nil {
		log.Fatal(err)
	}

	log.Println(data)
}

func main() {
	port := "3250"
	banner := "sync_struct"
	target := "schedule"

	log.Printf("Dialing port %s.", port)

	//conn, err := net.Dial("tcp", "[::1]:"+port)
	conn, err := net.Dial("tcp", "localhost:"+port)
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	log.Printf("Connected. Register banner \"%s\".", banner)

	request(conn, "ARTIQ "+banner+"\n")
	log.Printf("Registered banner \"%s\". Select target \"%s\".", banner, target)

	request(conn, target+"\n")
	log.Printf("Selected target \"%s\".", target)
}
