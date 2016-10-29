#!/usr/bin/env python

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import socket
import json

from time import sleep
from pymouse import PyMouse
 
class WSHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print 'new connection'
      
    def on_message(self, message):
        m = PyMouse()
        data = json.loads(message)
        print data
        source = data['from']
        destination = data['to']
        offset = data['offset']
        
        m.click(source['x'] + offset, source['y'] + offset)
        sleep(0.1)
        m.click(destination['x'] + offset, destination['y'] + offset)
 
    def on_close(self):
        print 'connection closed'
 
    def check_origin(self, origin):
        return True
 
application = tornado.web.Application([
    (r'/ws', WSHandler),
])
 
 
if __name__ == "__main__":
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8888)
    print '*** Websocket Server Started at %s ***' % socket.gethostbyname(socket.gethostname())
    tornado.ioloop.IOLoop.instance().start()
