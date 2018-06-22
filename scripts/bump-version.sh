#!/bin/bash

set -e

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  git config --global user.email ${EMAIL};
  git config --global user.name ${USER};

  git fetch origin;
  git checkout master;

  CURRENT_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

  # Only bump the tag if the current version already has a tag, if it doesn't exist then the version has been manually updated.
  if [ "$(git tag -l v$CURRENT_VERSION)" == "v$CURRENT_VERSION" ]; then
    npm version patch --no-git-tag-version
    git add package.json
    git add package-lock.json

    CURRENT_VERSION=$(cat package.json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g' \
    | tr -d '[[:space:]]')

    git commit -m "Bump version to $CURRENT_VERSION [skip ci]"
  fi

  git tag v$CURRENT_VERSION

  git push "https://${GITHUB_TOKEN}@${GITHUB_REPO}" master --tags;
fi
