package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net"
)

func main() {
	conn, err := net.Dial("tcp", "[::1]:3251")
	if err != nil {
		log.Println(err)
	}

	fmt.Fprintf(conn, "ARTIQ pc_rpc\n")
	status, err := bufio.NewReader(conn).ReadString('\n')
	log.Println(status)
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	log.Println("Handshake done.")
	fmt.Fprintf(conn, "experiment_db\n")
	status, err = bufio.NewReader(conn).ReadString('\n')
	log.Println(status)

	if err != nil {
		log.Fatalf("err: %v", err)
	}

	log.Println("Selected target \"experiment_db\".")

	obj := map[string]any{
		"action": "call",
		"name":   "scan_repository",
		"args":   []any{},
		"kwargs": map[string]any{},
	}

	j, _ := json.Marshal(obj)
	log.Printf("JSON: %s", j)

	fmt.Fprintf(conn, "%s\n", j)
	log.Println("RPC requested.")

	status, err = bufio.NewReader(conn).ReadString('\n')
	log.Printf("reply: %v", status)

	if err != nil {
		log.Fatalf("err: %v", err)
	}
}
