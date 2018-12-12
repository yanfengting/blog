var express = require('express');
var md5 = require('md5');
var router = express.Router();

var db = require('../modules/db');

router.get('/account/checkEmail', function (req, res) {
  var email = req.query.email;
  if (!email) {
    res.send(false);
    return;
  }
  db.userModel.find({
    email
  }, function (err, result) {
    if (err) {
      console.log(err);
      res.send(false);
      return;
    }
    if (result.length > 0) {
      res.send(false);
      return;
    }
    res.send(true);
  })
})

router.get('/account/checkPhoneNum', function (req, res) {
  var phoneNum = req.query.phoneNum;
  if (!phoneNum) {
    res.send(false);
    return;
  }
  db.userModel.find({
    phone: phoneNum
  }, function (err, result) {
    if (err) {
      console.log(err);
      res.send(false);
      return;
    }
    if (result.length > 0) {
      res.send(false);
      return;
    }
    res.send(true);
  })
})

router.get('/account/checkLoginName', function (req, res) {
  var loginName = req.query.loginName;
  if (!loginName) {
    res.send(false);
    return;
  }
  db.userModel.find({
    loginName
  }, function (err, result) {
    if (err) {
      console.log(err);
      res.send(false);
      return;
    }
    if (result.length > 0) {
      res.send(false);
      return;
    }
    res.send(true);
  })
})

router.get('/account/checkDisplayName', function (req, res) {
  var displayName = req.query.displayName;
  if (!displayName) {
    res.send(false);
    return;
  }
  db.userModel.find({
    nickname: displayName
  }, function (err, result) {
    if (err) {
      console.log(err);
      res.send(false);
      return;
    }
    if (result.length > 0) {
      res.send(false);
      return;
    }
    res.send(true);
  })
})

router.post('/register', function (req, res) {
  var email = req.body.email;
  var phoneNum = req.body.phoneNum;
  var loginName = req.body.loginName;
  var displayName = req.body.displayName;
  var password = req.body.password;
  if (!email || !phoneNum || !loginName || !displayName || !password) {
    res.json({
      code: 201,
      message: '参数错误'
    })
    return;
  }
  var query = {
    $or: [{
        email
      },
      {
        phone: phoneNum
      },
      {
        loginName
      },
      {
        nickname: displayName
      }
    ]
  }
  db.userModel.find(query, function (err, result) {
    if (err) {
      console.log(err)
      res.json({
        code: 201,
        message: '未知错误，请联系管理员'
      })
      return;
    }

    if (result.length > 0) {
      console.log(err)
      res.json({
        code: 201,
        message: '数据重复，请重新验证数据'
      })
      return;
    }

    db.userModel.insertMany({
      email: req.body.email,
      phone: req.body.phoneNum,
      loginName: req.body.loginName,
      nickname: req.body.displayName,
      password: md5(req.body.password),
    }, function (err, result2) {
      if (err) {
        console.log(err)
        res.json({
          code: 201,
          message: '未知错误，请联系管理员'
        })
        return;
      }
      res.json({
        code: 200,
        message: '注册成功'
      });
    })
  })
})

router.post('/login', function (req, res) {
  var loginName = req.body.loginName;
  var password = req.body.password;
  var remember = req.body.remember;
  if (!loginName || !password) {
    res.json({
      code: 201,
      message: '参数错误'
    })
    return;
  }
  var query = {
    loginName,
    password: md5(password)
  }
  db.userModel.find(query, function (err, result) {
    if (err) {
      console.log(err)
      res.json({
        code: 201,
        message: '未知错误，请联系管理员'
      })
      return;
    }
    if (result.length == 0) {
      res.json({
        code: 201,
        message: '用户名或密码有误'
      })
      return;
    }
    if (result.length > 1) {
      res.json({
        code: 201,
        message: '有重复数据，请联系管理员'
      })
      return;
    }
    var user = {
      email: result[0].email,
      phone: result[0].phone,
      loginName: result[0].loginName,
      nickname: result[0].nickname,
    };
    req.session.user = user;
    req.session.save();
    res.cookie('user', JSON.stringify(user));
    res.json({
      code: 200,
      message: '登录成功'
    });
  })
})

router.post('/logout', function(req, res){
  req.session.user = null;
  res.clearCookie('user');
  res.json({ code: 200, message: "注销成功！" });
})

module.exports = router;