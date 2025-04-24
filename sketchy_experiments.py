from artiq.experiment import *
import time

class Foo(EnvExperiment):
    """Management tutorial"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(1)
        print("It’s possible that I understand better what’s going on, or it’s equally possible that I just think I do.")

class Bar(EnvExperiment):
    """Test Test Test"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(2)
        print("A thinker sees his own actions as experiments and questions–as attempts to find out something. Success and failure are for him answers above all.")
