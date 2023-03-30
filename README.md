# Pagel-trapp
 
For start create a fork and clone the project, this project use laravel and angular but without docker, for windows I recommend Wamp64 to run php server with mysql. If you are using the wamp64 put the project inside the folder wamp64/www

for the database, run the script ```database_ddl.sql```, you can find it on ```server/database``` folder

run the ```npm i``` inside the client folder
run the ```composer install```inside the server folder

for run the server use ```php artisan serve``` inside the server folder
and for the client ```npm start```inside the client folder

this way will use a proxy

after run the database scrip it will create an user with developer permissions (all permissions) with email "admin@admin.com" and password "xuxu";
