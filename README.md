# OpenTelemetry JS Timestamp Bug Reproduction

Steps to reproduce:

- Open Chrome and wait ~24 hours or longer without closing it
- Start app: `npm start`
- Open http://localhost:3000 and look at the DevTools console

The result is that the recorded span has an incorrect timestamp.
