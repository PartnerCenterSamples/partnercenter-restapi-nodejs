# partnercenter-restapi-nodejs
Sample code calling the Partner Center APIs with Node.js


### global dependencies
- typescript

  ```shell
  npm install -g typescript
  ```

- typings:
  - This is the replacement project for the popular TSD & DefinatelyTyped project containing TypeScript type definitions. TSD is deprecated & at EOL, and this replaces it. For type definitions that are not written in the new format or in the Typings directory, typings can leverage old (*ambient*) type definitions by specifying the `--ambient` flag when searching & installing. You don't have to worry about this... this is taken care of already in the project... just install the typings

  ```shell
  $ npm install -g typings
  ```

### setup 

- get all modules used
  - This downloads all NPM modules used in this project.

  ```shell
  $ npm install
  ```

- rebuild & recompile everything
  - This downloads all type definitions using the *typings* utility & then compiles all TypeScript to JavaScript. Look in the `package.json` for the command that's actually run.

  ```shell
  npm run build
  ```

### usage

- run it

  ```shell
  $ node ./src/index.js
  ```

- add verbose logging

  ```shell
  $ npm start
  ```
