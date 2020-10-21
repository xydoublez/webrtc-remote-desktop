## WebRTC Remote Desktop

### A pure GO implementation of remote desktop using WebRTC. 

#### Insipiration

The project is inspired from "WebRTC remote screen (https://github.com/rviscarra/webrtc-remote-screen)" by rviscarra. Thanks for such a lovely contribution @rviscarra.

#### Dependencies

- [Go 1.12](https://golang.org/doc/install)
- If you want h264 support: libx264 (included in x264-go, you'll need a C compiler / assembler to build it)
- If you want VP8 support: libvpx

#### Running in development mode

```
git clone https://github.com/imtiyazs/webrtc-remote-desktop.git
cd webrtc-remote-desktop
go mod tidy
go run -tags "h264enc" cmd/agent.go
```

- For H264 stream: "h264enc"
- For VP8 stream: "vp8enc"
