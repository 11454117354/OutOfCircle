from flask import Flask, session
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    hash = db.Column(db.String(80), unique=True)

    def __repr__(self):
        return f"User(username = {self.username}, hash = {self.hash})"
    
user_args = reqparse.RequestParser()
user_args.add_argument('username', type=str, required=True, help="Username cannot be blank")
user_args.add_argument('password', type=str, required=True, help="Password cannot be blank")
user_args.add_argument('password_confirm', type=str, required=True, help="Confirm cannot be blank")

userFields = {
    'id':fields.Integer,
    'username':fields.String,
}

class Register(Resource):
    @marshal_with(userFields)
    def post(self):
        # register
        args = user_args.parse_args()
        if args['password'] != args['password_confirm']:
            abort(403, message="Confirmation failed!")
        user = UserModel(username=args["username"], hash=generate_password_hash(args["password"]))
        db.session.add(user)
        db.session.commit()
        return user, 201
    
login_args = reqparse.RequestParser()
login_args.add_argument('username', type=str, required=True)
login_args.add_argument('password', type=str, required=True)

class Login(Resource):
    def post(self):
        # login
        args = login_args.parse_args()
        user = UserModel.query.filter_by(username=args['username']).first()
        if not user or not check_password_hash(user.hash, args['password']):
            abort(401, message="Invalid username or password")
        
        session['user_id'] = user.id
        return {"message": "Logged in successfully"}, 200
    
class Me(Resource):
    @marshal_with(userFields)
    def get(self):
        # Get user info
        user_id = session.get('user_id')
        if not user_id:
            abort(401, message="Not logged in")        
        user = UserModel.query.get(user_id)
        return user
    
class Logout(Resource):
    def post(self):
        # logout
        user_id = session.get('user_id')
        if not user_id:
            abort(401, message="Not logged in")
        session.pop("user_id", None)
        return {"message": "Logged out successfully"}, 200

api.add_resource(Register, '/api/register/')
api.add_resource(Login, '/api/login/')
api.add_resource(Me, '/api/me/')
api.add_resource(Logout, '/api/logout/')

if __name__ == '__main__':
    app.run(debug=True)