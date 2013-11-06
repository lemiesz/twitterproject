from flask import Flask

app = Flask(__name__)

import twitterapp.routes

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/twitter'

from models import db
db.init_app(app)
