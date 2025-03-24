package main

import (
	"log"
	"net"
	"net/http"

	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

var subs = make(map[net.Conn]bool)

func handler(w http.ResponseWriter, r *http.Request) {
	conn, _, _, _ := ws.UpgradeHTTP(r, w)
	go func() {
		defer func() {
			conn.Close()
			delete(subs, conn)
		}()

		subs[conn] = true

		for {
			msg, err := wsutil.ReadClientText(conn)
			if err != nil {
				break
			}

			for c, _ := range subs {
				wsutil.WriteServerText(c, msg)
			}
		}
	}()
}

func main() {
	http.HandleFunc("/", handler)

	log.Println("Listening at localhost:8001")
	log.Fatal(http.ListenAndServe("localhost:8001", nil))
}
