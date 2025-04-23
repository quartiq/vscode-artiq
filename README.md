# VS Code ARTIQ Extension

A proof of concept recreating the ARTIQ dashboard in VS Code through their Extension API.
This extension expects to be run alongside an ARTIQ instance in the same filesystem tree.

## Run

- run dummy ARTIQ instance:
    - clone: `git clone https://github.com/m-labs/artiq`
    - obtain environment: `cd artiq; nix develop`
    - start server: `cd vscode-artiq; artiq_master`

- obtain dependencies: `cd extension; npm install`

- in VS Code, obtain an "Extension Development Host" window:
    - open the folder `extension`
    - edit `src/extension.ts`
    - press `F5`

- in the "Extension Development Host" window:
    - edit File -> Preferences -> Settings -> Extensions -> ARTIQ Dashboard
    - open experiment file, e. g. `example_experiment.py`
    - move cursor to desired class definition
    - submit experiment: `Ctrl+Shift+X`

    - alternatively, open "Command Palette": `Ctrl+Shift+P`
    - select "ARTIQ: Submit Experiment"

    - alternatively, click "Submit" action in the "Experiment" sidebar toolbar
