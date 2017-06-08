[![Build Status](https://travis-ci.org/johanfrick/davidmiles.svg?branch=master)](https://travis-ci.org/johanfrick/davidmiles)

Dev
* cd client/web
* bower install
* cd client/
* gulp build
* php -S localhost:8888

Deploy
* Gå igenom lokala ändringar
* Committa
* Kör deploy.sh (från iTerm så att password trycks in automatiskt)
* Innan dry-run, kolla ändringarna och se om allt ser rätt ut
* Om du är rädd, logga in på burken och gör backup
    * ssh davidmiles.se@ssh.davidmiles.se
    * mkdir BAK/<datum>
    * cp -av /www/* BAK/<datum>
* kör dry-run
* kör real run
