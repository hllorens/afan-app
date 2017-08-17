Aplicación CoLE
========
Aplicación para la Corrección de errores en la Lectura y Escritura

Installation (server)
========
Audio (some servers have problems serving audio files), modifying .htaccess with:
    AddType audio/mp4 .mp4 .m4a
Might help but sometimes the problem is that the audio file is not reachable... 


MySQL DB (see ajaxdb.php): Create the required DB and put a file in a folder e.g., ../../../secrets/db_credentials_afan-app.json
    {
        "user": "xxxx",
        "pass": "xxxx",
        "db_server":"sql312.unaux.com",
        "db_name":"xxxx"
    }
    FUTURE: use firebase
    
Google Auth (see ajaxdb.php): Create a file with the app id e.g., ../../../secrets/gclient_secret_afan-app.json
    {
        "client_id": "xxxxxkrhh60.apps.googleusercontent.com",
        "client_secret": "xxxxxx"
    }
    FUTURE: use firebase


Get external dependencies from either other repos (cognitionis-js) or dropbox (current-projects/afan-app-media)

Or from this repo backup (www/external-dependencies-backup)

copy or extract them in: www/external-git-ignored/





