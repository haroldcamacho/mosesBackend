# MOSES backend

This project contains the necessary files to setup a moses backend environment for a server

### Installation

First pull the Docker image 

```bash
$ docker pull haroldcj/mosesBackend
```

Build the image

```bash
$ docker run -it -p 5000:5000 haroldcj/mosesBackend
```

Then compile moses 

```bash
$ ./bjam --with-boost=/home/moses/Downloads/boost_1_60_0 --with-cmph=/home/moses/cmph-2.0 --with-irstlm=/home/moses/irstlm -j12
```
