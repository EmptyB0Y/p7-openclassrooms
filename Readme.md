Database infos : back/config/config.json - Postgresql
npm install -> back/
            -> front/

back/.env template :
//////////////////////////////
JSON_TOKEN=StringKeyForJwtTokenEncryption
SUPER_PASS=PasswordForAdminCreation
AUTHORIZED_ADMIN_IPS=ipv6;list;of;authorized;ips;to;create:admins; (::1; = localhost)
/////////////////////////////