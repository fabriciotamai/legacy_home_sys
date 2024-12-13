"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveFile = saveFile;
const fs_1 = require("fs");
const path_1 = require("path");
function saveFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadsDir = (0, path_1.join)(__dirname, '../../uploads');
        yield fs_1.promises.mkdir(uploadsDir, { recursive: true });
        const filePath = (0, path_1.join)(uploadsDir, file.filename);
        const writeStream = (0, fs_1.createWriteStream)(filePath);
        yield file.toBuffer().then((buffer) => writeStream.write(buffer));
        writeStream.close();
        return filePath;
    });
}
