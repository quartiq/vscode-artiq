from artiq.experiment import *

class MgmtTutorial(EnvExperiment):
    """Management tutorial"""
    def build(self):
        pass  # no devices used

    def run(self):
        print("This is a msg straight from an ARTIQ experiment")
