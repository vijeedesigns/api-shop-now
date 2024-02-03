const response200 = (res, message, extraParams={}) => {
    res.json({
        data: {
            status: 200,
            success: true,
            error: null,
            message,
            ...extraParams
        }
    });
}

const response401 = (res, message) => {
    res.json({
        data: {
            status: 401,
            success: false,
            error: '401 Unauthorized',
            message
        }
    });
}

const response403 = (res, message) => {
    res.json({
        data: {
            status: 403,
            success: false,
            error: '403 Forbidden',
            message
        }
    });
}

const response500 = (res, message) => {
    res.json({
        data: {
            status: 500,
            success: false,
            error: '500 Error',
            message
        }
    });
}

module.exports = { response200, response401, response403, response500 }