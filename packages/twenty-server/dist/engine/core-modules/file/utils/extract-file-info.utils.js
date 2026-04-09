"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "extractFileInfo", {
    enumerable: true,
    get: function() {
        return extractFileInfo;
    }
});
const _guards = require("@sniptt/guards");
const _filetype = require("file-type");
const _mrmime = require("mrmime");
const _utils = require("twenty-shared/utils");
const _filestorageexception = require("../../file-storage/interfaces/file-storage-exception");
const _pdf = require("@file-type/pdf");
const _buildfileinfoutils = require("./build-file-info.utils");
const extractFileInfo = async ({ file, filename })=>{
    const { ext: declaredExt } = (0, _buildfileinfoutils.buildFileInfo)(filename);
    const fileParser = new _filetype.FileTypeParser({
        customDetectors: [
            _pdf.detectPdf
        ]
    });
    const { ext: detectedExt, mime: detectedMime } = await fileParser.fromBuffer(file) ?? {};
    if ((0, _utils.isDefined)(detectedExt) && (0, _utils.isDefined)(detectedMime)) {
        return {
            mimeType: detectedMime,
            ext: detectedExt
        };
    }
    const ext = declaredExt;
    let mimeType = 'application/octet-stream';
    if ((0, _guards.isNonEmptyString)(ext)) {
        const mimeTypeFromExtension = (0, _mrmime.lookup)(ext);
        if (mimeTypeFromExtension && _filetype.supportedMimeTypes.has(mimeTypeFromExtension)) {
            throw new _filestorageexception.FileStorageException(`File content does not match its extension. The file has extension '${ext}' (expected mime type: ${mimeTypeFromExtension}), but the file content could not be detected as this type. The file may be corrupted, have the wrong extension, or be a security risk.`, _filestorageexception.FileStorageExceptionCode.INVALID_EXTENSION, {
                userFriendlyMessage: /*i18n*/ {
                    id: "bAGU1r",
                    message: "The file extension doesn't match the file content. Please check that your file is not corrupted and has the correct extension."
                }
            });
        }
        mimeType = mimeTypeFromExtension ?? 'application/octet-stream';
    }
    return {
        mimeType,
        ext
    };
};

//# sourceMappingURL=extract-file-info.utils.js.map