# MOSES backend

This project contains the necessary files to setup a moses backend environment for a server

### Installation

First pull the Docker image 

```bash
$ docker pull haroldcj/moses-compiled:pharoMoses
```

Build the image

```bash
$ docker run -it -p 3000:3000 haroldcj/moses-compiled:pharoMoses
```

Then start moses with the script 

```bash
$ sh startMosesMachines.sh
```
If necessary restart moses with the script

```bash
$ sh restartMoses.sh
```