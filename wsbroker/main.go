package main

import (
	"encoding/json"
	"io/ioutil"
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

var Cfg map[string]any

func main() {
	cfgpath := "../repository/.vscode/settings.json"

	j, err := ioutil.ReadFile(cfgpath)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(j, &Cfg)
	if err != nil {
		log.Fatalf("%s: %s", cfgpath, err)
	}

	http.HandleFunc("/", handler)

	host := Cfg["forwarding.host"].(string)
	log.Printf("Listening at %s", host)
	log.Fatal(http.ListenAndServe(host, nil))
}
