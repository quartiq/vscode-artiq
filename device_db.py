
# Autogenerated for the solis1gmaster variant
core_addr = "192.168.10.200"

device_db = {
    "core": {
        "type": "local",
        "module": "artiq.coredevice.core",
        "class": "Core",
        "arguments": {
            "host": core_addr,
            "ref_period": 1e-09,
            "analyzer_proxy": "core_analyzer",
            "target": "rv32g",
            "satellite_cpu_targets": {}
        },
    },
    "core_log": {
        "type": "controller",
        "host": "::1",
        "port": 1068,
        "command": "aqctl_corelog -p {port} --bind {bind} " + core_addr
    },
    "core_moninj": {
        "type": "controller",
        "host": "::1",
        "port_proxy": 1383,
        "port": 1384,
        "command": "aqctl_moninj_proxy --port-proxy {port_proxy} --port-control {port} --bind {bind} " + core_addr
    },
    "core_analyzer": {
        "type": "controller",
        "host": "::1",
        "port_proxy": 1385,
        "port": 1386,
        "command": "aqctl_coreanalyzer_proxy --port-proxy {port_proxy} --port-control {port} --bind {bind} " + core_addr
    },
    "core_cache": {
        "type": "local",
        "module": "artiq.coredevice.cache",
        "class": "CoreCache"
    },
    "core_dma": {
        "type": "local",
        "module": "artiq.coredevice.dma",
        "class": "CoreDMA"
    },

    "i2c_switch0": {
        "type": "local",
        "module": "artiq.coredevice.i2c",
        "class": "I2CSwitch",
        "arguments": {"address": 0xe0}
    },
    "i2c_switch1": {
        "type": "local",
        "module": "artiq.coredevice.i2c",
        "class": "I2CSwitch",
        "arguments": {"address": 0xe2}
    },
}

# master peripherals

device_db["ttl0"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLInOut",
    "arguments": {"channel": 0x000000},
}

device_db["ttl1"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLInOut",
    "arguments": {"channel": 0x000001},
}

device_db["ttl2"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLInOut",
    "arguments": {"channel": 0x000002},
}

device_db["ttl3"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLInOut",
    "arguments": {"channel": 0x000003},
}

device_db["ttl4"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000004},
}

device_db["ttl5"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000005},
}

device_db["ttl6"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000006},
}

device_db["ttl7"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000007},
}

device_db["ttl8"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000008},
}

device_db["ttl9"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000009},
}

device_db["ttl10"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00000a},
}

device_db["ttl11"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00000b},
}

device_db["ttl12"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00000c},
}

device_db["ttl13"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00000d},
}

device_db["ttl14"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00000e},
}

device_db["ttl15"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00000f},
}

device_db["ttl16"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000010},
}

device_db["ttl17"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000011},
}

device_db["ttl18"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000012},
}

device_db["ttl19"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000013},
}

device_db["ttl20"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000014},
}

device_db["ttl21"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000015},
}

device_db["ttl22"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000016},
}

device_db["ttl23"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000017},
}

device_db["ttl24"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000018},
}

device_db["ttl25"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000019},
}

device_db["ttl26"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00001a},
}

device_db["ttl27"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00001b},
}

device_db["ttl28"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00001c},
}

device_db["ttl29"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00001d},
}

device_db["ttl30"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00001e},
}

device_db["ttl31"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00001f},
}

device_db["ttl32"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000020},
}

device_db["ttl33"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000021},
}

device_db["ttl34"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000022},
}

device_db["ttl35"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000023},
}

device_db["ttl36"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000024},
}

device_db["ttl37"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000025},
}

device_db["ttl38"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000026},
}

device_db["ttl39"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000027},
}

device_db["spi_sampler0_adc"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x000028}
}
device_db["spi_sampler0_pgia"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x000029}
}
device_db["ttl_sampler0_cnv"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00002a},
}
device_db["sampler0"] = {
    "type": "local",
    "module": "artiq.coredevice.sampler",
    "class": "Sampler",
    "arguments": {
        "spi_adc_device": "spi_sampler0_adc",
        "spi_pgia_device": "spi_sampler0_pgia",
        "cnv_device": "ttl_sampler0_cnv",
        "hw_rev": "v2.2"
    }
}

