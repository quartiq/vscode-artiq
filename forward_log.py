import asyncio
import json

from websockets.sync.client import connect

import time

from sipyco.broadcast import Receiver
from sipyco.asyncio_tools import SignalHandler

def run_subscriber(host, port, subscriber):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        signal_handler = SignalHandler()
        signal_handler.setup()
        try:
            loop.run_until_complete(subscriber.connect(host, port))
            try:
                _, pending = loop.run_until_complete(asyncio.wait(
                    [loop.create_task(signal_handler.wait_terminate()), subscriber.receive_task],
                    return_when=asyncio.FIRST_COMPLETED))
                for task in pending:
                    task.cancel()
            finally:
                loop.run_until_complete(subscriber.close())
        finally:
            signal_handler.teardown()
    finally:
        loop.close()

websocket = connect("ws://localhost:8001")

def forward(record):
    websocket.send(json.dumps(record))

subscriber = Receiver("log", [forward])
server = "::1"
port = 1067
run_subscriber(server, port, subscriber)
