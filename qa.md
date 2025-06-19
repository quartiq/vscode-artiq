# Overview

- [x] "ARTIQ" View Container in Activity Bar
    - [x] "Explorer" TreeView in Primary Sidebar
    - [x] "Experiment" WebView in Primary Sidebar

- [x] "ARTIQ" View Container in Panel
    - [x] "Log" WebView in Panel
    - [x] "Schedule" WebView in Panel

- [x] Error message on bad connection to ARTIQ server
- [x] Call to install "ms-python" extension, if missing

# "Explorer" TreeView

- [x] "Scan Repository" button in View Toolbar

- on load:
    - [x] cache repository experiments via ARTIQ server
    - [x] list all repository experiments by name

- on click on TreeItem, in Editor:
    - [x] open corresponding file
    - [ ] selects first line of corresponding class

- on click on "Scan Repository" button:
    - [x] request scan via ARTIQ server
    - on response:
        - [x] update repo cache
        - [x] update list of TreeItems
        - [x] update "Experiment" view

# Editor

- on change of file:
    - [x] check repo and exam caches for corresponding experiments
    - [x] if none, hint scan or examination in "Experiment" view
    - [x] update available experiments cache

    - in "Explorer":
        - [x] select corresponding TreeItem
        - [ ] otherwise deselect any TreeItem

    - in "Experiment":
        - [x] show corresponding submit form
        - [ ] transfer experiment data into form fields
        - [x] otherwise hide submit form

- on change of selection:
    - [x] check available cache for corresponding experiment

    - in "Explorer":
        - [x] select corresponding TreeItem
        - [ ] otherwise deselect any TreeItem

    - in "Experiment":
        - [x] show corresponding submit form
        - [ ] transfer experiment data into form fields
        - [x] otherwise hide submit form

# "Experiment"
- *todo* persistant custom data in form fields

- [x] "Submit Experiment" button in View Toolbar
- [x] "Examine File" button in View Toolbar

- form consists of:
    - [x] "Priority" input field
    - [x] "Log level" input field
    - [x] "Pipeline" input field
    - [x] "Flush" checkbox
    - [x] "Submit" button

on load:
    - [ ] cache global submit params via ARTIQ server

- on click on "Submit" form button
    - [ ] submit experiment with form params via ARTIQ server

- on click on "Submit Experiment" toolbar button
    - [ ] submit experiment with global params via ARTIQ server
    - [ ] shortcut Ctrl+Shift+X (?)

- on click on "Examine File" button:
    - [x] request examination via ARTIQ server
    - [ ] shortcut Ctrl+Shift+E (?)
    - on response:
        - [x] update exam cache
        - [x] update "Experiment" view

- on change of file:
    - [ ] hide "Examine File" button if active file is repository file