device_db["spi_mirny0"]={
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x00002b}
}

device_db["ttl_mirny0_sw0"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00002c}
}

device_db["ttl_mirny0_sw1"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00002d}
}

device_db["ttl_mirny0_sw2"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00002e}
}

device_db["ttl_mirny0_sw3"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00002f}
}

device_db["mirny0_ch0"] = {
    "type": "local",
    "module": "artiq.coredevice.adf5356",
    "class": "ADF5356",
    "arguments": {
        "channel": 0,
        "sw_device": "ttl_mirny0_sw0",
        "cpld_device": "mirny0_cpld",
    }
}

device_db["mirny0_ch1"] = {
    "type": "local",
    "module": "artiq.coredevice.adf5356",
    "class": "ADF5356",
    "arguments": {
        "channel": 1,
        "sw_device": "ttl_mirny0_sw1",
        "cpld_device": "mirny0_cpld",
    }
}

device_db["mirny0_ch2"] = {
    "type": "local",
    "module": "artiq.coredevice.adf5356",
    "class": "ADF5356",
    "arguments": {
        "channel": 2,
        "sw_device": "ttl_mirny0_sw2",
        "cpld_device": "mirny0_cpld",
    }
}

device_db["mirny0_ch3"] = {
    "type": "local",
    "module": "artiq.coredevice.adf5356",
    "class": "ADF5356",
    "arguments": {
        "channel": 3,
        "sw_device": "ttl_mirny0_sw3",
        "cpld_device": "mirny0_cpld",
    }
}

device_db["mirny0_cpld"] = {
    "type": "local",
    "module": "artiq.coredevice.mirny",
    "class": "Mirny",
    "arguments": {
        "spi_device": "spi_mirny0",
        "refclk": 125000000.0,
        "clk_sel": 1
    },
}

device_db["fastino0"] = {
    "type": "local",
    "module": "artiq.coredevice.fastino",
    "class": "Fastino",
    "arguments": {"channel": 0x000030, "log2_width": 0}
}

device_db["ttl40"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000031},
}

device_db["ttl41"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000032},
}

device_db["ttl42"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000033},
}

device_db["ttl43"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000034},
}

device_db["ttl44"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000035},
}

device_db["ttl45"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000036},
}

device_db["ttl46"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000037},
}

device_db["ttl47"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000038},
}

device_db["led0"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x000039}
}

device_db["led1"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00003a}
}

device_db["led2"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x00003b}
}

# DEST#1 peripherals

device_db["core"]["arguments"]["satellite_cpu_targets"][1] = "rv32g"

device_db["suservo0_ch0"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010000, "servo_device": "suservo0"}
}

device_db["suservo0_ch1"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010001, "servo_device": "suservo0"}
}

device_db["suservo0_ch2"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010002, "servo_device": "suservo0"}
}

device_db["suservo0_ch3"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010003, "servo_device": "suservo0"}
}

device_db["suservo0_ch4"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010004, "servo_device": "suservo0"}
}

device_db["suservo0_ch5"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010005, "servo_device": "suservo0"}
}

device_db["suservo0_ch6"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010006, "servo_device": "suservo0"}
}

device_db["suservo0_ch7"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010007, "servo_device": "suservo0"}
}

device_db["suservo0"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "SUServo",
    "arguments": {
        "channel": 0x010008,
        "pgia_device": "spi_sampler1_pgia",
        "cpld_devices": ['urukul0_cpld', 'urukul1_cpld'],
        "dds_devices": ['urukul0_dds', 'urukul1_dds'],
        "sampler_hw_rev": "v2.2"
    }
}

device_db["spi_sampler1_pgia"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x010009}
}

