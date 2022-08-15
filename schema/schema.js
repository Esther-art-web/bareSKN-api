const graphql = require('graphql');
const {GraphQLSchema, GraphQLObjectType, GraphQLString} = graphql;
const _ = require("lodash");

const collections =[
    {key: 1, name: "Collection test 1", desc: "This is test 1"},
    {key: 2, name: "Collection test 2", desc: "This is test 2"},
    {key: 3, name: "Collection test 3", desc: "This is test 3"}
]

const CollectionType = new GraphQLObjectType({
    name: "Collection",
    fields:() => ({
        _id: {type: GraphQLString},
        key: {type: GraphQLString},
        name: {type: GraphQLString},
        image_link: {type: GraphQLString}
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        collection: {
            type: CollectionType,
            args: {key: {type: GraphQLString}},
            resolve(parent, args){
                // code to get data from db
                // _find{collections, {key: args.key}}
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})