# IPASkeleton [![Build Status](https://travis-ci.org/AlexBedley/IPASkeleton.svg?branch=master)](https://travis-ci.org/AlexBedley/IPASkeleton)
A skeleton free-range app

##Environment Setup
#####Node
[Install node v0.10.36](http://nodejs.org/dist/v0.10.36/node-v0.10.36-x86.msi). This will also install `npm`, the node package manager. You will probably have to restart to get `node` and `npm` in your `PATH`. You can run `echo %PATH%` to check.

##Running the App
Run these commands to pull down the repo and install the dependencies. You will only have to do this once.

    git clone git@github.com:AlexBedley/IPASkeleton.git
    cd IPASkeleton
    npm install
You want to install gulp globally so you can run `gulp` on the command line.

    npm install -g gulp
Run these commands to build and publish the app locally:

    npm run build
    gulp appresolver
Now your app is available at [http://localhost:3000/app/app.js](http://localhost:3000/app/app.js)

##LE Integration
To see it in the LE we will need to make some changes.

1. Clone the [Dev AppRegistry Config](https://git.dev.d2l/users/cpacey/repos/lp-devappregistry-config/browse) into your instance's `checkout` directory
2. Run a `full_all.bat` so that your instance picks up the Dev AppRegistry Config

Now, once we've locally hosted the app (see *Running the App* above), we can navigate to `/d2l/apps/IPASkeleton/` and you should see `Hello, World!` in the top left corner.
