SASS compile
sass --watch website/static/css-src/base.scss website/static/gen/css/site.css
sass website/static/css-src/base.scss website/static/gen/css/site.css

Build JS Assets
We use the require.js build tool. Compile and minimize everything down
to one file:
node project_files/r.js -o website/static/js-src/app.build.js
