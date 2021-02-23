# stub solution for 'Hot & Cold'
# seedubjay.com/interactive-problems

"""
DO NOT TOUCH THIS BIT

"""
from urllib.request import urlopen
from urllib.parse import quote
from urllib.error import HTTPError
import ssl
import time
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

ENDPOINT_URL = 'https://api.seedubjay.com/problems/hotter'
session_id = None

def establish_session(name):
    global session_id
    assert session_id is None, 'establish_session should only be called once'

    resp = urlopen(ENDPOINT_URL + '/hello/%s' % (quote(name)), context=ctx)
    assert resp.getcode() == 200, 'error during establish_connection...'

    session_id = resp.read().decode('utf8')
    print('Session established:', session_id)

def send_guess(guess):
    global session_id
    assert session_id is not None, 'establish_session has not been called' 

    try:
        resp = urlopen(ENDPOINT_URL + '/guess/%s/%s' % (session_id, guess), context=ctx)
    except HTTPError as err:
        reason = err.read().decode('utf8') if err.code == 400 else err.reason
        print('%s, %s' % (err.code, reason))
        sys.exit(1)
    time.sleep(.5) # please don't kill my server

    resp_text = resp.read().decode('utf8')
    print('Guess made:', guess, '->', resp_text)
    return resp_text



    
"""
IMPLEMENT YOUR SOLUTION HERE

"""

# this must be called before anything else
# (try not to change your name too much to avoid filling up the scoreboard)
NAME = 'YOUR_NAME_HERE'
establish_session(NAME)

# now make queries until you find the answer

# for instance, you could try every number starting from 1...
for i in range(1,105):
    response = send_guess(i)

    if response == 'FOUND':
        print('found', i)
        break
    elif response == 'HOTTER':
        pass
    elif response == 'COLDER':
        pass
    else: # response == 'SAME'
        pass
