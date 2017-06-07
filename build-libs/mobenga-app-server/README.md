# App server

Host your single page application with pushstate enabled.

##install##

```bash
$ npm install -g mobenga-app-server
```

##usage##

```bash
$ app-server [options] <dir ...>
```

Show help with ``-h``

If parameters are omitted, app-server will host directory ``./`` on port 4000.

##example##

Host development build on port 4001

```bash
$ app-server -p 4001 builds/development
```

Access via browser

```
http://localhost:4001
```