device_db["spi_urukul0"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x01000a}
}
device_db["urukul0_cpld"] = {
    "type": "local",
    "module": "artiq.coredevice.urukul",
    "class": "CPLD",
    "arguments": {
        "spi_device": "spi_urukul0",
        "refclk": 125000000.0,
        "clk_sel": 2
    }
}
device_db["urukul0_dds"] = {
    "type": "local",
    "module": "artiq.coredevice.ad9910",
    "class": "AD9910",
    "arguments": {
        "pll_n": 32,
        "pll_en": 1,
        "chip_select": 3,
        "cpld_device": "urukul0_cpld"
    }
}

device_db["spi_urukul1"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x01000b}
}
device_db["urukul1_cpld"] = {
    "type": "local",
    "module": "artiq.coredevice.urukul",
    "class": "CPLD",
    "arguments": {
        "spi_device": "spi_urukul1",
        "refclk": 125000000.0,
        "clk_sel": 2
    }
}
device_db["urukul1_dds"] = {
    "type": "local",
    "module": "artiq.coredevice.ad9910",
    "class": "AD9910",
    "arguments": {
        "pll_n": 32,
        "pll_en": 1,
        "chip_select": 3,
        "cpld_device": "urukul1_cpld"
    }
}

device_db["suservo1_ch0"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x01000c, "servo_device": "suservo1"}
}

device_db["suservo1_ch1"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x01000d, "servo_device": "suservo1"}
}

device_db["suservo1_ch2"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x01000e, "servo_device": "suservo1"}
}

device_db["suservo1_ch3"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x01000f, "servo_device": "suservo1"}
}

device_db["suservo1_ch4"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010010, "servo_device": "suservo1"}
}

device_db["suservo1_ch5"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010011, "servo_device": "suservo1"}
}

device_db["suservo1_ch6"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010012, "servo_device": "suservo1"}
}

device_db["suservo1_ch7"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "Channel",
    "arguments": {"channel": 0x010013, "servo_device": "suservo1"}
}

device_db["suservo1"] = {
    "type": "local",
    "module": "artiq.coredevice.suservo",
    "class": "SUServo",
    "arguments": {
        "channel": 0x010014,
        "pgia_device": "spi_sampler2_pgia",
        "cpld_devices": ['urukul2_cpld', 'urukul3_cpld'],
        "dds_devices": ['urukul2_dds', 'urukul3_dds'],
        "sampler_hw_rev": "v2.2"
    }
}

device_db["spi_sampler2_pgia"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x010015}
}

device_db["spi_urukul2"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x010016}
}
device_db["urukul2_cpld"] = {
    "type": "local",
    "module": "artiq.coredevice.urukul",
    "class": "CPLD",
    "arguments": {
        "spi_device": "spi_urukul2",
        "refclk": 125000000.0,
        "clk_sel": 2
    }
}
device_db["urukul2_dds"] = {
    "type": "local",
    "module": "artiq.coredevice.ad9910",
    "class": "AD9910",
    "arguments": {
        "pll_n": 32,
        "pll_en": 1,
        "chip_select": 3,
        "cpld_device": "urukul2_cpld"
    }
}

device_db["spi_urukul3"] = {
    "type": "local",
    "module": "artiq.coredevice.spi2",
    "class": "SPIMaster",
    "arguments": {"channel": 0x010017}
}
device_db["urukul3_cpld"] = {
    "type": "local",
    "module": "artiq.coredevice.urukul",
    "class": "CPLD",
    "arguments": {
        "spi_device": "spi_urukul3",
        "refclk": 125000000.0,
        "clk_sel": 2
    }
}
device_db["urukul3_dds"] = {
    "type": "local",
    "module": "artiq.coredevice.ad9910",
    "class": "AD9910",
    "arguments": {
        "pll_n": 32,
        "pll_en": 1,
        "chip_select": 3,
        "cpld_device": "urukul3_cpld"
    }
}

device_db["led3"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x010018}
}

device_db["led4"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x010019}
}

device_db["led5"] = {
    "type": "local",
    "module": "artiq.coredevice.ttl",
    "class": "TTLOut",
    "arguments": {"channel": 0x01001a}
}
