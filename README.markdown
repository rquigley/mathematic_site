Frontend Code Style
-4 spaced soft tab

HTML
-

CSS
-Prefer "class" to "id" unless absolute necessary
-Slug classes using "_" instead of "-"

JS
-Camel case for all vars and functions


SASS compile
sass --watch static/css/base.scss:static/gen/site.css

Build JS Assets
We use the require.js build tool. Compile and minimize everything down
to one file:
node r.js -o static/js/app.build.js
