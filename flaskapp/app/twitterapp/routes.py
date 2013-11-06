from twitterapp import app
from flask import Flask,render_template, request, flash

app = Flask(__name__)

@app.route('/')
def home():
  return render_template('home.html')

@app.route('/testdb')
def testdb():
   if db.session.query("1").from_statement("SELECT 1").all():
      return 'it works'
   else:
      return 'Something is broke'	

if __name__ == '__main__':
   app.run(debug=True)
