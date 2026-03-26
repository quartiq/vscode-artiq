package proxy

import (
	"bufio"
	"context"
	"errors"
	"io"
	"log"
	"net"
	"net/http"
	"time"

	"github.com/coder/websocket"
)

func listenWsServeTcp(wsConn *websocket.Conn, tcpConn net.Conn) {
	ctx := context.Background()

	for {
		_, msg, err := wsConn.Read(ctx)
		if err != nil {
			code := websocket.CloseStatus(err)
			if code == websocket.StatusNormalClosure || code == websocket.StatusGoingAway {
				log.Println("ws closed")
			} else {
				log.Printf("ws read error: %v", err)
			}
			return
		}

		_, err = tcpConn.Write(msg)
		if err != nil {
			log.Printf("tcp write err: %v", err)
			return
		}
	}
}

func listenTcpServeWs(tcpConn net.Conn, wsConn *websocket.Conn) {
	r := bufio.NewReader(tcpConn)

	for {
		msg, err := r.ReadBytes('\n')
		if err != nil {
			if errors.Is(err, io.EOF) {
				log.Println("tcp closed")
			} else {
				log.Printf("tcp read error: %v", err)
			}
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		err = wsConn.Write(ctx, websocket.MessageText, msg)
		cancel()
		if err != nil {
			log.Printf("ws write err: %v", err)
			return
		}
	}
}

func HandlerFunc(w http.ResponseWriter, r *http.Request) {
	wsConn, err := websocket.Accept(w, r, nil)
	if err != nil {
		log.Printf("ws accept err: %v", err)
		return
	}
	defer wsConn.Close(websocket.StatusNormalClosure, "")

	tcpConn, err := net.Dial("tcp", r.URL.Path[len("/proxy/"):])
	if err != nil {
		log.Printf("tcp accept err: %v", err)
		wsConn.Close(websocket.StatusInternalError, err.Error())
		return
	}
	defer tcpConn.Close()

	go listenWsServeTcp(wsConn, tcpConn)
	listenTcpServeWs(tcpConn, wsConn)
}
