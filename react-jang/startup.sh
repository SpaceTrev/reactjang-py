#!/bin/bash

docker exec -i reactjang_postgres1 psql -U postgres << EOF
create database reactjang;
create user reactjanguser with password 'mypassword';
grant all privileges on database reactjang to reactjanguser;
EOF
