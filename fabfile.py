import os
#import re
from tempfile import NamedTemporaryFile
from fabric.api import local, env, settings, run, cd, sudo
from fabric.contrib.project import rsync_project

env.project_dir = os.getcwd()
env.build_dir = '/tmp/mathematic_site_build'

env.hosts = ['mathematicinc.com']

env.static_path = './website/static'
env.sass_bin = 'sass'
env.yui_bin = 'java -jar ./project_files/yuicompressor.jar'

def deploy():
    tmp_dir = 'mathematic_deploy'
    remote_dir = '/var/www/mathematic'

    #sudo('rm -rf %s' % (tmp_dir))
    rsync_project(
        tmp_dir,
        '%s/' % env.build_dir,
        #exclude=RSYNC_EXCLUDE,
        delete=True,
        #extra_opts=extra_opts,
    )
    sudo('chown -R www-data:www-data %s' % (tmp_dir))
    sudo('rm -rf %s.old' % (remote_dir))
    sudo('mv %s %s.old' % (remote_dir, remote_dir))
    sudo('mv %s %s' % (tmp_dir, remote_dir))
    sudo('touch %s/config/uwsgi/production.ini' % (remote_dir))
    sudo('service nginx reload')
    #update_source()

    #build_from_source()
    #-rm build/last
    #-mkdir building


    #local("touch config.wsgi")

def deploy2():
    local('scp')
    #project.upload_project(env.build_dir, )
    #require('root', provided_by=('staging', 'production'))
    #if env.environment == 'production':
    #    if not console.confirm('Are you sure you want to deploy production?',
    #                           default=False):
    #        utils.abort('Production deployment aborted.')
    #extra_opts = '--omit-dir-times'
    #rsync_project(
    #    env.root,
    #    exclude=RSYNC_EXCLUDE,
    #    delete=True,
    #    extra_opts=extra_opts,
    #)

def sass_watch():
    local('sass --scss --watch website/static/css-src/base.scss:website/static/gen/css/site.css')

def bootstrap():
    #http://yui.zenfs.com/releases/yuicompressor/yuicompressor-2.4.7.zip
    pass

def update_source():
    src_dir = '%s/src' % env.project_dir

    with settings(warn_only = True):
        if run("test -d %s" % src_dir).failed:
            run("git clone git@github.com:rquigley/mathematic_site.git %s" % src_dir)

    with cd(src_dir):
        run("git pull origin master")

def build():
    if os.path.isdir('%s' % env.build_dir):
        local('rm -rf %s' % env.build_dir)

    local('mkdir %s' % env.build_dir)

    local("rsync -a --exclude '.git' --exclude '*.pyc' --exclude '*.un~' --exclude '.DS_Store' --exclude 'project_files' --exclude 'website/static/css-src' %s/ %s" % (env.project_dir, env.build_dir))

    build_css('%s/%s' % (env.build_dir, env.static_path))
    build_js('%s/%s' % (env.build_dir, env.static_path))


def build_js(out_path = None):
    if out_path is None:
        out_path = env.static_path

    # Something is screwed up with require.js. It's hanging on minifying require.js
    local('rm -rf %s/gen/js/*' % (env.static_path))

    if not os.path.isdir('%s/gen/js' % out_path):
        local('mkdir %s/gen/js' % out_path)

    requirejs_path = '%s/js-src/lib/require/require.js' % env.static_path
    mainjs_path_tmp = '%s/gen/js/main.js' % env.static_path
    mainjs_path = '%s/gen/js/main.js' % out_path

    f = NamedTemporaryFile(delete=False)

    local('node ./project_files/r.js -o %s/js-src/app.build.js' % (env.static_path))

    local('cat %s %s > %s' % (requirejs_path, mainjs_path_tmp, f.name))
    local('rm -rf %s/gen/js/*' % (out_path))
    local('mv %s %s' % (f.name, mainjs_path))
    
    f.close()

def build_css(out_path = None):
    if out_path is None:
        out_path = env.static_path

    if not os.path.isdir('%s/gen/css' % out_path):
        local('mkdir %s/gen/css' % out_path)

    in_path = '%s/css-src/base.scss' % env.static_path
    #ie8_specific_in_path = '%s/css-src/ie8_specific.css' % env.static_path
    out_path = '%s/gen/css/site.css' % out_path
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
