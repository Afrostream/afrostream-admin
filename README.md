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

- remplacer les templates jade par du html
- clean les css pour avoir 1 seul fichier
- supprimer grunt, en ayant une simple page qui charge l'ensemble des js
  => pas de compilation => pas de difficulté a debugger / reload / etc
    (actuellement le hot reload fonctionne super mal, obligé de rebuilder ...)
- renommer tout ce qui est factory "factory" , service "service", etc...
   (actuellement .service peut contenir des factory, etc)
- ajouter un eslint

eventuellement:
- passer sur une autre techno, ex: react + redux pour être iso front
  en réutilisant les templates, et une partie du code
