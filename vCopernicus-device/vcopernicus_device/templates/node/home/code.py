#!/usr/bin/env python

# ----- BEGIN INITIALIZATION -----
import os
from serial import Serial

BASE_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SERIAL_PATH = os.path.join(BASE_DIR, 'dev', 'ttyS0')

serial = Serial(SERIAL_PATH, 38400)
# ----- END INITIALIZATION ----- 

'''
serial.write(chr(128 + 4))

while True:
    knob = ord(serial.read(1)) - 64
    if 0 <= knob < 64:
        servo = knob / 2
        serial.write(chr(servo))
	print str(knob)'''

serial.write(chr(128+32+16+8+4+1))

while True:
        cc = serial.read(1)
        if len(cc)>0:
                ch = ord(cc)
                print ch
                if ch==128+64+2+1:
                    serial.write(chr(32+1))
                elif ch==128+64+2:
                    serial.write(chr(32))
                elif ch==128+64+4+1:
                    serial.write(chr(64+32+8+2))
                elif ch==128+64+4:
                    serial.write(chr(64))
                elif ch>=64 and ch<128:
                	serial.write(chr((ch-64)/2))
                	serial.write(chr(64+16*((ch-64)/16)+4*(ch%4)))
