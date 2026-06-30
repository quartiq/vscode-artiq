package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"slices"
	"os"

	"web-artiq/proxy"
)

func viewHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `
		<!DOCTYPE html>
		<html>
			<head>
				<link href="/static/%s.css" rel="stylesheet">
			</head>
			<body>
				<script type="module" src="/static/%s.js"></script>
			</body>
		</html>
	`, r.URL.Path[1:], r.URL.Path[1:])
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, r.URL.Path[1:])
}

func whitelist() []string {
	wlPath := flag.String("whitelist", "", "")
	flag.Parse()

	list := []string{}

	if *wlPath == "" {
		return list
	}

	j, err := os.ReadFile(*wlPath)
	if err != nil {
		return list
	}

	json.Unmarshal([]byte(j), &list)
	return list
}

func main() {
	wl := whitelist()
	args := flag.Args()

	http.HandleFunc("/", viewHandler)
	http.HandleFunc("/static/", fileHandler)
	http.HandleFunc("/proxy/", func(w http.ResponseWriter, r *http.Request) {
		if !slices.Contains(wl, r.URL.Path[len("/proxy/"):]) {
			w.WriteHeader(403)
			w.Write([]byte("403 - Forbidden\n"))
			return
		}

		proxy.HandlerFunc(w, r)
	})

	if len(args) < 1 {
		fmt.Println("missing URI argument")
		return
	}

	log.Printf("Listening at http://%s", args[0])
	log.Fatal(http.ListenAndServe(args[0], nil))
}
