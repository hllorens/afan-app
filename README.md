Aplicación CoLE
========
Aplicación para la Corrección de errores en la Lectura y Escritura

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
2) **afan-app-media**: dropbox (current-projects/afan-app-media) or from https://github.com/hllorens/afan-app/tree/master/www/external-dependencies-backup
3) **chartist**: from its web or from https://github.com/hllorens/afan-app/tree/master/www/external-dependencies-backup.
Without chartist you will get an ERROR in afan-app-resultados.js








