#!/usr/bin/env bash

set -e
set -x

COMMIT=$(git rev-parse master)
TAG=$(git describe $(git rev-list --tags --max-count=1))
DATE=`date +%Y-%m-%d`
ORIGIN=$(git config --get remote.origin.url)

mkdir -p doc-building
cd doc-building
git init
git remote add origin $ORIGIN || true
mkdir -p doc-building
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages
git pull ../ gh-pages || true

cd ..
git --work-tree=./doc-building checkout master -- .

cd doc-building
sed -i.bak '/doc/d' .gitignore; rm .gitignore.bak
echo "jekyll-cayman-theme" >> .gitignore
echo "src" >> .gitignore
echo "test" >> .gitignore
echo "scripts" >> .gitignore
echo "yarn.lock" >> .gitignore
echo "package.json" >> .gitignore
echo ".travis.yml" >> .gitignore
echo ".eslintrc" >> .gitignore
echo ".babelrc" >> .gitignore

yarn
npm run doc:build
if [ ! -d "jekyll-cayman-theme" ]; then
  git clone https://github.com/pietromenna/jekyll-cayman-theme.git --depth=1
fi
cd jekyll-cayman-theme
cat ../scripts/jekyll/_config.yml > _config.yml
cat ../scripts/jekyll/page-header.html > _includes/page-header.html
cat ../scripts/jekyll/page-footer.html > _includes/page-footer.html
rm -r _posts/ || true
cat > index.md << EndOfMessage
---
layout: default
---
EndOfMessage
cat ../README.md >> index.md
bundle install
jekyll build
rm ./_site/Gemfile
rm ./_site/Gemfile.lock
rm ./_site/jekyll-cayman-theme.gemspec
rm ./_site/README.md
cp -r ./_site/* ../
cp ../scripts/jekyll/favicon.ico ../favicon.ico

cd ..
git add --all
git commit -m "$TAG $COMMIT $DATE" --no-verify
git push ../ gh-pages

echo "$TAG $COMMIT $DATE"
echo "documentation created on branch gh-pages"
