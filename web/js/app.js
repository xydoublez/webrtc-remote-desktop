function showError(error) {
  const errorNode = document.querySelector("#error");
  if (errorNode.firstChild) {
    errorNode.removeChild(errorNode.firstChild);
  }
  errorNode.appendChild(document.createTextNode(error.message || error));
}

function loadScreens() {
  return fetch("/api/screens", {
    method: "GET",
    headers: {
      Accepts: "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch(showError);
}

function startSession(offer, screen) {
  return fetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      offer,
      screen,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((msg) => {
      return msg.answer;
    });
}

function createOffer(pc, { audio, video }) {
  return new Promise((accept, reject) => {
    pc.onicecandidate = (evt) => {
      if (!evt.candidate) {
        // ICE Gathering finished
        const { sdp: offer } = pc.localDescription;
        accept(offer);
      }
    };
    pc.createOffer({
      offerToReceiveAudio: audio,
      offerToReceiveVideo: video,
    })
      .then((ld) => {
        pc.setLocalDescription(ld);
      })
      .catch(reject);
  });
}

function enableMouseEvents(dataChannel) {
  // Start sending mouse cordinates on mouse move in canvas
  const remoteCanvas = document.getElementById("remote-canvas");

  // On Mouse move
  remoteCanvas.addEventListener("mousemove", (event) => {
    // Get cordinates
    const cordinates = scaleCordinatesToOriginalScreen(event);

    // Send cordinates
    dataChannel.send(
      JSON.stringify({
        command: "mousemove",
        data: {
          x: cordinates.x,
          y: cordinates.y,
        },
      })
    );
  });

  // On Mouse Click
  remoteCanvas.addEventListener("click", (event) => {
    dataChannel.send(
      JSON.stringify({
        command: "click",
      })
    );
  });

  // On Mouse Double Click
  remoteCanvas.addEventListener("dblclick", (event) => {
    dataChannel.send(
      JSON.stringify({
        command: "dblclick",
      })
    );
  });

  // Read keyboard events
  document.addEventListener("keydown", (event) => {
    console.log(event.keyCode);
    dataChannel.send(
      JSON.stringify({
        command: "keydown",
        data: {
          keyCode: event.keyCode,
        },
      })
    );
  });
}

let resolutionMap = {
  screenWidth: 0,
  screenHeight: 0,
  canvasWidth: 0,
  canvasHeight: 0,
};

function scaleCordinatesToOriginalScreen(event) {
  const remoteCanvas = document.getElementById("remote-canvas");
  // Get canvas size
  const rect = remoteCanvas.getBoundingClientRect();
  // Get mouse cordinates on canvas
  const x = (event.clientX - rect.left).toFixed(0);
  const y = (event.clientY - rect.top).toFixed(0);
  // Calculate screen percentage based on canvas
  const xPer = (x / resolutionMap.canvasWidth) * 100;
  const yPer = (y / resolutionMap.canvasHeight) * 100;
  // Map percentage to original screen
  return {
    x: ((resolutionMap.screenWidth * xPer) / 100).toFixed(0),
    y: ((resolutionMap.screenHeight * yPer) / 100).toFixed(0),
  };
}

function startRemoteSession(screen, remoteVideoNode, stream) {
  let pc;

  return Promise.resolve()
    .then(() => {
      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      const dataChannel = pc.createDataChannel("messages");

      dataChannel.onopen = function (event) {
        enableMouseEvents(dataChannel);

        // Fetch screen size from server
        dataChannel.send(
          JSON.stringify({
            command: "screensize",
          })
        );
      };

      dataChannel.onmessage = function (event) {
        try {
          const message = JSON.parse(event.data);
          switch (message.command) {
            case "screensize":
              resolutionMap.screenHeight = message.data.height;
              resolutionMap.screenWidth = message.data.width;
              break;

            case "mousepose":
              console.log(message);
              break;
          }
        } catch (e) {
          console.error(e);
        }
      };

      pc.ontrack = (evt) => {
        remoteVideoNode.srcObject = evt.streams[0];
        remoteVideoNode.play();
      };

      stream &&
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

      return createOffer(pc, { audio: false, video: true });
    })
    .then((offer) => {
      return startSession(offer, screen);
    })
    .then((answer) => {
      return pc.setRemoteDescription(
        new RTCSessionDescription({
          sdp: answer,
          type: "answer",
        })
      );
    })
    .then(() => pc);
}

function resizeCanvas(canvas, video) {
  const w = video.offsetWidth;
  const h = video.offsetHeight;
  canvas.width = w;
  canvas.height = h;

  resolutionMap.canvasHeight = h;
  resolutionMap.canvasWidth = w;
}

let peerConnection = null;
document.addEventListener("DOMContentLoaded", () => {
  let selectedScreen = 0;
  const remoteVideo = document.querySelector("#remote-video");
  const remoteCanvas = document.querySelector("#remote-canvas");
  const startStop = document.querySelector("#start-stop");

  remoteVideo.onplaying = () => {
    setInterval(() => {
      resizeCanvas(remoteCanvas, remoteVideo);
    }, 1000);
  };

  const enableStartStop = (enabled) => {
    if (enabled) {
      startStop.removeAttribute("disabled");
    } else {
      startStop.setAttribute("disabled", "");
    }
  };

  const setStartStopTitle = (title) => {
    startStop.removeChild(startStop.firstChild);
    startStop.appendChild(document.createTextNode(title));
  };

  startStop.addEventListener("click", () => {
    enableStartStop(false);

    const userMediaPromise =
      adapter.browserDetails.browser === "safari"
        ? navigator.mediaDevices.getUserMedia({ video: true })
        : Promise.resolve(null);
    if (!peerConnection) {
      userMediaPromise.then((stream) => {
        return startRemoteSession(selectedScreen, remoteVideo, stream)
          .then((pc) => {
            remoteVideo.style.setProperty("visibility", "visible");
            peerConnection = pc;
          })
          .catch(showError)
          .then(() => {
            enableStartStop(true);
            setStartStopTitle("Stop");
          });
      });
    } else {
      peerConnection.close();
      peerConnection = null;
      enableStartStop(true);
      setStartStopTitle("Start");
      remoteVideo.style.setProperty("visibility", "collapse");
    }
  });
});

window.addEventListener("beforeunload", () => {
  if (peerConnection) {
    peerConnection.close();
  }
});
