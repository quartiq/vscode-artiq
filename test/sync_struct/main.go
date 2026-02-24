package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
)

func main() {
	conn, err := net.Dial("tcp", "localhost:3250")
	if err != nil {
		log.Println(err)
	}

	// see: sipyco/sync_struct:123
	fmt.Fprintf(conn, "ARTIQ sync_struct\n")
	fmt.Fprintf(conn, "schedule\n")

	log.Println("Subscribed to the Publisher.")
	log.Println("Selected notifier_name \"schedule\".")

	r := bufio.NewReader(conn)

	for {
		status, err := r.ReadString('\n')
		log.Println(status)

		if err != nil {
			log.Fatalf("err: %v", err)
		}
	}
}
