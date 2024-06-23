from flask import Flask,jsonify,request,send_from_directory,session
from flask_cors import CORS,cross_origin
from sql2 import *
#下面這兩個是處理圖片儲存的
from werkzeug.utils import secure_filename #  UploadSet, configure_uploads, IMAGES 仰賴於secure_filename，防止檔名中有特殊字元
from flask_uploads import UploadSet, configure_uploads, IMAGES
#Flask-Uploads的PyPi包从2020年2月起就被破坏了。 改 install Flask-Reuploaded 
import os

app =Flask(__name__)
app.secret_key = '1234'
CORS(app)

photos = UploadSet('photos',IMAGES) # 創建一個名為 photos 的上傳集合，用來管理圖片上傳。
app.config['UPLOADED_PHOTOS_DEST'] = 'uploads' # 設置上傳文件保存的目錄為 uploads。
configure_uploads(app, photos) #將上傳集合 photos 配置到 Flask 應用中。


@app.route('/')
def home():
    return "Backend"

# ============= Owner ==============
@app.route('/owner/all',methods=['GET'])
def Get_Owner_All():
    data = Owner.Get_Owner_All()
    return data

@app.route('/signUp',methods=['POST'])
def sign_up():
    name = request.json.get('name') # fetch the name from the <form/> in the frontend
    password = request.json.get('password') # fetch the password from the <form/> in the frontend
    gender = request.json.get('gender') # fetch the gender from the <form/> in the frontend

    # check if the name and password are correct
    if not name or not password or not gender:
        return jsonify({'error': 'Please provide name, password, and gender'}), 400

    if len(name) > 50 or len(password) > 50:
        return jsonify({'error': 'Name or password is too long'}), 400
    
    # check if the name already exists
    SignUp_User = Owner.Get_Owner_by_name(name)
    if SignUp_User:
        return jsonify({'error': 'Name already exists'}), 400
    # Owner.get_Owner_by_name(name) 實際上返回的是數據庫查詢的結果。
    #如果數據庫中存在與傳入的 name 匹配的記錄，它會返回該記錄；
    #否則返回 None。在我們的邏輯中，existing_user 如果是 None 表示用戶名不存在，
    #如果不是 None 表示用戶名已存在。

    #success✨
    Owner.save_Owner_data(name,password,gender)
    return jsonify({'message': 'Sign up successful'}),200

@app.route('/login',methods=['POST'])
def login():
    name = request.json.get('name')
    passwowd = request.json.get('password')

    if not name or not passwowd:
        return jsonify({'error': 'Please provide name and password'}), 400

    user = Owner.login_Owner(name,passwowd)
    print(user)
    if user:
        return jsonify({'message': 'Login successful','name': user['name'], 'oId': user['oId']}),200
    else:
        return jsonify({'error': 'Invalid name or password,please try again'}), 400
    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/owner/<pId>',methods=['GET'])
def GetOwnerById(pId):
    data = Owner.Get_Owner_by_id(pId)
    if data:
        return data
    else:
        return jsonify({'error': 'Owner not found'})

# ============= PET ==============
@app.route('/addPet',methods=['POST'])
def addPet():
    name = request.form.get('name')
    age = request.form.get('age')
    variety = request.form.get('variety')
    info = request.form.get('info')
    image = request.files.get('image')
    
    if not name or not age or not variety or not info or not image:
        return jsonify({'error': 'Please provide name, age, and variety, info, image'}), 400
    
    # if len(name) > 50 or len(variety) > 50 or len(info) > 200:
    #     return jsonify({'error': 'Name or variety is too long'}), 400
    
    
    # 上傳圖片處理    
    fileName = photos.save(image)
    image_path = os.path.join(app.config['UPLOADED_PHOTOS_DEST'], fileName)


        
    pet = Pet.save_Pet_data(name,age,variety,info,image_path)
    if pet:
        print(name,age,variety,info,image_path)
        return jsonify({'message': 'Pet added successfully!!!'}), 200
    else:
        return jsonify({'error': 'Failed to add pet'}), 400

@app.route('/allPets',methods=['GET'])
def allPet():
    allPets = Pet.Get_Pet_data()
    response = jsonify(allPets)
    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    
    return response

@app.route('/currentPet/<pId>',methods=['GET'])
def Get_Current_Pet(pId):
    data = Pet.Get_Data_by_id(pId)
    
    return data

# ============= ADOPT ==============
@app.route('/adoptedPet',methods=['POST'])
def adoptPet():
    id = request.json.get('id')
    user_id = request.json.get('userId')

    AdoptUpdate = Pet.Update_Owner(id,user_id)
    if AdoptUpdate:
        print(id,user_id)
        return jsonify({"message": "Pet adoption successful!"}), 200
    else:
        return jsonify({"error": "Failed to adopt pet"}), 400

@app.route('/petList/<ownerId>',methods=['GET'])
def PetList(ownerId):
    allPet = Pet.Get_User_Pet(ownerId)

    return jsonify(allPet)

# ============= COMMENTS ==============
@app.route('/saveComment',methods=['POST'])
def saveComment():
    oId =request.json.get('userId')
    pId =request.json.get('morePid')
    comment =request.json.get('comment')

    SaveToDB = Comments.save_comment_data(oId,pId,comment)

    if SaveToDB:
        # print(oId,pId,comment)
        return jsonify({'message': 'Comment added successfully!!!','success': True}), 200
    else:
        return jsonify({'error': 'Failed to add comment'}), 400

@app.route('/getComment/<pId>',methods=['GET'])
def getComment(pId):
    data = Comments.get_comment_data(pId)
    # print(data)

    return data

# ============= LOGOUT ==============
@app.route('/logout',methods=['POST'])
def logout():
    session.pop('userId', None)
    session.pop('userName', None)
    session.pop('morePid', None)
    print("logout!!")
    return jsonify({'message': 'Logout successful'}), 200

# ============= BACK ==============
@app.route('/back',methods=['POST'])
def back():
    session.pop('morePid', None)
    print("pop out morePid!")
    return jsonify({'message': 'Back successful'}), 200



if __name__ == '__main__':
    Database.init_connection_pool(
        host="",
        user="",
        password="",
        database=""
        )
    app.run(debug=True) # DB connection