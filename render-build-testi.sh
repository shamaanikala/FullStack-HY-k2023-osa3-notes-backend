# render-build-testi.sh
# Tämän mallin mukaan
# https://render.com/blog/it-works-fine-locally

#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm build