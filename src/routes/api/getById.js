const crypto = require('crypto');
const { Fragment } = require('../../model/fragment');
const createErrorResponse = require('../../response').createErrorResponse;

module.exports = async (req, res) => {
    const id = req.params.id; // Assuming id is passed in the route path
    const user = crypto.createHash('sha256').update(req.user).digest('hex');
  
    const fragmentObject = await Fragment.byId(user, id);
  
    if (fragmentObject && fragmentObject.type === 'text/plain') {
        const dataResult = await fragmentObject.getData();
        if (dataResult) {
            res.setHeader('Content-Type', 'text/plain');
            res.status(200).send(dataResult);
        } else {
            createErrorResponse(
                res.status(415).json({
                    code: 415,
                    message: 'Error retrieving the data.',
                })
            );
        }
    } else {
        createErrorResponse(
            res.status(404).json({
                message: 'Not found id or not a plain text fragment.',
            })
        );
    }
};
