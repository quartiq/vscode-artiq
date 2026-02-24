package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
)

func main() {
	conn, err := net.Dial("tcp", "[::1]:3250")
	if err != nil {
		log.Println(err)
	}

	// see: sipyco/sync_struct:123
	fmt.Fprintf(conn, "ARTIQ sync_struct\n")
	fmt.Fprintf(conn, "explist_status\n")

	log.Println("Subscribed to the Publisher.")
	log.Println("Selected notifier_name \"schedule\".")

	for {
		status, err := bufio.NewReader(conn).ReadString('\n')
		log.Println(status)

		if err != nil {
			log.Fatalf("err: %v", err)
		}
	}
}
