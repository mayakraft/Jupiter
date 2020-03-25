const fs = require("fs");

const getMIME = {
  ".aac": "audio/aac",
  ".avi": "video/x-msvideo",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".mpeg": "video/mpeg",
  ".ogv": "video/ogg",
  ".png": "image/png",
};

const getExt = path => [-1, -2, -3, -4, -5, -6]
  .map(i => path.slice(i))
  .filter(str => str[0] === ".")
  .shift();

// pass along a reference to your instance of Twit
const uploadMedia = function (Twit, mediaFilePath) {
  return new Promise((resolve, reject) => {
    const mediaFileSizeBytes = fs.statSync(mediaFilePath).size;

    Twit.post("media/upload", {
      command: "INIT",
      media_type: getMIME[getExt(mediaFilePath)],
      total_bytes: mediaFileSizeBytes
    }, function (err, bodyObj, resp) {
      if (err) {
        return reject(err);
      }
      const mediaIdStr = bodyObj.media_id_string;

      let isStreamingFile = true;
      let isUploading = false;
      let segmentIndex = 0;
      const fStream = fs.createReadStream(mediaFilePath, { highWaterMark: 5 * 1024 * 1024 });

      const _finalizeMedia = function (mediaIdStr, cb) {
        Twit.post("media/upload", {
          command: "FINALIZE",
          media_id: mediaIdStr
        }, cb)
      }

      const _checkFinalizeResp = function (err, bodyObj, resp) {
        if (err) { reject(err); }
        else { resolve(bodyObj); }
      }

      fStream.on("data", function (buff) {
        fStream.pause();
        isStreamingFile = false;
        isUploading = true;

        Twit.post("media/upload", {
          command: "APPEND",
          media_id: mediaIdStr,
          segment_index: segmentIndex,
          media: buff.toString("base64"),
        }, function (err, bodyObj, resp) {
          if (err) {
            return reject(err);
          }
          isUploading = false;

          if (!isStreamingFile) {
            _finalizeMedia(mediaIdStr, _checkFinalizeResp);
          }
        });
      });

      fStream.on("end", function () {
        isStreamingFile = false;
        if (!isUploading) {
          _finalizeMedia(mediaIdStr, _checkFinalizeResp);
        }
      });
    });
  });
};

module.exports = uploadMedia;
