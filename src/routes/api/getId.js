const { Fragment } = require('../../model/fragment');
const {createErrorResponse, createSuccessResponse} = require('../../response');
const md  = require('markdown-it')();
//const sharp = require('sharp');
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

   
try{
    var format=null;
    const fragment_data = await Fragment.byId(user, id);
    let type = fragment_data.mimeType
    if(extension === "html")
    {
        format = "text/html" 
    }
    else if(extension === "txt")
    {
        format = "text/plain"
    }
    else if( extension == "png")
    {
        format = "image/png"
    }else if (extension === "jpg") {
        format = "image/jpeg";
    } else if (extension === "webp") {
        format = "image/webp";
    } else if (extension === "gif") {
        format = "image/gif";
    }
    else if(("text"+extension) === type )
    {
        format = type
    }
  
    else if(extension)
    {
        format = "invalid"
    }
    if((!fragment_data.formats.includes(format) && format != null) )
    {
        return createErrorResponse(
            res.status(415).json({
                message: "Invalid type conversion",
            })
        );
    }

    else{

        try{
            if (extension === 'html' && fragment_data.mimeType === 'text/markdown') {
                type = 'text/html';  // Set the content type to HTML if markdown needs to be converted
              }
              else if(extension === "jpg" &&  fragment_data.mimeType === 'image/png' )
              {
                type = 'image/jpeg';
              }
        const dataResult = await fragment_data.getData();
  
        const data=  convertData(dataResult, type);
    
            res.setHeader('Content-Type', type);
            return createSuccessResponse(res.status(200).send(data));
     } catch(err) {
            return createErrorResponse(
                res.status(500).json({
                    code: 500,
                    message: 'No data Found',
                })
            );
        }
    }
} catch(err){
    return createErrorResponse(
        res.status(404).json({
            message: "Fragment not Found",
        })
    );
}

};    
function convertData(data, contentType) {
   
    if (contentType === 'text/html') {
      return md.render(data.toString());
    } 
    else if(contentType === 'text/plain')
    {
        return data.toString()
    }
    // else if (contentType === 'image/png') {
    //     return sharp(data).toFormat('png');
    //   } else if (contentType === 'image/jpeg') {
    //     return sharp(data).toFormat('jpeg');
    //   } else if (contentType === 'image/gif') {
    //     return sharp(data).toFormat('gif');
    //   } else if (contentType === 'image/webp') {
    //     return sharp(data).toFormat('webp');
    //   }
    else {
      // For all other types, return the data as is
      return data;
    }
  }
  