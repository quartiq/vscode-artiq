from artiq.experiment import *
import time

class Cottus(EnvExperiment):
    """furious"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(3)
        print("This is a msg straight from an ARTIQ experiment")

class Alcyoneus(EnvExperiment):
    """greatest"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(2)
        print("This is a msg straight from an ARTIQ experiment")

class Porphyrion(EnvExperiment):
    """king"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(4)
        print("This is a msg straight from an ARTIQ experiment")

class Damysus(EnvExperiment):
    """fastest"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(1)
        print("This is a msg straight from an ARTIQ experiment")
