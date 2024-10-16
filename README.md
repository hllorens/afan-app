Aplicación CoLE
========
Aplicación para la Corrección de errores en la Lectura y Escritura


TODO:
========
afan-app was published in playstore as an apk with minSDK 19 and targedSDK 29.
            under com.cognitionis.afanapp  version 1.4.4 code 10404

VERSIONS USED:
- node 18.16.0
- npm 9.5.1
- cordova 13.0

 (instead of intalling cordova globally add a package .json in the project) so it gets
intalled easily with npm install.
That information and the cordova project itself should be added to git (in this or another repo)
Currently, we need to compile it for SDK 34.
Check if Android Stuido can do that automatically or we need to redo the project.



Resolve https://github.com/hllorens/afan-app/issues to get to the payment version
 con test y report q se generan pueden enviarse a un email o guardarse en local (se perderán si se borran los datos etc)
 habilidad tb para importar desde un json

Deployments
========
- Web in **unaux** (TODO: move that to some `heroku` or `netlify` like deployment)
- Android App **Google Play Store**: deployed following steps below
- Android App apk **cygwin**: `afan-app` folder (this repo, www code) and `afanapp` folder for the **Apache Cordova** project


Installation (server)
========
Audio (some servers have problems serving audio files), modifying .htaccess with:
    AddType audio/mp4 .mp4 .m4a
Might help but sometimes the problem is that the audio file is not reachable...
(contact server support or try a different server. NOTE: dropbox or drive do not work as of 2017)
Do not work much on this until HTML5 offers better sound handling, then perhaps you don't need fancy loading.
Free servers that work: unaux.com

To use this in free-servers (like profreehost or unaux):
In `ajax.php` file remove `../` from the secrets url (in free servers they are exposed...)

**MySQL DB**
(see ajaxdb.php): Create the required DB and put a file in a folder e.g., ../../../secrets/db_credentials_afan-app.json
    {
        "user": "xxxx",
        "pass": "xxxx",
        "db_server":"sql312.unaux.com",
        "db_name":"xxxx"
    }
    FUTURE: use firebase
    
**Google Auth**

See ajaxdb.php 

Make sure https://code.google.com/apis/console/  API&Services->credentials->OAuth 2.0 Client IDs (edit) includes the domain name (URL)

Create a file with the app id e.g., ../../../secrets/gclient_secret_afan-app.json
    {
        "client_id": "xxxxxkrhh60.apps.googleusercontent.com",
        "client_secret": "xxxxxx"
    }
    FUTURE: use firebase

**External dependencies**
Get external dependencies and copy or extract them in: www/external-git-ignored/


1) **cognitionis-js**: from either it's github repo (cognitionis-js) or from https://github.com/hllorens/afan-app/tree/master/www/external-dependencies-backup
  Note: probably useful to get a version committed and just update it manually (comparing with the official repo)
2) **afan-app-media**: dropbox (current-projects/afan-app-media) or from https://github.com/hllorens/afan-app/tree/master/www/external-dependencies-backup
3) **chartist**: from its web or from https://github.com/hllorens/afan-app/tree/master/www/external-dependencies-backup.
Without chartist you will get an ERROR in afan-app-resultados.js


Installation (app)
========

**Apache Cordova**:
Install *Android Studio* (latest) and *Apache Cordova* (version ?)

create new project in $HOME called **afanapp** which will generate **afanapp** folder.
`cd $HOME`
`cordova create afanapp "com.cognitionis.afanapp" "CoLE: Discriminación Auditiva y Visual, Memoria y Ritmo"`
  Note: it could have been cole instead of afanapp

Copy from this repo into the afanapp/ folder:
- `config.xml` (or adapt the default one): 
- `res.../` folder (for icons): `cp -r afan-app/res-google-play afanapp/res`

add platform android and/or ios
E.g., `cordova platform add android`
It tells you the SDK e.g.,:
        Android Target SDK: android-34
        Android Compile SDK: 34
See minSDK and targetSDK:
`vim afanapp/platforms/android/cdv-gradle-config.json`

In package.json change `version` to the desired one

Completely replace/overwrite the www folder: `rm -rf afanapp/www;cp -r afan-app/www afanapp/www`
- Uncomment the cordova.js part in index.html
- Replace afan-app.js by the appversion which removes/tunes set\_internet\_access\_true or check\_internet\_access\_with\_img:
`mv afanapp/www/js/afan-app.js afanapp/www/js/afan-app-original.js;mv afanapp/www/js/afan-app-appversion.js afanapp/www/js/afan-app.js`

Make sure it compiles
`cordova build android --prod`

For **releasing** (app-store, google play store):
Used secrets are kept in drive `/MH/afan-app/keystore-and-related-config/`
- `cognitionis.keystore` a pre-created keystore
- `release-signing.properties` a pre-created app signing config

1) Use existing or create a keystore `keystore/cognitionis.keystore` file (only once):
`cd $HOME; mkdir keystore; cd keystore`
Copy `cognitionis.keystore` there.
Only if you want to create a new one:
`keytool -genkey -v -keystore cognitionis.keystore -alias cognitionis_key -keyalg RSA -keysize 2048 -validity 10000`
Will ask you some questions to generate it...

2) Use existing or create `afanapp/platforms/android/release-signing.properties`
Copy `release-signing.properties` in `$HOME/afanapp/platforms/android/`

Only if you want to create a new one:
`cd $HOME/afanapp/platforms/android/`
`vim release-signing.properties` and add this content:
```
storeFile=../../../keystore/cognitionis.keystore
storeType=jks
keyAlias=cognitionis_key
keyPassword=the one used  <-- this should match the keystore password
storePassword=the one used
```

Since google might require you to always sign with the same keystore
it is useful to store it into a safe place (out of git) and reuse it
E.g., in drive/MH/afan-app so it is on cloud but not exposed


Finally to create the signed apk run:
`cordova build android --prod --release`


Multimedia development
========

**IMG**: 
create sprite:
`css-sprite ./output/ ./Imagenesretocadas/*  -c ../img -s output/sprite.css`
make it responsive:
`responsivize-css-sprite.sh css-file vertical-background > css-file-responsive`
replace-all: `.icon`- -> `.wordimage-`, remove all with, height and add it to the first element as

```
.wordimage {
  background-image: url('../../../afan-app-media/img/wordimg-sprite.png');
  background-size: 100% auto;
}
```

The rest will only have background-position as percentages

***AUDIO***:
optimize letter sounds (wav): Use `Audacity`
normalize -6db
noise removal (get noise profile selecting noise, then remove noise selecting all)
increasing sensitivity to 9db improves performance 
Make all sounds the same length (e.g., about 1s)

generate sprite (source wavs are deprecated, extract them again from m4a sprite):
`./audio-sprite-generator.py | sed "s/50:/:/g" | sed "s/50\"/\"/g" | sort` (hardcoded folder path, change it as needed)
Input: wav, Output: wav
Convert audio to compressed m4a with (see Tools document in drive)
Note: raw or treated wavs are deprecated so use the sprite m4a to extract them again if needed

Sound and images size is OPTIMIZED, the only further optimization is using image sprite for words and see if that way the size is smaller and the load faster. Make sure caché is used!!!

**External resources**
Letter sounds could be wikipedia's or our own
Imagens from PIXABAY.COM

**Activity data**
Some data is in google spread sheet exportable to .tsv so that we can work in parallel
https://docs.google.com/spreadsheets/d/1Z5D2Ca2v_KlRktmRjvNEQOmDHrt5_ErWuwOFdStYogQ

Data format
The correct answer is always the first, the app rands them, the minimum number of answers is two, the maximum is unlimited



