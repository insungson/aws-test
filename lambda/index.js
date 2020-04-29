const AWS = require('aws-sdk');
const Sharp = require('sharp');

const S3 = new AWS.S3({ region: 'us-east-2b' });

export.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  const filename = key.split('/')[key.split('/').length - 1];
  const ext = key.split('.')[key.split('.').length - 1];
  console.log(key, filename, ext);
  const requireFormat = ext === 'jpg' ? 'jpeg' : ext;
  try {
    const s3Object = await S3.getObject({
      Bucket,
      Key,
    }).promise();
    console.log('original', s3Object.Body.length);

    const resizedImage = await Sharp(s3Object)
      .resize(800, 800, {
        fit: 'inside',
      })
      .toFormat(requireFormat)
      .toBuffer();
    console.log('resize', resizedImage.length);

    await S3.putObject({
      Body: resizedImage,
      Bucket,
      Key: `thumb/${filename}`,
    }).promise();
    console.log('put');
    return callback(null, `thumb/${filename}`);
  } catch (e) {
   console.error(e);
   return callback(e); 
  }
}; 