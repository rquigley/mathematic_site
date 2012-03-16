from flask import Flask, request, render_template
from utility import slugify, friendly_time, timestamped

app = Flask(__name__)
app.debug = True

app.jinja_env.filters['timestamped'] = timestamped


@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/work/")
def work():
    return render_template('work.html')

@app.route("/services/")
def services():
    return render_template('services.html')

@app.route("/about/")
def about():
    return render_template('about.html')

@app.route("/contact/")
def contact():
    return render_template('contact.html')

@app.route("/our-thinking/")
def blog():
    return render_template('blog.html')
