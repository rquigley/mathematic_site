import os
import re
from tempfile import NamedTemporaryFile
from fabric.api import local, env, settings, abort, run, cd

env.project_dir = '/var/www/mathematic'

env.hosts = ['mathematicinc.com']

env.static_path = './mathematic_site/static'
env.sass_bin = 'sass'
env.yui_bin = 'java -jar ./project_files/yuicompressor.jar'

def deploy():
    update_source()

    build_from_source()
    #-rm build/last
    #-mkdir building


    #local("touch config.wsgi")

def update_source():
    src_dir = '%s/src' % env.project_dir

    with settings(warn_only = True):
        if run("test -d %s" % src_dir).failed:
            run("git clone git@github.com:rquigley/mathematic_site.git %s" % src_dir)

    with cd(src_dir):
        run("git pull origin master")

def build_from_source():
    src_dir = '%s/src' % env.project_dir
    build_dir = '%s/build/building' % env.project_dir

    with settings(warn_only = True):
        if run("test -d %s" % build_dir).succeeded:
            run('rm -rf %s' % build_dir)

    run('mkdir %s' % build_dir)

    run('rsync -a --exclude .git %s/ %s' % (src_dir, build_dir))


    #system("rsync -a --exclude \"project_files\" --exclude \"httpd-dev.conf\" --exclude .svn $SITE_SVN_DIR/$site_name/ $SITE_PRODUCTION_DIR/$site_name");


def build():
    #build_js()
    #copy_js()
    update_css()

def sass_watch():
    local('sass --scss --watch website/static/css-src/base.scss:website/static/gen/css/site.css')

def bootstrap():
    #http://yui.zenfs.com/releases/yuicompressor/yuicompressor-2.4.7.zip
    pass

def build_js():
    local('node ./project_files/r.js -o %s/js-src/app.build.js' % env.static_path)

def copy_js():
    requirejs_path = '%s/js-src/lib/require/require.js' % env.static_path
    mainjs_path = '%s/js-build/main.js' % env.static_path

    f = NamedTemporaryFile()
    f.write(";\n;")

    local('cat %s %s > %s/js/main.js' % (requirejs_path, mainjs_path, env.static_path))

def update_css():
    in_path = '%s/css-src/base.scss' % env.static_path
    #ie8_specific_in_path = '%s/css-src/ie8_specific.css' % env.static_path
    out_path = '%s/gen/css/style.css' % env.static_path
    #out_ie_path = '%s/gen/css/style_ie.css' % env.static_path

    f = NamedTemporaryFile()

    local('%s %s %s' % (env.sass_bin, in_path, f.name))

    f.flush()

    local('%s --type css %s > %s' % (env.yui_bin, f.name, out_path))

    #str = f.read()
    #f.close()
    #
    #res = re.findall('\/\*\*START_IE_CSS_PARSE\*\*\/(.*?)\/\*\*END_IE_CSS_PARSE\*\*\/', str, re.DOTALL)
    #
    #f = NamedTemporaryFile(delete=False)
    #
    #for r in res:
    #    f.write(r)
    #
    #ie8_f = open(ie8_specific_in_path, 'r')
    #f.write(ie8_f.read())
    #
    #f.close()
    #
    #local('%s --type css %s > %s' % (env.yui_bin, f.name, out_ie_path))
    #
    #os.unlink(f.name)
