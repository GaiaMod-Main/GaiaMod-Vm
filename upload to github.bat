@echo off
git init
git add .
git commit -m "Uploaded the code."
git branch -M develop
git remote add origin https://github.com/GaiaMod-Main/GaiaMod-Vm.git
git push -f --no-verify origin develop
PAUSE