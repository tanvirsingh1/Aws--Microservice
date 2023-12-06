// const { Fragment } = require('../../model/fragment');
// const {createErrorResponse, createSuccessResponse} = require('../../response');
// const md  = require('markdown-it')();
// const sharp = require('sharp');
// module.exports = async (req, res) => {
//     let id = req.params.id; 
//     const user = req.user;

//     const Id = id.split('.');
//     id = Id[0];
//     var extension;
//     if (Id.length > 1) {
//         extension = Id[1];
//     } else {
//         extension = null;
//     }

   
// try{
//     var format=null;
//     const fragment_data = await Fragment.byId(user, id);
//     let type = fragment_data.mimeType
//     if(extension === "html")
//     {
//         format = "text/html" 
//     }
//     else if(extension === "txt")
//     {
//         format = "text/plain";
//     }
//     else if( extension == "png")
//     {
//         format = "image/png";
//     }else if (extension === "jpg") {
//         format = "image/jpeg";
//     } else if (extension === "webp") {
//         format = "image/webp";
//     } else if (extension === "gif") {
//         format = "image/gif";
//     }
//     else if(("text"+extension) === type )
//     {
//         format = type
//     }
  
//     else if(extension)
//     {
//         format = "invalid"
//     }
//     if((!fragment_data.formats.includes(format) && format != null) )
//     {
//         return createErrorResponse(
//             res.status(415).json({
//                 message: "Invalid type conversion",
//             })
//         );
//     }
    
//     else{

//         try{
//             if (extension === 'html' && fragment_data.mimeType === 'text/markdown') {
//                 type = 'text/html';  // Set the content type to HTML if markdown needs to be converted
//               }
//               else if(extension === "jpg" &&  fragment_data.mimeType === 'image/png' )
//               {
//                 type = 'image/jpeg';
//               }
//         const dataResult = await fragment_data.getData();
  
//         const data=  convertData(dataResult, type);
    
//             res.setHeader('Content-Type', type);
//             return createSuccessResponse(res.status(200).send(data));
//      } catch(err) {
//             return createErrorResponse(
//                 res.status(500).json({
//                     code: 500,
//                     message: 'No data Found',
//                 })
//             );
//         }
//     }
// } catch(err){
//     return createErrorResponse(
//         res.status(404).json({
//             message: "Fragment not Found",
//         })
//     );
// }

// };    
// function convertData(data, contentType) {
   
//     if (contentType === 'text/html') {
//       return md.render(data.toString());
//     } 
//     else if(contentType === 'text/plain')
//     {
//         return data.toString()
//     }
//     else if (contentType === 'image/png') {
//         return sharp(data).toFormat('png');
//       } else if (contentType === 'image/jpeg') {
//         return sharp(data).toFormat('jpeg');
//       } else if (contentType === 'image/gif') {
//         return sharp(data).toFormat('gif');
//       } else if (contentType === 'image/webp') {
//         return sharp(data).toFormat('webp');
//       }
//     else {
//       For all other types, return the data as is
//       return data;
//     }
//   }
const { Fragment } = require('../../model/fragment');
const { createErrorResponse, createSuccessResponse } = require('../../response');
const md = require('markdown-it')();
const sharp = require('sharp');

module.exports = async (req, res) => {
    try {
        const id = req.params.id.split('.')[0];
        const user = req.user;
        const fragment_data = await Fragment.byId(user, id);

        const extension = req.params.id.split('.')[1];
        const format = getContentType(extension, fragment_data.mimeType);

        if (!fragment_data.formats.includes(format)) {
            return createErrorResponse(
                res.status(415).json({
                    message: "Invalid type conversion",
                })
            );
        }

        const dataResult = await fragment_data.getData();
        let dataToSend = dataResult;

        if (isValidConversion(extension)) {
            try{
            dataToSend = await  convertData(dataResult, format);
            }catch(err) {
                return createErrorResponse(
                    res.status(500).json({
                        code: 500,
                        message: 'No data Found',
                    })
                );
            }
        } 

        res.setHeader('Content-Type', format);
        return createSuccessResponse(res.status(200).send(dataToSend));
    } catch (err) {
        
            return createErrorResponse(
                res.status(404).json({
                    code: 404,
                    message: 'No data Found',
                })
            );
        
    }
};

function getContentType(extension, mimeType) {
    
    const extensionToContentType = {
        'txt': 'text/plain',
        'md': 'text/markdown',
        'html': 'text/html',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'webp': 'image/webp',
        'gif': 'image/gif',

    };
    if (extension && !Object.prototype.hasOwnProperty.call(extensionToContentType, extension)) {
        return 'Invalid';
    }

    // Check if the extension is valid, otherwise, use the provided MIME type
    return extensionToContentType[extension] || mimeType;
}

function isValidConversion(extension) {
    const validExtensions = ['txt', 'md', 'html', 'json', 'png', 'jpg', 'webp', 'gif'];
    return validExtensions.includes(extension);
}

async function  convertData(data, contentType) {
    if (contentType === 'text/html') {
        return md.render(data.toString());
    }else if (contentType === 'image/png') {
        return await sharp(data).png().toBuffer();
              } else if (contentType === 'image/jpeg') {
                return await sharp(data).jpeg().toBuffer();
              } else if (contentType === 'image/gif') {
                return await sharp(data).gif().toBuffer();
              } else if (contentType === 'image/webp') {
                return await sharp(data).webp().toBuffer();
              }
     else {
        // For text/plain and other types, return the data as is
        return data;
     }
}
