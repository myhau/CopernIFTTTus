from time import time
from threading import Timer

class Telegraph:

    def __init__(self, serial, mqttc, on_recv_msg):
        self.serial = serial
        self.mqttc = mqttc
        self.on_recv_msg = on_recv_msg
        mqttc.on_message = self.on_message
        self.actions = [{},{},{},{}]
        self.channel = 0
        self.clicks = -1
        #mqttc.subscribe(self.rcv_channel_name(), 0)

    def on_message(self, mqttc, obj, msg):
        print 'received message from topic ' + msg.topic
        if msg.topic != self.channel_name: return
        self.on_recv_msg(msg.payload)      

    def perform_action(self, action):
        print 'performing action ...'

    def set_action(self, click_num, channel, action):
        self.actions[channel][click_num] = action

    def change_channel(self, channel_num):
        if self.channel==channel_num: return
        print 'channel changed to ' + str(channel_num)
        self.channel = channel_num

    def timeout(self):
        print 'detected ' + str(self.clicks) + ' clicks'
        if self.actions[self.channel].has_key(self.clicks):
            self.perform_action(self.actions[self.channel].get(self.clicks))
        else: print 'no action'
        self.clicks = -1   


    def button_press(self):
        print 'press'
        if self.clicks==-1:
            self.last_press_time = time()
            self.clicks = 0
            t = Timer(1.5, self.timeout)
            t.start()
            print 'sequence detection started...'


    def button_release(self):
        print 'release'
        self.clicks+=1
        return 0

    def button_state(self, state):
        if(state): self.button_press()
        else: self.button_release()

    def channel_name(self):
        return 'channel/' + str(self.channel)
        
