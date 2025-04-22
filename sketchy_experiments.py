from artiq.experiment import *
import time

class Foo(EnvExperiment):
    """Management tutorial"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(1)
        print("This is a msg straight from an ARTIQ experiment")

class Bar(EnvExperiment):
    """Test Test Test"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(2)
        print("This is a msg straight from an ARTIQ experiment")
