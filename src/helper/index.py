# coding=utf-8

import requests
import os


def handler(event, context):
    url = os.environ['KEEP_WARM_FC_URL']
    method = os.environ['KEEP_WARM_FC_METHOD']
    res = requests.request(method, url)
    print(res.status_code)
