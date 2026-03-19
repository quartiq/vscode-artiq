package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"web-artiq/sipyco"
)

func viewHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, `
		<!DOCTYPE html>
		<script type="module" src="/static/%s.js"></script>
	`, r.URL.Path[1:])
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, r.URL.Path[1:])
}

func main() {
	http.HandleFunc("/", viewHandler)
	http.HandleFunc("/static/", fileHandler)
	http.HandleFunc("/sipyco", sipyco.HandlerFunc)

	if len(os.Args) < 2 {
		fmt.Println("missing URI argument")
		return
	}
	log.Printf("Listening at %s", os.Args[1])
	log.Fatal(http.ListenAndServe(os.Args[1], nil))
}
