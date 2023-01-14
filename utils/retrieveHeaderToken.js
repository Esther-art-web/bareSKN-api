exports.get_token_from_header =(header, next) => {
    if("authorization" in header){
        const header_parts = header['authorization'].split(' ');
        if(header_parts.length === 2){
            if(header_parts[0] === "Bearer"){
                return header_parts[1]
            }else{
                let err = new Error();
                err.error = "bad request";
                next(err);
            }
        }else{
            let err = new Error();
            err.error = "bad request";
            next(err);
        }
    }else{
        let err = new Error();
        err.error = "unauthenticated";
        next(err);
    }
}
