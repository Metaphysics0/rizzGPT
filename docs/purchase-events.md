## Purchase Events

For developing:

1. use [localtunnel](https://github.com/localtunnel/localtunnel) to forward your localhost to a domain (run `lt --port 5173`)
2. Add the forwarded `.lt` domain to viteConfig allowedHosts array AND in svelte.config.js
3. in Gumroad, set the ping url to be the localtunnel domain.
4. check that the `api/webhooks/gumroad` are receiving requests on test
