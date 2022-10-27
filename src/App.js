import logo from './logo.svg';
// import './App.css';
import React from 'react';
import { sdpFilterCodec } from './utils';
import {Col, Row} from 'antd'
import 'antd/dist/antd.css';


class MyApp extends React.Component {
  constructor(props) {
    super(props);
    this.localVideoRef = React.createRef()
    this.remoteVideoRef = React.createRef()
    this.state = {}
    console.log('cons')
  }
  componentDidMount() {
    console.log('mount')
    this.start()
  }

  async start() {
    this.pc = this.createPeerConnection();
    var pc = this.pc
    var constraints = {
      audio: false,
      video: true
    }
    var stream = await navigator.mediaDevices.getUserMedia(constraints)
    this.localVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => {
      console.log('add local track')
      pc.addTrack(track, stream);
    })
    try {
      this.negotiate(pc);
    } catch (e) {
      alert('Could not acquire media: ' + e);
    }
  }

  async playVideoFromCamera() {
    try {
      const constraints = { 'video': true, 'audio': true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.remoteVideoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error opening video camera.', error);
    }

  }
  async negotiate(pc) {
    var offer = await pc.createOffer()
    await pc.setLocalDescription(offer);
    await new Promise(function (resolve) {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      } else {
        function checkState() {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        }
        pc.addEventListener('icegatheringstatechange', checkState);
      }
    });

    var codec;
    var offer = pc.localDescription

    codec = 'default'
    // offer.sdp = sdpFilterCodec('video', codec, offer.sdp);
    var response = await fetch('http://localhost:8080/offer', {
      body: JSON.stringify({
        sdp: offer.sdp,
        type: offer.type,
        video_transform: 'rotate'
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      // mode: 'no-cors'
    });
    var answer = await response.json();
    console.log(answer);
    await pc.setRemoteDescription(answer);
  }

  createPeerConnection() {
    var config = {
      sdpSemantics: 'unified-plan'
    };

    var pc = new RTCPeerConnection(config);

    // connect audio / video
    pc.addEventListener('track', (evt) => {
      if (evt.track.kind == 'video') {
        console.log(evt);
        this.remoteVideoRef.current.srcObject = evt.streams[0];
      }
      else
        ;
      // document.getElementById('audio').srcObject = evt.streams[0];
    });
    return pc;
  }

  render() {
    return (
      <div>
          <Row>
            <Col span={8} offset={4}>
              <video id="localVideo" autoPlay playsInline controls={true} ref={this.localVideoRef}></video>
            </Col>
            <Col span={8}>
              <video id="remoteVideo" autoPlay playsInline controls={true} ref={this.remoteVideoRef}></video>
            </Col>
          </Row>
      </div>
    );

  }
}

export default MyApp;
