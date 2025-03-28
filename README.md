# VS Code ARTIQ Extension

A proof of concept recreating the ARTIQ dashboard in VS Code through their Extension API

## Run

- edit `repository/.vscode/settings.json` to your desire

- obtain ARTIQ environment: `nix shell`
- start ARTIQ server: `artiq_master`

- in VS Code, obtain an "Extension Development Host" window:
    - open the folder `extension`
    - edit `extension/src/extension.ts`
    - press `F5`

- in the "Extension Development Host" window:
    - open experiment folder, e. g. `repository`
    - edit experiment file
    - run experiment: `Ctrl+Shift+X`

    - alternatively, open "Command Palette": `Ctrl+Shift+P`
    - select "ARTIQ: Run Experiment"
