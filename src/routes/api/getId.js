const { Fragment } = require('../../model/fragment');
const {createErrorResponse, createSuccessResponse} = require('../../response');

module.exports = async (req, res) => {
    let id = req.params.id; 
    const user = req.user;

    const Id = id.split('.');
    id = Id[0];
    var extension;
    if (Id.length > 1) {
        extension = Id[1];
    } else {
        extension = null;
    }

    if (extension && extension !== 'txt') {
        return createErrorResponse(
            res.status(415).json({
                message: 'Unsupported Media type, Only (text/plain) is supported[use .txt]',
            })
        );
    }
try{
    const fragment_data = await Fragment.byId(user, id);
        try{
        const dataResult = await fragment_data.getData();
            res.setHeader('Content-Type', 'text/plain');
            return createSuccessResponse(res.status(200).send(dataResult));
     } catch(err) {
            return createErrorResponse(
                res.status(500).json({
                    code: 500,
                    message: 'No data Found',
                })
            );
        }
    
} catch(err){
    return createErrorResponse(
        res.status(404).json({
            message: "Fragment not Found",
        })
    );
}
};
