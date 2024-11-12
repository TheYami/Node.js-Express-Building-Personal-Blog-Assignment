export const validateCreatePostData = (req,res,next) => {
    if(typeof req.body.title !== 'string'){
        return res.status(404).json({"message":"Title must be a string"})
    }

    if(typeof req.body.image !== 'string'){
        return res.status(404).json({"message":"Image must be a string"})
    }

    if(typeof req.body.category_id !== 'number'){
        return res.status(404).json({"message":"CategotyId must be a number"})
    }

    if(typeof req.body.description !== 'string'){
        return res.status(404).json({"message":"Description must be a string"})
    }

    if(typeof req.body.content !== 'string'){
        return res.status(404).json({"message":"Content must be a string"})
    }

    if(typeof req.body.status_id !== 'number'){
        return res.status(404).json({"message":"StatusId must be a number"})
    }

    if(req.body.title === ""){
        return res.status(404).json({"message":"Title is required"})
    }

    if(req.body.category_id === ""){
        return res.status(404).json({"message":"CategoryId is required"})
    }

    if(req.body.content === ""){
        return res.status(404).json({"message":"Contebt is required"})
    }

    if(req.body.status_id === ""){
        return res.status(404).json({"message":"StatusId is required"})
    }

    if(req.body.description === ""){
        return res.status(404).json({"message":"Description is required"})
    }

    if(req.body.image === ""){
        return res.status(404).json({"message":"Image is required"})
    }


    next()
}
