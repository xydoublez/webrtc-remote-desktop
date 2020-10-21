## WebRTC Remote Desktop

### Insipiration

The project is inspired from "WebRTC remote screen (https://github.com/rviscarra/webrtc-remote-screen)" by rviscarra. Thanks for such a lovely contribution @rviscarra.

### Dependencies

- [Go 1.12](https://golang.org/doc/install)
- If you want h264 support: libx264 (included in x264-go, you'll need a C compiler / assembler to build it)
- If you want VP8 support: libvpx

### Running the server

The server receives the following flags through the command line:

`--http.port` (Optional)

Specifies the port where the HTTP server should listen, by default the port 9000 is used.

`--stun.server` (Optional)

Allows to speficy a different [STUN](https://es.wikipedia.org/wiki/STUN) server, by default a Google STUN server is used.

Chrome 74+, Firefox 66+, Safari 12.x are supported. Older versions (within reason) should be supported as well but YMMV.
