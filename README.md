# nuzlooke-client

## Post Graduation Update

I was bumming off the goodwill and AWS billing of the professor in charge of my capstone.
Consequently, this project will have to be modified a bit in order to deal with the lack of free
access to Elastic Beanstalk.

I have 25G of forever free DynamoDB (for now at least)... which means I might move most
of the server code to the client since it was mainly used to talk to Dynamo, something the
client can easily do, and the real difficult stuff the server was doing is actually just bad design...

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm run serve
```

### Compiles and minifies for production

```bash
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
