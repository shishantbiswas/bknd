# Official `userbase` Docker image
The docker image intentially doesn't copy any data into the image for now, so you can copy the Dockerfile and build the image anywhere.

## Building the Docker image
To build the Docker image, run the following command:

```bash
docker build -t userbase .
```

## Running the Docker container
To run the Docker container, run the following command:

```bash
docker run -p 1337:1337 userbase
```

You can pass the same CLI arguments (see [Using the CLI](https://docs.userbase.io/cli) guide) to the docker container as you'd do with `npx userbase run`, like so:
    
```bash
docker run -p 1337:1337 -e ARGS="--db-url file:/data/data.db" userbase
```
Or connect to a remote turso database:
```bash
docker run -p 1337:1337 -e ARGS="--db-url libsql://<db>.turso.io --db-token <token>" userbase
```

To mount the data directory to the host, you can use the `-v` flag:
```bash
docker run -p 1337:1337 -v /path/to/data:/data userbase
```