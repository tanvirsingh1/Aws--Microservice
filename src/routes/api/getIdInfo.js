const { Fragment } = require('../../model/fragment');
const {createErrorResponse, createSuccessResponse} = require('../../response');

module.exports = async (req, res) => {


    try{
       const frag_id= req.params.id
        const fragment = await Fragment.byId(req.user, frag_id)

        createSuccessResponse(
            res.status(200).json({
                status: 'ok',
                fragment: fragment
            })
        )

    }catch(err){
         createErrorResponse(
            res.status(404).json({
                message: "Fragment not Found",
            })
        );
    }

}