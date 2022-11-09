# React WebRTC Python Demo

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install

Frontend:

```
git clone https://github.com/silverbulletmdc/py_webrtc_react_video_demo
cd py_webrtc_react_video_demo
cnpm install
```

Backend:

```
# Using python3
pip install aiohttp aiohttp_cors aiortc opencv-python
```

## Quick Start

1. Open backend
```
python server.py
```

2. Open frontend
```
cnpm start
```

Then you can visit http://localhost:3000


## Deploy in a remote server
Chrome requires `https` protocol to get the webcam permission.
You should configure https in your deploy server.
Then you can change line 74 in `App.js` to the address of the backend. 
