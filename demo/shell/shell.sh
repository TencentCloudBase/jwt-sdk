#!/bin/bash

## How to use
## export DOMAIN_NAME=chatroom.pai.tcloudbase.com && ./shell.sh

beginTime=$(date +%s)

echo "================begin domain name================"
echo $DOMAIN_NAME

# install nvm and node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install 10

# install pm2
npm i -g --registry=http://mirrors.cloud.tencent.com/npm/ pm2

# install nginx
echo yes | yum remove nginx
echo yes | sudo yum install nginx

# add root folder for nginx static sites
sudo rm -rf /data/h5
sudo mkdir /data/h5
sudo rm -rf /data/logs
sudo mkdir /data/logs
echo "Hello TCB Users!" > /data/h5/index.html

# add nginx conf
rm -rf /etc/nginx/conf.d/default.conf
cat << EOF > /etc/nginx/conf.d/default.conf

log_format tcb  '{"remote_ip":"\$remote_addr","time_local":"\$time_local","request":"\$request","status":"\$status","referer":"\$http_referer","user_agent":"\$http_user_agent","response_time":"\$request_time","body_sent":"\$body_bytes_sent"}';

server {
    listen 80;
    server_name $DOMAIN_NAME;

    return 301 https://\$host\$request_uri;
}

server {
    listen 443 http2 ssl;
    listen [::]:443 http2 ssl;

    server_name $DOMAIN_NAME;

    ssl on;
    ssl_certificate /data/ssl/ssl.crt;
    ssl_certificate_key /data/ssl/ssl.key;
    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_prefer_server_ciphers on;

    access_log /data/logs/access.log tcb;
    error_log /data/logs/error.log;

    location / {
        proxy_pass http://0.0.0.0:3000;
        proxy_redirect off;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /h5 {
        alias /data/h5/;
        index index.html index.htm;
    }
}
EOF

# start nginx
sudo systemctl start nginx.service
sudo systemctl status nginx.service
sudo systemctl enable nginx.service

# count time
endTime=$(date +%s)
echo 'Total Time Spent: '$((endTime-beginTime))'s'
