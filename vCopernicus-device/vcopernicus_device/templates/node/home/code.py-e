#!/usr/bin/env python

# ----- BEGIN INITIALIZATION -----
import os
from serial import Serial
from time import time
from telegraph import Telegraph

BASE_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
SERIAL_PATH = os.path.join(BASE_DIR, 'dev', 'ttyS0')

serial = Serial(SERIAL_PATH, 38400)
# ----- END INITIALIZATION -----

def ser_write(num):
    serial.write(chr(num))

def set_led1(state):
    ser_write(32+state)

def set_led2(knob_mode):       # black for 1, red for 2
    ser_write(64+48*(knob_mode-1))

def get_channel_num(knob_pos):
    return knob_pos / 16

def is_value_of_ambient_light(resp):
    return 0 <= resp < 64

def is_knob_position(resp):
    return 64 <= resp < 128

def is_temperature(resp):
    return 128 <= resp < 192

def is_state_of_button(resp, btn_num):
    return 128 + 64 + 2*btn_num + resp%2 == resp

def button_pressed(resp, btn_num):
    return 128 + 64 + 2*btn_num + 1 == resp

def get_knob_pos(resp):
    return resp - 64

def set_channel_num(resp):
    global tel
    knob_pos = get_knob_pos(resp)
    chn_num = get_channel_num(knob_pos)
    tel.set_channel(chn_num)

tel = Telegraph(serial)
serial.write(chr(128+32+16+8+4+1))

while True:
    cc = serial.read(1)
    if len(cc)>0:
            resp = ord(cc)
            #print resp
            if is_state_of_button(resp, 1):
                btn_state = button_pressed(resp, 1)
                if btn_state:
                    tel.button_press()
                else:
                    impulse = tel.button_release()
                    set_led1(impulse)
            elif is_state_of_button(resp, 2):
                if button_pressed(resp, 2):
                    mode = tel.change_knob_mode()
                    set_led2(mode)

            elif is_knob_position(resp):
                set_channel_num(resp)


                