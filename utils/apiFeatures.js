class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        const excludedFields = ["sort", "page", "limit"];
        const queryObject = { ...this.queryString}
        
        excludedFields.forEach(field => delete queryObject[field]);

        this.query = this.query.find(queryObject);

        return this;
    }

    search(){
        if(this.queryString.s){
            const search = this.queryString.s;
            
            this.query = this.query.find({name: {$regex: search, $options: 'i'}}).sort("name");
        }

        return this;
    }

    sort(){
        if(this.queryString.sort){
            
        const sort_fields = this.queryString.sort.split(',').join(' ');
        
        this.query = this.query.sort(sort_fields);
        }else{
            this.query = this.query.sort("-createdAt");
        }

        return this;
    }

    paginate(){
        let { page=1, limit= 20 } = this.queryString;
        limit = parseInt(limit);
        page = parseInt(page);
        
        this.query = this.query.limit(limit).skip((page-1) * limit);

        return this;
    }
}

module.exports = APIFeatures;