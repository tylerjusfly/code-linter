## How TO Test

```
Sending request to the server

socket.emit('send_code', { code: gen_code, lang: 'py' })
```

```
Listen on here to get response

socket.on('get_markers', (data) => {
      console.log('response', data.results)
    })

```

### server Requirement
<!-- This has been met in the dockerfile -->
- PIP
- PyLint

## Building with Docker

```
docker build -t linters .
```

```
docker run -p 4002:4002 <IMAGEID>
```
