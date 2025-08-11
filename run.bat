@echo off
cd /d %~dp0
echo Se porneste serverul...


start http://localhost:3000/index.html

echo ^|-----------------------------------------------------------------------------------------^|
echo ^| Ghid: Daca browserul nu s-a deschis, intrati manual pe http://localhost:3000/index.html ^|
echo ^|-----------------------------------------------------------------------------------------^|

node server.js

pause