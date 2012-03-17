import os
import re
from tempfile import NamedTemporaryFile
from fabric.api import *

env.theme_path = './sites/all/themes/makers'
env.sass_bin = 'sass'
env.yui_bin = 'java -jar ./project_files/yuicompressor.jar'

def build():
    build_js()
    copy_js()
    update_css()

def bootstrap():
    #http://yui.zenfs.com/releases/yuicompressor/yuicompressor-2.4.7.zip

def build_js():
    local('node ./project_files/r.js -o %s/js-src/app.build.js' % env.theme_path)

def copy_js():
    requirejs_path = '%s/js-src/lib/require/require.js' % env.theme_path
    mainjs_path = '%s/js-build/main.js' % env.theme_path

    f = NamedTemporaryFile()
    f.write(";\n;")

    local('cat %s %s > %s/js/main.js' % (requirejs_path, mainjs_path, env.theme_path))

def update_css():
    in_path = '%s/css-src/base.scss' % env.theme_path
    ie8_specific_in_path = '%s/css-src/ie8_specific.css' % env.theme_path
    out_path = '%s/css/style.css' % env.theme_path
    out_ie_path = '%s/css/style_ie.css' % env.theme_path

    f = NamedTemporaryFile()

    local('%s %s %s' % (env.sass_bin, in_path, f.name))

    local('%s --type css %s > %s' % (env.yui_bin, f.name, out_path))

    str = f.read()
    f.close()

    res = re.findall('\/\*\*START_IE_CSS_PARSE\*\*\/(.*?)\/\*\*END_IE_CSS_PARSE\*\*\/', str, re.DOTALL)

    f = NamedTemporaryFile(delete=False)

    for r in res:
        f.write(r)

    ie8_f = open(ie8_specific_in_path, 'r')
    f.write(ie8_f.read())

    f.close()

    local('%s --type css %s > %s' % (env.yui_bin, f.name, out_ie_path))
    
    os.unlink(f.name)
