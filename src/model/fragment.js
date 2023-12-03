// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId) {
        throw new Error('Fragment missing ownerId!');
      }
      if (!type) {
        throw new Error('Fragment missing type!');
      }
      if (!Fragment.isSupportedType(type)) {
        throw new Error('Unsupported Fragment type!');
      }
      if (typeof size !== 'number' || size < 0) {
        throw new Error('Fragment size is invalid!');
      }
  
      this.id = id || randomUUID();
      this.ownerId = ownerId;
      this.created = created || new Date().toISOString()
      this.updated= updated ||  new Date().toISOString()
      this.type = type;
      this.size = size;

  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);
    
    // Check if fragments has data and return it, otherwise return an empty array
    return fragments && fragments.length ? fragments : [];
}

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id)
    if(!fragment)
    {
        throw new Error('Fragment not Found!')

    }
    const newFragment = new Fragment({
      id: fragment.id,
      ownerId: fragment.ownerId,
      created: fragment.created,
      updated: fragment.updated,
      type: fragment.type,
      size: fragment.size,
    })
    return Promise.resolve(newFragment)
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
   return deleteFragment(ownerId, id)
  }
  
  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated =  new Date().toISOString()
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId,this.id)
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
        throw new Error(`Data is not a Buffer!`);
    }
    
    this.updated =  new Date().toISOString()
    this.size = data.length; 
    return writeFragmentData(this.ownerId, this.id, data);
}

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // Define conversion options for Markdown to HTML
    const plainconvert= ['text/plain']
    const markdownToHtmlConversions = ['text/markdown', 'text/plain','text/html'];
  
    // Check if the MIME type is 'text/markdown'
    if(this.mimeType === 'text/plain')
    {
      return plainconvert
    }
   else if (this.mimeType === 'text/markdown') {
      // If so, return the available conversion types for Markdown (i.e., to HTML)
      return markdownToHtmlConversions;
    } else {
      // For all other MIME types, no conversions are supported at this time
      return []; // Return an empty array indicating no available conversions
    }
  }
  
 
  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    let validType = [
        'text/plain',
        'text/plain; charset=utf-8',
        'text/markdown',
        'text/html',
        'application/json',
        'image/png',
        'image/jpeg',
        'image/webp',
      ];
  //console.log("type is ", value)
      if(validType.includes(value))
      {
        
        return true
      }
      return false
  }
}

module.exports.Fragment = Fragment;