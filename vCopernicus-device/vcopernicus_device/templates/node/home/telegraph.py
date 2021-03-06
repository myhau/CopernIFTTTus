from time import time
from threading import Timer
import json
import requests

class Telegraph:

    def __init__(self, serial, mqttc, on_recv_msg):
        self.serial = serial
        self.mqttc = mqttc
        self.on_recv_msg = on_recv_msg
        mqttc.on_message = self.on_message
        mqttc.subscribe("actions/1567231", 0)
        self.actions = [{},{},{},{}]
        self.channel = 0
        self.clicks = -1
        #mqttc.subscribe(self.rcv_channel_name(), 0)

    def on_message(self, mqttc, obj, msg):
        print 'received message from topic ' + msg.topic
        if msg.topic=='actions/1567231':
            print 'payload: ' + msg.payload
            body = json.loads(msg.payload)
            self.actions = [{},{},{},{}]
            for item in body:
                self.set_action(item[u'click'], item[u'channel']-1, {'event': item[u'eventName'], 'data': item[u'customData']})

    def perform_action(self, action):
        print 'performing action ...'
        json_body = {'value1': action['data']}
        print 'body: ' + str(json_body)
        url = 'https://maker.ifttt.com/trigger/{}/with/key/{{key}}'.format(action['event'])
        print 'url: ' + url
        r = requests.post(url, json=json_body)
        print 'response: ' + str(r.status_code)

    def set_action(self, click_num, channel, action):
        self.actions[channel][click_num] = action
        print 'action set for: ' + str(click_num) + ' clicks on channel ' + \
        str(channel) + ' action: ' + str(action)

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

    def next_channel(self):
        self.change_channel((self.channel+1)%4)
        return self.channel

    def button_state(self, state):
        if(state): self.button_press()
        else: self.button_release()

    def channel_name(self):
        return 'channel/' + str(self.channel)
        
