from twitterapp import app
from flask import Flask, render_template, request, flash, session, redirect, url_for
from models import db, User
from forms import SignupForm
import json
#app = Flask(__name__)

print 'hello world'

@app.route('/')
def index():
	return render_template('layout.html')

@app.route('/testdb')
def testdb():
	if db.session.query("1").from_statement("SELECT 1").all():
		return 'It works.'
	else:
		return 'Something is broken.'
@app.route('/home')
def home():
	return render_template('home.html')

# @app.route('/get/users')
# def getUsers():
# 	return db.session.query

@app.route('/signup', methods=['GET', 'POST'])
def signup():
	form = SignupForm()

	if request.method == 'POST':
		if form.validate() == False:
			return render_template('signup.html', form=form)
		else:   
			newuser = User(form.firstname.data, form.lastname.data, form.email.data, form.password.data)

     		db.session.add(newuser)
      		db.session.commit()
       		session['email'] = newuser.email
       		return redirect(url_for('profile'))

	elif request.method == 'GET':
		return render_template('signup.html', form=form)

@app.route('/profile')
def profile():
	if 'email' not in session:
		return redirect(url_for('signin'))
	user = User.query.filter_by(email = session['email']).first()

	if user is None:
		return redirect(url_for('signin'))
	else:
		return render_template('profile.html')

# @app.route('/post/user',methods=['POST','GET'])
# def saveuser():
# 	data = json.loads(request.data)
# 	firstname = data['firstname']
# 	lastname = data['lastname']
# 	email = data['email']
# 	password = data['password']
# 	newuser = User(firstname,lastname,email,password)

# 	db.session.add(newuser)
# 	db.session.commit()
# 	return home()
