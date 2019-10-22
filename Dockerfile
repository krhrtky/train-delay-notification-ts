FROM amazonlinux:2

ENV APP_DIR=/app

RUN mkdir $APP_DIR

RUN yum update -y
RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN  yum install nodejs -y


