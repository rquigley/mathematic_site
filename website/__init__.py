from flask import Flask, request, render_template, abort
#from utility import slugify, friendly_time, timestamped
from utility import timestamped
import re
import os

app = Flask(__name__)

env = os.getenv('mm_env', 'production')
#env = 'production'
if env == 'dev':
    app.debug = True

#import logging
#logging.basicConfig(filename='/var/www/mathematic/site.log',level=logging.DEBUG)
#logging.basicConfig(filename='site.log',level=logging.DEBUG)

app.jinja_env.filters['timestamped'] = timestamped

app.jinja_env.globals.update({
    'env': env
})

clients = [
    {
        'url': 'aol-makers',
        'template': 'makers.html',
        'image_path': 'makers',
        'client': 'Aol',
        'project': 'MAKERS',
    },
    {
        'url': 'galleray-app',
        'template': 'galleray.html',
        'image_path': 'galleray',
        'client': 'Galleray',
        'project': 'Application',
    },
    {
        'url': 'nfei-website',
        'template': 'nfei.html',
        'image_path': 'nfei',
        'client': 'North Fork Education Initiative',
        'project': 'Website',
    },
    {
        'url': 'medium-app',
        'template': 'medium.html',
        'image_path': 'medium',
        'client': 'Medium',
        'project': 'Application',
    },
    {
        'url': 'grubot-app',
        'template': 'grubot.html',
        'image_path': 'grubot',
        'client': 'grubot',
        'project': 'Application',
    },
]

@app.route("/")
def hello():
    return render_template('index.html',
                is_pjax = "X-PJAX" in request.headers,
                )

@app.route("/work/<client>/")
def work_client(client):
    def find_client(url):
        for c in clients:
            if c['url'] == url:
                return c

    found_client = find_client(client)
    if found_client:
        return render_template(os.path.join('work', found_client['template']),
                    is_pjax = "X-PJAX" in request.headers,
                    )
    else:
        abort(404)

@app.route("/work/")
def work():
    #logging.info('pjax:%s' % ("X-PJAX" in request.headers))
    #logging.info(str(request.headers))
    return render_template('work.html',
                clients = clients,
                is_pjax = "X-PJAX" in request.headers,
                )

@app.route("/services/")
def services():
    #logging.info('pjax:%s' % ("X-PJAX" in request.headers))
    #logging.info(str(request.headers))
    return render_template('services.html',
                is_pjax = "X-PJAX" in request.headers,
                )

@app.route("/about/")
def about():
    return render_template('about.html',
                is_pjax = "X-PJAX" in request.headers,
                )

@app.route("/contact/")
def contact():
    return render_template('contact.html',
                is_pjax = "X-PJAX" in request.headers,
                )

@app.route("/our-thinking/")
def blog():
    return render_template('blog.html',
                is_pjax = "X-PJAX" in request.headers,
                )

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file("favicon.ico")

@app.route("/robots.txt")
def robots():
    return app.send_static_file("robots.txt")

@app.route("/static/<directory>/<path:filepath>")
def static_versioned(directory, filepath):
    if filepath.find('.v') != -1:
        filepath = re.sub('\.v\d+', '', filepath)

    return app.send_static_file(directory+'/'+filepath)

@app.errorhandler(404)
def page_not_found(error):
    return 'nonono', 404