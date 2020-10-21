## WebRTC Remote Desktop

WebRTC Remote Desktop allows you to control the computers remotely (like any other RDP softwares) using WebRTC from modern browsers. The backend is a pure GO implmentation using Pion WebRTC.

<hr>

### Insipiration

The project is inspired from "WebRTC remote screen (https://github.com/rviscarra/webrtc-remote-screen)". Thanks for such a lovely contribution <a href="https://github.com/rviscarra">Rafael Viscarra</a>.

<hr>

### Dependencies

- [Go 1.12](https://golang.org/doc/install)
- If you want h264 support: libx264 (included in x264-go, you'll need a C compiler / assembler to build it)
- If you want VP8 support: libvpx

<hr>

### Running in development mode

```
git clone https://github.com/imtiyazs/webrtc-remote-desktop.git
cd webrtc-remote-desktop
go mod tidy
go run -tags "h264enc" cmd/agent.go
```

Open https://localhost:9000 in the browser

Optional Params:
* ```--http.port=8888```
* ```--stun.server=stun:stun.l.google.com:19302```

- For H264 stream: "h264enc"
- For VP8 stream: "vp8enc"

<hr>

### Building for production
Build the _deployment_ package by runnning `make`. This should create a tar file with the 
binary and web directory, by default only support for h264 is included, if you want to use VP8 run `make encoders=vp8`, if you want both then `make encoders=vp8,h264`.

Copy the archive to a remote server, decompress it and run `./agent`. The `agent` application assumes the web dir. is in the same directory. 

WebRTC requires a _secure_ domain to work, the recommended approach towards this is to forward the agent port thru SSH tunneling:

```bash
ssh -L YOUR_LOCAL_PORT:localhost:9000 
```

Then access the application on `https://localhost:YOUR_LOCAL_PORT`, localhost should be considered 
secure by modern browsers.

* <b>TIP: For production, you need to write your own gateway server to communicate with the computers behind the NAT else assign a public ip and open up the TCP ports.</b>

<hr>

### Contributing
Amazing people responsible for making this possible:
* <a href="https://github.com/rviscarra">Rafael Viscarra</a>
* <a href="https://github.com/pion/webrtc">Pion WebRTC</a>

<hr>

### License

MIT - see [LICENSE](LICENSE) for the full text.
