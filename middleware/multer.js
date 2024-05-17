import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

import { bucket } from "../config.js";

const MulterMiddleware = multer({
  storage: multerS3({
    s3: new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }),
    bucket: bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (_, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (_, file, cb) {
      cb(null, `${file.fieldname}-${Date.now().toString()}`);
    },
  }),
}).any();

export { MulterMiddleware };
