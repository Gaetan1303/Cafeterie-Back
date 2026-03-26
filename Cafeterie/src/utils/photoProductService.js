const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class PhotoProductService {
  constructor(uploadDir = path.join(__dirname, '../uploads/products')) {
    this.uploadDir = uploadDir;
  }

  ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  decodeDataUri(imageBase64) {
    const match = imageBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/i);
    if (!match) {
      throw new Error('Unsupported image format. Use PNG or JPG/JPEG data URI');
    }

    const ext = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
    const buffer = Buffer.from(match[2], 'base64');
    return { buffer, ext };
  }

  persistImage(imageBase64) {
    this.ensureUploadDir();

    const { buffer, ext } = this.decodeDataUri(imageBase64);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const filename = `${hash}.${ext}`;
    const absolutePath = path.join(this.uploadDir, filename);

    if (!fs.existsSync(absolutePath)) {
      fs.writeFileSync(absolutePath, buffer);
    }

    return {
      hash,
      filename,
      relativePath: `/uploads/products/${filename}`
    };
  }
}

module.exports = PhotoProductService;
