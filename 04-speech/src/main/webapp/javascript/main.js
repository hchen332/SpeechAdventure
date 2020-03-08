/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function playButtonHandler() {
  // The play button is the canonical state, which changes via events.
  var playButton = document.getElementById('playbutton');

  playButton.addEventListener('click', function(e) {
    if (this.classList.contains('playing')) {
      playButton.dispatchEvent(new Event('pause'));
    } else {
      playButton.dispatchEvent(new Event('play'));
    }
  }, true);

  // Update the appearance when the state changes
  playButton.addEventListener('play', function(e) {
    this.classList.add('playing');
  });
  playButton.addEventListener('pause', function(e) {
    this.classList.remove('playing');
  });
})();


(function audioInit() {
  // Check for non Web Audio API browsers.
  if (!window.AudioContext) {
    alert("Web Audio isn't available in your browser.");
    return;
  }





  // per https://g.co/cloud/speech/reference/rest/v1beta1/RecognitionConfig
  const SAMPLE_RATE = 16000;
  const SAMPLE_SIZE = 16;

  var playButton = document.getElementById('playbutton');

  // Hook up the play/pause state to the microphone context
  var context = new AudioContext();
  playButton.addEventListener('pause', context.suspend.bind(context));
  playButton.addEventListener('play', context.resume.bind(context));

  // The first time you hit play, connect to the microphone
  playButton.addEventListener('play', function startRecording() {
    var audioPromise = navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        channelCount: 1,
        sampleRate: {
          ideal: SAMPLE_RATE
        },
        sampleSize: SAMPLE_SIZE
      }
    });

    audioPromise.then(function(micStream) {
      var microphone = context.createMediaStreamSource(micStream);
      analyser = context.createAnalyser();
      microphone.connect(analyser);
    }).catch(console.log.bind(console));

    initWebsocket(audioPromise);
  }, {once: true});


  /**
   * Hook up event handlers to create / destroy websockets, and audio nodes to
   * transmit audio bytes through it.
   */
  function initWebsocket(audioPromise) {
    var socket;
    var sourceNode;

    // Create a node that sends raw bytes across the websocket
    var scriptNode = context.createScriptProcessor(4096, 1, 1);
    // Need the maximum value for 16-bit signed samples, to convert from float.
    const MAX_INT = Math.pow(2, 16 - 1) - 1;
    scriptNode.addEventListener('audioprocess', function(e) {
      var floatSamples = e.inputBuffer.getChannelData(0);
      // The samples are floats in range [-1, 1]. Convert to 16-bit signed
      // integer.
      socket.send(Int16Array.from(floatSamples.map(function(n) {
        return n * MAX_INT;
      })));
    });

    function newWebsocket() {
      var websocketPromise = new Promise(function(resolve, reject) {
        var socket = new WebSocket('wss://' + location.host + '/transcribe');
        socket.addEventListener('open', resolve);
        socket.addEventListener('error', reject);
      });

      Promise.all([audioPromise, websocketPromise]).then(function(values) {
        var micStream = values[0];
        socket = values[1].target;

        // If the socket is closed for whatever reason, pause the mic
        socket.addEventListener('close', function(e) {
          console.log('Websocket closing..');
          playButton.dispatchEvent(new Event('pause'));
        });
        socket.addEventListener('error', function(e) {
          console.log('Error from websocket', e);
          playButton.dispatchEvent(new Event('pause'));
        });

        function startByteStream(e) {
          // Hook up the scriptNode to the mic
          sourceNode = context.createMediaStreamSource(micStream);
          sourceNode.connect(scriptNode);
          scriptNode.connect(context.destination);
        }

        // Send the initial configuration message. When the server acknowledges
        // it, start streaming the audio bytes to the server and listening for
        // transcriptions.
        socket.addEventListener('message', function(e) {
          socket.addEventListener('message', onTranscription);
          startByteStream(e);
        }, {once: true});

        socket.send(JSON.stringify({sampleRate: context.sampleRate}));

      }).catch(console.log.bind(console));
    }

    function closeWebsocket() {
      scriptNode.disconnect();
      if (sourceNode) sourceNode.disconnect();
      if (socket && socket.readyState === socket.OPEN) socket.close();
    }

    function toggleWebsocket(e) {
      var context = e.target;
      if (context.state === 'running') {
        newWebsocket();
      } else if (context.state === 'suspended') {
        closeWebsocket();
      }
    }

    var transcript = {
      el: document.getElementById('transcript').childNodes[0],
      current: document.createElement('div')
    };
    //transcript.el.appendChild(transcript.current);
    /**
     * This function is called with the transcription result from the server.
     */
    function onTranscription(e) {
      var result = JSON.parse(e.data);
      if (result.alternatives_) {
        transcript.current.innerHTML = result.alternatives_[0].transcript_;
      }
      if (result.isFinal_) {
        console.log($(transcript.current.innerHTML));
        //transcript.current = document.createElement('div');
        //transcript.el.appendChild(transcript.current);

      }
    }

    // When the mic is resumed or paused, change the state of the websocket too
    context.addEventListener('statechange', toggleWebsocket);
    // initialize for the current state
    toggleWebsocket({target: context});
  }
})();
 if(transcript.current.innerHTML == "Where")
 {
   fun1();
 }
 var KEY[] = ['right', 'left', 'ok']

    function fun1(){
    //if (document.getElementById(transcript.current) == KEY[]){
      document.getElementById("detective").innerHTML = "I was at the bar last night.";
      document.getElementById("nextQ").style.display = "";
      //KEY = arr[function(val){return ++val;}]);
      //}
    }
    function fun2(){
    if (document.getElementById(transcript.current) == KEY[]){
      document.getElementById("nextQ").style.display= "none";
      document.getElementById("Detective2").style.display = "";
      document.getElementById("detective").style.display="none";
      }
    }
    function fun(){
    if (document.getElementById(transcript.current) == KEY[]){
    document.getElementById("Detective2").innerHTML = "I was just exploring.";
    document.getElementById("nextQ1").style.display="";
      }
    }
    function fun3(){
    document.getElementById("nextQ1").style.display= "none";
    document.getElementById("Detective3").style.display = "";
    document.getElementById("Detective2").style.display="none";
    }
    function fun4(){
    document.getElementById("Detective3").innerHTML = "I was just going.";
    document.getElementById("nextQ2").style.display="";
    }

