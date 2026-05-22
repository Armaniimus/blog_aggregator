# CLI commands
- npm run start login <username>
- npm run start register
- npm run start reset
- npm run start users
- npm run start agg
- npm run start addfeed <name, url>
- npm run start feeds
- npm run start follow <url>
- npm run start following
- npm run start unfollow <url>


# dev commands
nvm use -> to initialise the correct node version
npm run start -> runs the cli


sudo service postgresql start -> to start the database required

sudo -u postgres psql -> to open db shell


# install sequence
ran npm init -y 
	-> to make a new npm project
ran npm install -D typescript @types/node tsx 
	-> to install typescript
added type:module to package json
	-> so imports can be used with the es module syntax
definded basePath in ./src/index.ts
	-> so files can be read relatively from the root of this project

install database with
	-> sudo apt update
	-> sudo apt install postgresql postgresql-contrib

check db version 
	-> psql --version

set db password with
	-> sudo passwd postgres

open db shell and ran 
	-> CREATE DATABASE gator;

connect with the db in shell
 -> \c gator

set db password with
	-> ALTER USER postgres PASSWORD 'example-db-userpass';

check version with
	-> SELECT version();