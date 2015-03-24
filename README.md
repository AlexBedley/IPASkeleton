# IPASkeleton [![Build Status](https://travis-ci.org/AlexBedley/IPASkeleton.svg?branch=master)](https://travis-ci.org/AlexBedley/IPASkeleton) [![Coverage Status](https://coveralls.io/repos/AlexBedley/IPASkeleton/badge.svg?branch=master)](https://coveralls.io/r/AlexBedley/IPASkeleton?branch=master)
A skeleton free-range app

![ipa skeleton logo](ipa-skeleton-logo.jpg)

##Environment Setup
#####Node
[Install node v0.10.36](http://nodejs.org/dist/v0.10.36/node-v0.10.36-x86.msi) with the default options. This will also install `npm`, the node package manager. You should restart after the install.

##Running the App Locally
First, you must be added to the repo as a collaborator to obtain write permissions. Create a GitHub account and talk to either Jon or Alex.

After you have been added as a collaborator, run these commands to pull down the repo and install the dependencies. You will only have to do this once. First, make a directory you wish to clone the repo in. I suggest `D:\\D2L\FreeRangeApps\`. Then, in that directory, run (as administrator):

    git clone git@github.com:AlexBedley/IPASkeleton.git
    cd IPASkeleton
    npm install
You want to install gulp globally so you can run `gulp` on the command line.

    npm install -g gulp
Run these commands to build and host the app locally. You may want to run `gulp appresolver` in a different window because you will not be able to issue new commands while it is running.

    npm run build
    gulp appresolver
Now your app is available at [http://localhost:3000/app/app.js](http://localhost:3000/app/app.js) while your `gulp appresolver` console is running. You should see the source of a javascript file at that url.

##LE Integration
To see it in the LE we will need to make some changes.

1. Clone the [Dev AppRegistry Config](https://git.dev.d2l/users/cpacey/repos/lp-devappregistry-config/browse) into your LE instance's `checkout` directory
2. Run a `full_all.bat` so that your instance picks up the Dev AppRegistry Config

Now, once we've locally hosted the app (see [*Running the App Locally*](https://github.com/AlexBedley/IPASkeleton#running-the-app-locally) above), we can navigate to `/d2l/apps/IPASkeleton/` and you should see `Guten Morgen, D2L Support!` in the top left corner.

##Making Changes
To make changes to the app (assuming you have already cloned it - see [*Running the App Locally*](https://github.com/AlexBedley/IPASkeleton#running-the-app-locally) above)

1. Pull changes from others `git pull`
2. Install any new packages `npm install`
3. Checkout a new branch `git checkout -b "this_is_a_branch_name"`
4. Do your changes
5. Run the tests locally `npm test`
6. Make your commits `git commit -am "This is a commit message"`
7. Push your commits to your branch on GitHub `git push`
8. Log onto GitHub and [create a Pull Request](https://help.github.com/articles/creating-a-pull-request/). Then you can request reviewers by [assigning people](https://help.github.com/articles/assigning-issues-and-pull-requests-to-other-github-users/) to the pull request.
9. Travis-CI will automatically run the tests on every commit to a pull request. Once the tests have completed, the result is shown on the GitHub pull request page.
9. Pull request gets reviewed and merged
10. After the merge, Travis-CI will automatically publish the app to the CDN. It will also comment on the commit in GitHub with the location of the app on the CDN.

##Publishing the App to the CDN
Our [Travis-CI](https://travis-ci.org/AlexBedley/IPASkeleton) should be set up to automatically publish on commit to the `master` branch. To publish a new version of the app, simply submit a pull request to `master` and it will publish after the merge.

Every commit to master will trigger a Travis build that includes a publish step to the CDN.  Note that every pull request will also trigger a build job, but these do not include the publish step.  Publishing can either happen to "prod" or "dev".  

**To Dev** 

- URL pattern: https://s.brightspace.com/apps/{apps}/dev/{commit-sha}/app.js
- Every commit to master without a valid semver tag is published to ../dev/..
- For convenience, you can find the link added as a comment to the commit

**To Prod**

- URL pattern: https://s.brightspace.com/apps/{appid}/{version}/*.*
- Every commit to master with a valid semver tag that matches the version # in packages.json is published to ../{appversion}/..
- Steps to accomplish this are listed below - however we are considering improvements (such as auto-detecting chagnes in the packages.json version # in master)
- You can also find the link added as a comment to the commit

**Steps to tag and release a new version of the FRA:**

1. Ensure you have pulled the latest commit from master locally and are pointed to it  
2. At your console, at the app's root directory, run 'npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]' (e.g. npm version patch).  This should automatically increment your packages.json version # appropriately and create a commit with the appropriate tag locally.  
3. Push your changes directly to master (again, we are considering improvements that might include a peer review step)

**From Local**  
To publish directly to the CDN from your local machine (but you should not ever need to do this) you should:

1. Obtain the S3 secret key (currently encrypted in `.travis.yml`) from Alex or Jon  
2. Replace `options.creds.secret` (in `gulpfile.js`) with the secret key (and don't commit/push the secret key)  
3. Manually set `options.devTag` (in `gulpfile.js`) to something unique (Travis-CI uses the commit SHA) or 'options.version' if you do not want /dev/ in the URL.  
4. Run `npm run publish-release`  
5. **Don't commit** because the secret key is now in `gulpfile.js`

##Adding new secure variables to .travis.yml
You will need to do this if we need to add a new secret variable (API key, etc.) to the build process.

1. Install [Ruby](http://dl.bintray.com/oneclick/rubyinstaller/rubyinstaller-2.2.1.exe?direct), making sure to check the box to add Ruby to your `PATH`
2. Restart your computer to add `ruby` and `gem` to your `PATH`
3. Downgrade your `gem` version by running `gem update --system 2.4.4` (at the time of this writing 2.4.7 did not work for us on Windows)
4. Install the travis gem `gem install travis`
5. Navigate to the repo root
6. Run `travis encrypt myKey=mySecretValue --add env.global`. This will encrypt `mySecretValue` and add it to the `.travis.yml` file
7. Add a comment in the `.travis.yml` file mapping `myKey` and the first 5 characters of the ciphertext
8. Access your new secret variable in the code by calling `process.env.myKey`. Note that this value will only be populated on Travis-CI build servers

##Testing Considerations

*To be completed*
- Remember to install Karma-cli globally
