# VS Code ARTIQ Extension

A proof of concept creating an ARTIQ user interface in VS Code through their Extension API.
This extension expects to be run alongside an ARTIQ instance in the same filesystem tree.

## Run

- run dummy ARTIQ master instance:
    - clone: `git clone https://github.com/m-labs/artiq`
    - obtain environment: `cd artiq; nix develop`
    - start server: `cd artiq/examples/no_hardware; artiq_master`

- prepare ARTIQ VSCode extension:
    - clone: `git clone https://github.com/quartiq/vscode-artiq`
    - obtain dependencies: `cd vscode-artiq; npm install`
    - (for development) automate typescript compilation: `npm run watch`

- obtain an "Extension Development Host" window:
    - open VSCode
    - open the folder `vscode-artiq`
    - press `F5`

## Submit your first experiment

- switch to the "Extension Development Host" window
- edit File -> Preferences -> Settings -> Extensions -> ARTIQ
- open experiment file, e. g. `example_experiment.py`
- move cursor to desired class definition
- submit experiment: `Ctrl+Shift+X`

- alternatively, open "Command Palette": `Ctrl+Shift+P`
- select "ARTIQ: Submit Experiment"

- alternatively, click "Submit" action icon in the "Experiment" sidebar toolbar
