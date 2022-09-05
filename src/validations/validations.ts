import Joi from 'joi'

const userSchema=Joi.object({
    username:Joi.string().alphanum().min(2).max(50).required(),
    email:Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    age:Joi.number().max(130).min(15).required(),
    profession:Joi.string().allow('').allow(null),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})


const postSchema=Joi.object({
    userId:Joi.number().required(),
    imagePath:Joi.string().allow('').allow(null),
    imageDescription:Joi.string().when('imagePath',{is:null,then:Joi.string().required()}).when('imagePath',
    {is:'',then:Joi.string().required()}).when('imagePath',{is:Joi.string(),then:Joi.string().allow('').allow(null)}),
    loggedUser:Joi.string().allow('').allow(null)
})

const friendSchema=Joi.object({
    userId:Joi.number().required(),
    friendId:Joi.number().required()
});

const reactionSchema=Joi.object({
    userId:Joi.number().required(),
    postId:Joi.number().required(),
    reactionType:Joi.string().valid('text','vote','emoji').required(),
    reactionData:Joi.string().when('reactionType',{is:'text',then:Joi.string().required()})
    .when('reactionType',{is:'vote',then:Joi.string().valid('like','dislike')})
    .when('reactionType',{is:"emoji",then:Joi.string().required()}),
    parentId:Joi.number().allow(null).allow('')
})

export{userSchema,postSchema,friendSchema,reactionSchema};