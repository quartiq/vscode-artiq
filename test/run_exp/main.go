package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net"
)

func main() {
	// artiq/frontend/artiq_client: 381, 394
	// sipyco/pc_rpc: 110
	conn, err := net.Dial("tcp", "[::1]:3251")
	if err != nil {
		log.Println(err)
	}

	// sipyco/pc_rpc: 41, 113
	fmt.Fprintf(conn, "ARTIQ pc_rpc\n")
	status, err := bufio.NewReader(conn).ReadString('\n')
	log.Println(status)
	if err != nil {
		log.Fatalf("err: %v", err)
	}
	log.Println("Handshake done.")
	// artiq_client: 383
	// sipyco/pc_rpc: 130
	fmt.Fprintf(conn, "experiment_db\n")
	status, err = bufio.NewReader(conn).ReadString('\n')
	log.Println(status)

	if err != nil {
		log.Fatalf("err: %v", err)
	}

	log.Println("Selected target \"schedule\".")

	// see: logging in python docs
	//WARNING := 30

	// sipyco/pc_rpc: 175, 558, 624

	obj := map[string]any{
		"action": "call",
		"name":   "root",
		"args":   []any{
			//			"main", // pipeline_name
			//			map[string]any{ // expid
			//				"file":       "/home/pk/quartiq/vscode-artiq/repository/mgmt_tutorial.py",
			//				"log_level":  WARNING,
			//				"class_name": nil,
			//				"arguments":  map[string]any{},
			//			},
		},
		"kwargs": map[string]any{},
	}

	// sipyco/pc_rpc: 156-157
	// sipyco/pyon: 244
	j, _ := json.Marshal(obj)
	log.Printf("JSON: %s", j)

	fmt.Fprintf(conn, "%s\n", j)
	log.Println("Submit requested.")

	// sipyco/pc_rpc: 558-559
	status, err = bufio.NewReader(conn).ReadString('\n')
	log.Printf("reply: %v", status)

	if err != nil {
		log.Fatalf("err: %v", err)
	}
}
