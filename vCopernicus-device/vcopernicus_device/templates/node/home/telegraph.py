from time import time


class Telegraph:

    def __init__(self, serial):
        self.serial = serial
        self.rcv_channel = 0
        self.snd_channel = 0
        self.last_press_time = 0
        self.knob_mode = 1           # 1 - receiving channel, 2 - sending channel

    def send_msg(self, state, channel):
        pass

    def generate_impulse(self, state, channel):
        self.send_msg(state, channel)
        print 'impulse generated: ' + str(state)

    def button_press(self):
        self.last_press_time = time()

    def button_release(self):
        time_diff = time() - self.last_press_time
        impulse = int(time_diff>0.18)
        self.generate_impulse(impulse, self.snd_channel)
        return impulse

    def button_state(self, state):
        if(state): self.button_press()
        else: self.button_release()

    def recv_channel_mode(self):
        return self.knob_mode==1

    def snd_channel_mode(self):
        return self.knob_mode==2

    def set_rcv_channel(self, num):
        if num != self.rcv_channel:
            print 'receive channel changed to ' + str(num)
        self.rcv_channel = num

    def set_snd_channel(self, num):
        if num != self.snd_channel:
            print 'send channel changed to ' + str(num)
        self.snd_channel = num

    def set_channel(self, num):
        if self.recv_channel_mode():
            self.set_rcv_channel(num)
        elif self.snd_channel_mode():
            self.set_snd_channel(num)

    def change_knob_mode(self):
        self.knob_mode = self.knob_mode%2 + 1
        print 'knob mode changed to ' + str(self.knob_mode)
        return self.knob_mode
        
