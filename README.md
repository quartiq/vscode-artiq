# VS Code ARTIQ Extension

A proof of concept recreating the ARTIQ dashboard in VS Code through their Extension API

## Run

- obtain artiq environment: `nix shell`
- start artiq: `artiq_master &`

- start ws server: `cd wsbroker; go run main.go &`
- run m-labs/sipyco websocket shim: `python3 forward_log.py &`

- in VS Code, obtain an "Extension Development Host" window:
    - open the folder `extension`
    - edit `extension/src/extension.ts`
    - press `F5`

- run artiq experiment: `artiq_client submit repository/mgmt_tutorial.py`
