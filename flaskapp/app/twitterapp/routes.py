from twitterapp import app
from flask import Flask, render_template, request, flash, session, redirect, url_for, Response
from models import db, User
from forms import SignupForm, SigninForm
from TwitterAPI import TwitterAPI
import json
#app = Flask(__name__)

print 'hello world'
user = ""

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


@app.route('/post/twitterdata')
def dataPost():
	
@app.route('/twitter')
def twit():
	return render_template('twit.html')

@app.route('/post/mzb', methods=['POST','GET'])
def mzbpost():
	values = json.loads(request.data)
	user = values['user']
	return _getTweets(user)



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

@app.route('/signin',methods=['GET','POST'])
def signin():
	form = SigninForm()

	if request.method == 'POST':
		if form.validate() == False:
			return render_template('signin.html', form=form)
		else:
			session['email'] = form.email.data
			return redirect(url_for('profile'))

	elif request.method == 'GET':
		return render_template('signin.html', form=form)

@app.route('/signout')
def signout():
	if 'email' not in session:
		return redirect(url_for('signin'))

	session.pop('email', None)
	return redirect(url_for('home'))

@app.route('/profile')
def profile():
	if 'email' not in session:
		return redirect(url_for('signin'))
	user = User.query.filter_by(email = session['email']).first()

	if user is None:
		return redirect(url_for('signin'))
	else:
		return render_template('profile.html')

@app.route('/getTweets')
def getTweets():
	return _getTweets(user)


def _getTweets(user):
	api = TwitterAPI("aiC1HsGnI81CrWQ78ejw","244t73B6eDybGbxPrqcxfXMjdfy3OBeqKndcnBakE5M","237561704-JIg6SthgLfZge8naa7Pun3ANpSo3r0BprtlrLFto","7FGLhL5UFW0F1RWRraF3HqPvY5cvhmOXMQt2FKjxC0")
	r = api.request('statuses/user_timeline', {'screen_name':user})
	tempList = []
	for item in r:
		tempObj = item['text']
		tempList.append(tempObj)
	return Response(json.dumps(tempList),  mimetype='application/json')


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
