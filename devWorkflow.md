// local engine development =====================
cd D:\GIT\wuliEngine
npm link
cd D:\GIT\express-to-vercel-main
npm link @wulirocks/collection-engine


// Return Express to the published npm package =====================

cd D:\GIT\express-to-vercel-main
npm unlink @wulirocks/collection-engine
npm install @wulirocks/collection-engine@0.1.1
npm ls @wulirocks/collection-engine
npm config list
 

//====== or push new version =====================


cd D:\GIT\wuliEngine
git add AssetGeneration\renderGridLayout.js
npm login

git add PATH_REGISTRY\PATH.js
git add JSONDATA/ALL_PATH.json


 
git commit -m "nft card path fixed"
git stash push -m "WIP unrelated changes"
npm version patch
npm publish

cd D:\GIT\express-to-vercel-main
npm install @wulirocks/collection-engine@0.1.3
 
// git check package and package lock are modified properly
npm pkg get dependencies."@wulirocks/collection-engine"
npm ls @wulirocks/collection-engine

// if all ok:  // only update the packages
git add package.json package-lock.json
git status
git commit -m "Update collection engine to 0.1.3"
git push





cd D:\GIT\wuliEngine
npm version patch
npm publish



//==============================
do not push to git:
Rename-Item .npmrc .npmrc.vercel
Rename-Item .npmrc.vercel .npmrc

 

npm uninstall @wulirocks/collection-engine



// ==== prepare next GIT add and push for general purpose  ============== 

cd D:\GIT\express-to-vercel-main
git add api/wuliEngine/
 git add api/wuliEngine/
git add package.json 
git status
git commit -m "wuli engine copied locally"
git push