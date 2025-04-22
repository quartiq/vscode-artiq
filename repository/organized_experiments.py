from artiq.experiment import *
import time

class Alpha(EnvExperiment):
    """One"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(1)
        print("This is a msg straight from an ARTIQ experiment")

class Beta(EnvExperiment):
    """Two"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(2)
        print("This is a msg straight from an ARTIQ experiment")

class Gamma(EnvExperiment):
    """Three"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(3)
        print("This is a msg straight from an ARTIQ experiment")
