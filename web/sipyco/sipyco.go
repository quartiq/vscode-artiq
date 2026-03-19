package sipyco

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"time"

	"github.com/coder/websocket"
)

func read(ctx context.Context, conn *websocket.Conn) []byte {
	_, bytes, err := conn.Read(ctx)
	if err != nil {
		log.Fatalf("err: %v", err)
	}

	return bytes
}

func listenAndServe(connWs *websocket.Conn) {
	defer connWs.CloseNow()

	ctxRead, cancel := context.WithCancel(context.Background())
	defer cancel()

	connTcp, err := net.Dial("tcp", string(read(ctxRead, connWs)))
	if err != nil {
		log.Printf("err: bad address: %v", err)
		return
	}
	defer connTcp.Close()

	fmt.Fprintf(connTcp, "%s\n", read(ctxRead, connWs))
	fmt.Fprintf(connTcp, "%s\n", read(ctxRead, connWs))

	r := bufio.NewReader(connTcp)
	for {
		msg, err := r.ReadBytes('\n')
		if err != nil {
			log.Printf("err: bad protocol: %v", err)
			break
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		err = connWs.Write(ctx, websocket.MessageText, msg)
		cancel()
		if err != nil {
			log.Fatalf("err: %v", err)
		}
	}
}

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}

	go listenAndServe(conn)
}