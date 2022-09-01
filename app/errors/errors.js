class ClientError extends Error{
    constructor(message,code){
        super(message);
        this.code=code || 400;
    }
}

class ServerError extends Error{
    constructor(message,code){
        super(message);
        this.code=code || 500;
    }
}

module.exports={
    ServerError,
    ClientError
}

