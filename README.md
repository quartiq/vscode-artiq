# VS Code ARTIQ Extension

A proof of concept recreating the ARTIQ dashboard in VS Code through their Extension API.
This extension expects to be run alongside an ARTIQ instance in the same filesystem tree.

## Run

- clone ARTIQ: `git clone https://github.com/m-labs/artiq`
- obtain ARTIQ environment: `cd artiq; nix develop`
- start ARTIQ server: `cd vscode-artiq; artiq_master`

- in VS Code, obtain an "Extension Development Host" window:
    - open the folder `extension`
    - edit `src/extension.ts`
    - press `F5`

- in the "Extension Development Host" window:
    - edit File -> Preferences -> Settings -> Extensions -> ARTIQ Dashboard
    - open experiment file, e. g. `example_experiment.py`
    - run experiment: `Ctrl+Shift+X`

    - alternatively, open "Command Palette": `Ctrl+Shift+P`
    - select "ARTIQ: Run Experiment"
