const { Fragment } = require('../../model/fragment');


const { createSuccessResponse , createErrorResponse} = require('../../response');



module.exports = async (req, res) => {
 let frag_id =req.params.id; 
 
 try{
    const fragment = await Fragment.byId(req.user, frag_id)

  const  type = fragment.type
    const updatetype = req.get('Content-type')
    if(type === updatetype)
    {
            await fragment.setData(req.body)
            res.status(200).json(
                createSuccessResponse({
                  status: 'ok',
                  fragment: fragment,
                })
              );
            
       
    }
    else{
        res
        .status(400)
        .json(createErrorResponse(400, {message: "A fragment's type can not be changed after it is created"}));
    }
    }catch(err)
    {
        return createErrorResponse(
            res.status(404).json({
                message: "Fragment not Found",
            })
        );
    }
}
 
    