from flask import Flask, request, render_template, abort
from flask.ext.cache import Cache
import re
import os

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
app.app_cache = cache

env = os.getenv('mm_env', 'production')
if env == 'dev':
    app.debug = True

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


@cache.memoize(50)
@app.template_filter()
def timestamped(file_path):
    full_path = os.path.join(app.static_folder, file_path.replace('/static/',
        ''))
    mtime = int(os.path.getmtime(full_path))
    path_parts = os.path.split(file_path)
    f_parts = path_parts[-1].split('.')
    filename = ".".join(f_parts[0:-1])
    ext = f_parts[-1]

    return "%s/%s.v%s.%s" % (path_parts[0], filename, mtime, ext)


@app.route("/")
def hello():
    return render_template('index.html',
                is_pjax="X-PJAX" in request.headers,
                )


@app.route("/work/<client>/")
def work_client(client):
    def find_client(url):
        for idx, c in enumerate(clients):
            if c['url'] == url:
                next_idx = (idx + 1) % len(clients)
                return (
                    c,
                    {
                        'next': clients[next_idx],
                        'prev': clients[idx - 1],
                    }
                )

    (found_client, prev_next) = find_client(client)
    if not found_client:
        abort(404)
        return

    return render_template(os.path.join('work', found_client['template']),
                is_pjax="X-PJAX" in request.headers,
                prev_next=prev_next,
                )


@app.route("/work/")
def work():
    return render_template('work.html',
                clients=clients,
                is_pjax="X-PJAX" in request.headers,
                )


@app.route("/services/")
def services():
    return render_template('services.html',
        is_pjax="X-PJAX" in request.headers)


@app.route("/about/")
def about():
    return render_template('about.html',
        is_pjax="X-PJAX" in request.headers)


@app.route("/contact/")
def contact():
    return render_template('contact.html',
        is_pjax="X-PJAX" in request.headers)


@app.route("/our-thinking/")
def blog():
    return render_template('blog.html',
        is_pjax="X-PJAX" in request.headers)


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

    return app.send_static_file(directory + '/' + filepath)


@app.route('/sitemap.xml')
def sitemap():
    # url_root = request.url_root[:-1]
    url_root = 'http://mathematicinc.com'

    rules = [
        {
            'url': '/',
            'changefreq': 'weekly',
            'priority': '1',
        },
        {
            'url': '/work/',
            'changefreq': 'weekly',
            'priority': '0.9',
        },
        {
            'url': '/services/',
            'changefreq': 'weekly',
            'priority': '0.6',
        },
        {
            'url': '/about/',
            'changefreq': 'weekly',
            'priority': '0.6',
        },
        {
            'url': '/contact/',
            'changefreq': 'weekly',
            'priority': '0.6',
        },
    ]
    for c in clients:
        rules.append({
            'url': '/work/%s/' % c['url'],
            'changefreq': 'weekly',
            'priority': '0.5',
        })

    return render_template('sitemap.xml',
        url_root=url_root,
        rules=rules,
    )


@app.errorhandler(404)
def page_not_found(error):
    return 'nonono', 404
