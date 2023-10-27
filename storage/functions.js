const {getSignedUrl} = require("@aws-sdk/s3-request-presigner")
const { S3Client,GetObjectCommand } = require("@aws-sdk/client-s3")

module.exports.getUrl = async function (url){
  try{
  const command = new GetObjectCommand({
    Bucket:url.substring(8, url.indexOf('.')),
    Key:url.substring(url.lastIndexOf('/')+1)
  })
  const client = new S3Client({})
  return getSignedUrl(client, command);
}catch(err){
  console.error(err)
}
}