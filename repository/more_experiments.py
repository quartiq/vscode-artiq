from artiq.experiment import *
import time

class Cottus(EnvExperiment):
    """furious"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(3)
        print("Reality is what refuses to go away when I stop believing in it.")

class Alcyoneus(EnvExperiment):
    """greatest"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(2)
        print("Never let your sense of morals prevent you from doing what’s right.")

class Porphyrion(EnvExperiment):
    """king"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(4)
        print("Fools ignore complexity. Pragmatists suffer it. Some can avoid it. Geniuses remove it.")

class Damysus(EnvExperiment):
    """fastest"""
    def build(self):
        pass  # no devices used

    def run(self):
        time.sleep(1)
        print("There is nothing worse than imagination without taste.")
