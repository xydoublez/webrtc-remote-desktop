## WebRTC Remote Desktop

WebRTC Remote Desktop allows you to control the computers remotely (like any other RDP softwares) using WebRTC. The backend is a pure GO implmentation using Pion WebRTC.

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
Optional Params:
* ```--http.port=8888```
* ```--stun.server=stun:stun.l.google.com:19302

- For H264 stream: "h264enc"
- For VP8 stream: "vp8enc"

<hr>

### Contributing
Amazing people responsible for making this possible:
* <a href="https://github.com/rviscarra">Rafael Viscarra</a>
* <a href="https://github.com/pion/webrtc">Pion WebRTC</a>

<hr>

### License

MIT - see [LICENSE](LICENSE) for the full text.
