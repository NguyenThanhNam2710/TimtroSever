let express = require('express');
let hbs = require('express-handlebars');
let db = require('mongoose');
let multer = require('multer');
let body = require('body-parser');
let fs = require('fs');


let userSchema = require('./model/userSchema');
let postSchema = require('./model/postSchema');
let adminSchema = require('./model/adminSchema');

let User = db.model('User', userSchema, 'users');
let Admin = db.model('Admin', userSchema, 'admins');

db.connect('mongodb+srv://Nhom5qlda14351:quanlyduan123@cluster0-z9led.mongodb.net/TimtroDatabase?retryWrites=true&w=majority', {}).then(function (res) {
    console.log('conected');
})

let app = express();

let path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(body.json());
app.use(body.urlencoded({extended: true}));
app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: ''
}))
app.set('view engine', '.hbs')
app.listen(9090);


// phần kết nối sever với app
app.get('/getDL', async function (request, response) {
    response.render('getDL');
});


// nhận thông tin khách hàng để tạo tài khoản
app.post('/postUser', async function (request, response) {
    let nPhone = request.body.phone;
    let nFullName = request.body.fullname;
    let nPassword = request.body.password;
    let nPassword2 = request.body.password2;


    let newUser = new User({
        phone: nPhone,
        fullName: nFullName,
        password: nPassword,
        password2: nPassword2
    });
    let status = await newUser.save();
    if (status) {
        response.send(newUser)
    } else {
        response.send('Them thất bại.')
    }


});
// nhận thông tin giỏ hàng để thêm vào database
app.post('/postPost', async function (request, response) {
    let user = request.body.user;
    let productID = request.body.productID;
    let name = request.body.name;
    let price = request.body.price;
    let description = request.body.description;
    let type = request.body.type;
    let sl = request.body.sl;
    let image = request.body.image;


    let newCart = new Cart({
        user: user,
        productID: productID,
        name: name,
        price: price,
        image: image,
        description: description,
        type: type,
        sl: sl,
    });
    let status = await newCart.save();
    if (status) {
        response.send(newCart)
    } else {
        response.send('Them thất bại.')
    }


});

// trả về dữ liệu trong database
app.get('/getAlluser', async function (request, response) {
    let users = await User.find({});
    response.send(users);
});// đăng nhập
app.get('/getAllproduct', async function (request, response) {
    let products = await Product.find({});
    response.send(products);
});// tìm kiếm các bài đăng