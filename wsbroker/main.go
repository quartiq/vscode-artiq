package main

import (
    "net"
	"net/http"
    "log"

	"github.com/gobwas/ws"
    "github.com/gobwas/ws/wsutil"
)

func kill(c net.Conn, conns map[net.Conn]bool) {
    delete(conns, c)
    c.Close()
}

func main() {
    conns := make(map[net.Conn]bool)

    log.Println("Listening at :8001")
	http.ListenAndServe(":8001", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		conn, _, _, err := ws.UpgradeHTTP(r, w)
        conns[conn] = true
		if err != nil {
			// handle error
            log.Println(err)
		}
		go func() {
			defer kill(conn, conns)

			for {
				msg, op, err := wsutil.ReadClientData(conn)
                log.Println("Got msg: " + string(msg))
				if err != nil {
					// handle error
                    log.Println(err)
				}

                for c, _ := range conns {
				    err = wsutil.WriteServerMessage(c, op, msg)
				    if err != nil {
					    // handle error
                        log.Println(err)
				    }
                }
			}
		}()
	}))
}
