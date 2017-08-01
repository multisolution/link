#!/bin/bash
ssh multisolution2@multisolution.art.br <<<SSH
  cd public_html/link/
  mv data.json __data.json
SSH

scp -r build/ multisolution2@multisolution.art.br:public_html/link/

ssh multisolution2@multisolution.art.br <<<SSH
  cd public_html/link/
  mv __data.json data.json
SSH
