# afrostream-admin

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 2.1.1.

## Getting Started

install bower, grunt  

npm run dev  
npm run staging  

# Howto run (dev)

to run in dev env with the data of staging, you should run afrostream-backend using :
```
npm run staging
```

and you should run afrostream-admin using :

```
grunt build && sleep 1 && npm run localstaging
```

# TODO

- refactor afrostream-request
  passing request as arguments of request => NODE_DEBUG=http <= dies in Maximum call stack size exceed...
- rename 

- renommer tout ce qui est factory "factory" , service "service", etc...
   (actuellement .service peut contenir des factory, etc)
- add eslint

eventuellement:
- passer sur une autre techno, ex: react + redux pour être iso front
  en réutilisant les templates, et une partie du code


# history

removing jade :

```
find . -name "*.jade" | xargs -n 1 pug -P
find . -name "*.jade" | xargs rm
```

removing less :

```
lessc --include-path=.:../components:../../client/bower_components app.less > app.css
```
