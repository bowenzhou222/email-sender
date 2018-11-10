## Demo
### Health check
```
curl -X GET \
  https://sitemind-email.herokuapp.com/health
```
### Send email
```
curl -X POST \
  https://sitemind-email.herokuapp.com/email \
  -H 'Content-Type: application/json' \
  -d '{
	"from": "some@email.com",
	"to": [
		{
			"email" :"target1@email.com"
		},
		{
			"email": "target2@email.com"
		}
	],
	"subject": "test email",
	"text": "Hi test email!"
}'
```

### Zipkin tracer
[http://siteminder-zipkin.herokuapp.com/zipkin/](http://siteminder-zipkin.herokuapp.com/zipkin/)


## env
- SENDGRID\_API\_KEY
- MAILGUN\_API\_KEY
- ZIPKIN\_ENDPOINT (optional)

## Run locally
- npm install
- npm run dev


## Build
- npm install
- npm run build


## Run buildpack
- npm install
- npm start

The build files are in `dist` folder. Running `node throng.js` will start serving the build files.


## Deploy to heroku
- heroku git:remote -a ${APP_NAME}
- git push heroku master


## Zipkin tracer (optional)
### Locally
```
curl -sSL https://zipkin.io/quickstart.sh | bash -s
java -jar zipkin.jar
```

### On heroku
- `curl -sSL https://zipkin.io/quickstart.sh | bash -s`
- Create a Procfile with:
	```
	web: java -jar -Dserver.port=$PORT zipkin.jar
	```
- Set memory limit:
`heroku config:add JAVA_OPTS='-Xmx512m -Xms384m -Xss512k -XX:+UseCompressedOops' --app ${APP_NAME}`
`heroku config:add java_opts='-Xmx512m -Xms384m -Xss512k -XX:+UseCompressedOops' --app ${APP_NAME}`
- `git:remote -a ${APP_NAME}`
- `git add .; git commit -m 'Zipkin tracer'; git push heroku master`