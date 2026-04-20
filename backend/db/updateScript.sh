#!/bin/sh
echo Process start...
myArray=('user-service' 'back-service' 'test-service' 'income-service')
PACKAGE_VERSION=`echo $(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g') | sed 's/ *$//g'`

PACKAGE_FILE="erp-db-$PACKAGE_VERSION.tgz"
cd ..
for i in ${!myArray[@]}; do
  echo " *****  Start  ${myArray[$i]} *****"
  cd ${myArray[$i]}
  yarn add "file:../db/$PACKAGE_FILE"
  cd ..
  echo " *****  End  ${myArray[$i]} *****"
done
echo Process End....