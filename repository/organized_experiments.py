from artiq.experiment import *
import time

class Alpha(EnvExperiment):
    """One"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(1)
        print("Only the mediocre are always at their best.")

class Beta(EnvExperiment):
    """Two"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(2)
        print("Inspiration does exist, but it must find you working.")

class Gamma(EnvExperiment):
    """Three"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(3)
        print("There’s nothing I like less than bad arguments for a view that I hold dear.")
