---
layout: index
---

**NOTE: This project, while exciting, is still an early prototype. It is mostly stable but is being iterated with feature changes and improvements quite quickly.**

Sane - A Javascript fullstack and cli that uses two of the best frameworks, [Sails](http://sailsjs.org/) and [Ember](http://emberjs.com/), so you can rapidly create production-ready web applications. It takes away all the complications of setting up the backend and frontend environment, embracing convention-over-configuration, so you can focus just on shipping your app. Additionally this cli supports Docker, using [fig](http://www.fig.sh/), to automatically install dependencies such as your database and making deployment easy.

##Quickstart
* `npm install -g sails ember-cli sane-cli`
* `sane new project` creates a local project with [sails-disk](https://github.com/balderdashy/sails-disk). To install with [Docker](https://www.docker.com/) and production databases see [Options](#options).
* `sane generate resource user name:string age:number` to generate a new API on the backend and models on the frontend
* `sane up` to start the sails container/server as well as the ember dev server.
* You are good to go.


## Overview of the cli

* It creates a sane folder structure so you can develop server and client seperately, but they integrate smoothly
* Sets up a [SailsJS Container](https://github.com/artificialio/docker-sails), with a database of choice (sails-disk, mongoDB, MySQL or Postgres) using [Fig](https://github.com/artificialio/docker-sails) to provide an isolated development environment that can be used in production
* Using the latest [ember-cli](https://github.com/stefanpenner/ember-cli) version you have installed to set up an ember-frontend in a `client` sub-folder.

To find out more about Sails and Ember and how they work together, you can take a look at my talk
[http://vimeo.com/103711300](http://vimeo.com/103711300) and slides [http://talks.artificial.io/sailing-with-ember/
](http://talks.artificial.io/sailing-with-ember/)

## Options

`sane new project [--docker] [-d mongo|postgres|mysql]`

* `--docker` sets up your whole backend envrionment using [fig](http://www.fig.sh/) to provide simple container management.

**Note:** Make sure you have [fig](http://www.fig.sh/install.html) installed. If you are on Mac or Windows also [boot2docker](http://boot2docker.io/) and for Linux see: [https://docs.docker.com/installation/ubuntulinux/](https://docs.docker.com/installation/ubuntulinux/)

**Why Docker?** It fully automates the setup of server dependenvies and you can now develop in your production environment that you can deploy to your server as-is.

* `-d`: Installs the choosen database adapter for sails. If `--docker` is active it installs the database via the right container.

`sane up [--docker]`
`sane g api|resource [--docker]`

* `--docker` is needed if you want to run the commands using docker/fig.

`.sane-cli`: A file located in your root folder that contains all default parameters. You can user it to have `--docker` set as default for each `sane` command you run.


##Deployment
**Note: This is still very much work in progress. We are planning to add an automated nginx container which will make it easy to instantly deploy the containerized app to your server.**

In the meantime find the old deployment readme (ignoring any of the possible Docker setup):

* Make sure you have `npm i -g pm2` installed on your server
* Simply clone your app on the server
* Then you can use `pm2 start app.js -- --prod` in `/server` to starts sails in production mode on port 80
* `ember build --environment=production --output-path=../server/assets/`.
   * That builds the app and copies it over to be included with Sails.
   * `pm2 restart app` so Node can pick up the latest changes

The Server is configured to serve the Ember App on all routes, apart from the `api/**` routes, so Ember itself can take full control of handling error routes, etc.

For more information on deployment and different strategies check out:

* The [Sails Documentation](http://sailsjs.org/#/documentation/concepts/Deployment) to read up about some fundamentals
* [PM2 Deploy](https://github.com/Unitech/pm2#deployment) gives you some nice command line tools to ease deployment
* [Ember-CLI Deploy](https://github.com/achambers/ember-cli-deploy) for deployment via Redis and Amazon S3
* [Hardening NodeJS](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/) for a proper Nginx setup


##Thanks
Thanks to [mphasize](https://github.com/mphasize) for creating [sails-generate-ember-blueprints](https://github.com/mphasize/sails-generate-ember-blueprints) which overwrites the default SailsJS JSON response to the one that Ember Data's `RESTAdapter` and `RESTSerializer` expects.

##Contribution
Everyone is more than welcome to contribute in any way: Report a bug, request a feature or submit a pull request. Just keep things sensible, so we can easily reproduce bugs, have a clear explanation of your feature request, etc.

##License
SANE Stack is [MIT Licensed](https://github.com/artificialio/sails-ember-starter-kit/blob/master/LICENSE.md).