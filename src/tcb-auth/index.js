// 云函数入口文件
const cloud = require('wx-server-sdk');
const jwt = require('jsonwebtoken');

cloud.init();

const secretOrPublicKey = 'asdfadfadfa';

// 云函数入口函数
exports.main = async (event = {}) => {
    console.log(event);
    const { action, token, data } = event;
    let result;

    switch (action) {
        case 'login':
            result = await login(data);
            break;
        case 'verify':
            result = await verify(token);
            break;
        default:
            result = ERRORS.INVALID_ACTION;
            break;
    }

    return result;
};

function login(info = {}) {
    const wxContext = cloud.getWXContext();
    const { encryptedData, iv, userInfo } = info;

    // 登陆的正确做法:
    // TODO 换取 access_token 然后从 encryptedData 解出用户信息, 比对 openId, 匹配的话就合法
    // 这里就简单的获取昵称和头像

    if (wxContext && wxContext.OPENID && wxContext.APPID) {
        const token = jwt.sign(
            {
                openId: wxContext.OPENID,
                nickName: userInfo.nickName,
                avatarUrl: userInfo.avatarUrl,
                unionId: wxContext.UNIONID
            },
            secretOrPublicKey,
            { expiresIn: 7 * 24 * 60 * 60 }
        ); // 有效期 7 天

        return {
            data: {
                token,
                openId: wxContext.OPENID
            }
        };
    } else {
        return ERRORS.INVALID_CONTEXT;
    }
}

function verify(token) {
    let result;
    let message;

    if (token) {
        try {
            result = jwt.verify(token, secretOrPublicKey);
        } catch (e) {
            console.error(e);
            switch (e.name) {
                case 'TokenExpiredError':
                    message = 'Token expired';
                    break;
            }
            result = ERRORS.INVALID_TOKEN;
        }
        if (message) {
            result.message = message;
        }
    } else {
        result = {
            ...ERRORS.INVALID_TOKEN,
            message: 'Token missing'
        };
    }
    return result;
}

const ERRORS = {
    INVALID_TOKEN: {
        code: 'INVALID_TOKEN',
        message: 'Verify login failed'
    },
    INVALID_CONTEXT: {
        code: 'INVALID_CONTEXT',
        message: 'Please invoke via `tcb.callFunction`'
    },
    INVALID_ACTION: {
        code: 'INVALID_ACTION'
    }
};
