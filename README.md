# WebSocket
###устанавливаем nvm
````bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
````

###устанавливаем node
````bash
nvm install 12
nvm use 12
````

###устанавливаем зависимости
````bash
npm install
````

###для запуска
#####если не стоит pm2
````bash
npm i pm2 -g
````
#####далее
````bash
npm run start
````
#####или
````bash
npm run compile
pm2 start pm2.json
````

###для мониторинга
````bash
pm2 list
pm2 monit
````

###для останова
````bash
pm2 stop 0
pm2 delete 0
pm2 kill
````
