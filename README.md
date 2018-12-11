# Serverless Demo

Make sure your AWS keys are configured on your local machine in `~/.aws/crdentials`
Make sure you run `npm install` to have the packages installed

## Serverless Commands

### List available functions

```
./node_modules/.bin/sls deploy list functions
```

### See a list of all the running functions for a particular stage (e.g. prod)

```
./node_modules/.bin/sls deploy list functions --stage prod
```

### Deploy a single function (e.g. HelloWorld) to a particular stage (e.g. prod)

```
./node_modules/.bin/sls deploy function -f HelloWorld --stage prod
```

### Deploy all functions to a particular stage (e.g. prod)

```
./node_modules/.bin/sls deploy --stage prod
```

### Invoke a function (e.g. HelloWorld) locally with some data

```
./node_modules/.bin/sls invoke local -f HelloWorld --data '{"foo": "bar"}'
```
