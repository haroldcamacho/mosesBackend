FROM ubuntu:20.04
WORKDIR /root

#MOSES DEPENDENCIES

RUN apt-get update && \
DEBIAN_FRONTEND=noninteractive \ 
 apt-get install -y \
   g++ \
   git \
   subversion \
   automake \
   libtool \
   zlib1g-dev \
   libicu-dev \
   libboost-all-dev \
   libbz2-dev \
   liblzma-dev \
   python-dev \
   graphviz \
   imagemagick \
   make \
   cmake \
   libgoogle-perftools-dev \
   autoconf \
   libcurl4-openssl-dev \
   libxmlrpc-c++8v5 \
   libxmlrpc-core-c3 \
   xmlrpc-api-utils \
   wget \
   screen \
   doxygen

#BOOST
RUN wget https://sourceforge.net/projects/boost/files/boost/1.72.0/boost_1_72_0.tar.gz/download -O boost_1_72_0.tar.gz \
&& tar zxvf boost_1_72_0.tar.gz \
&& cd boost_1_72_0 \
&& ./bootstrap.sh \
&& ./b2 -j4 --prefix=$PWD --libdir=$PWD/lib64 --layout=system link=static install || echo FAILURE


#CMPH 2.0
WORKDIR /root
RUN wget http://downloads.sourceforge.net/project/cmph/cmph/cmph-2.0.tar.gz -O cmph-2.0.tar.gz \
&& tar zxvf cmph-2.0.tar.gz \
&& cd cmph-2.0 \
&& ./configure \
&& make \
&& make install

#XMLRPC IF APT INSTALL DOESNT WORK
# WORKDIR /downloads
# RUN wget https://sourceforge.net/projects/xmlrpc-c/files/Xmlrpc-c%20Super%20Stable/1.33.17/xmlrpc-c-1.33.17.tgz/download \
# && tar zxvf xmlrpc-c-1.33.17.tgz \
# && cd xmlrpc-c-1.33.17 \


#Download moses and set maximum phrase size to 20 instead of 7 (default)
WORKDIR /root
RUN git clone https://github.com/moses-smt/mosesdecoder \
&& cd mosesdecoder/scripts/training \
&& sed -i 's/my $___MAX_PHRASE_LENGTH = "7";/my $___MAX_PHRASE_LENGTH = "20";/g' train-model.perl


#  Giza
WORKDIR /root
RUN  git clone https://github.com/moses-smt/giza-pp.git \
&& cd giza-pp \
&& make 

# Download training corpus
WORKDIR /root/pharoProjectsNewModels
RUN wget "https://drive.google.com/uc?export=download&id=1LmvpSKtqnQD-k_DtVQ91sDlh-3RsDfni" -O pharoCorpus.tar.xz  \
&& tar xvf pharoCorpus.tar.xz 

#Copy giza into moses
WORKDIR /root/mosesdecoder 
RUN mkdir tools \
&& cp /root/giza-pp/GIZA++-v2/GIZA++ /root/giza-pp/GIZA++-v2/snt2cooc.out \
   /root/giza-pp/mkcls-v2/mkcls tools


#Setup node


RUN apt-get update && apt-get install -y \
    software-properties-common \
    npm
RUN npm install npm@latest -g && \
    npm install n -g && \
    n latest

WORKDIR /root/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3000

EXPOSE 3000

#Setup for moses compilation
WORKDIR /root/mosesdecoder 