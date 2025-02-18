"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    // **NOT FOUND** (1000-1099)
    ErrorCodes[ErrorCodes["NOT_FOUND"] = 1000] = "NOT_FOUND";
    ErrorCodes[ErrorCodes["OTP_NOT_FOUND"] = 1001] = "OTP_NOT_FOUND";
    ErrorCodes[ErrorCodes["USER_NOT_FOUND"] = 1002] = "USER_NOT_FOUND";
    ErrorCodes[ErrorCodes["BANK_NOT_FOUND"] = 1003] = "BANK_NOT_FOUND";
    ErrorCodes[ErrorCodes["CARD_NOT_FOUND"] = 1004] = "CARD_NOT_FOUND";
    ErrorCodes[ErrorCodes["OFFER_NOT_FOUND"] = 1005] = "OFFER_NOT_FOUND";
    ErrorCodes[ErrorCodes["STORE_NOT_FOUND"] = 1006] = "STORE_NOT_FOUND";
    // **CONFLICT** (1100-1199)
    ErrorCodes[ErrorCodes["CONFLICT"] = 1100] = "CONFLICT";
    ErrorCodes[ErrorCodes["USER_ALREADY_EXISTS"] = 1101] = "USER_ALREADY_EXISTS";
    ErrorCodes[ErrorCodes["BANK_ALREADY_EXISTS"] = 1102] = "BANK_ALREADY_EXISTS";
    ErrorCodes[ErrorCodes["CARD_ALREADY_EXISTS"] = 1103] = "CARD_ALREADY_EXISTS";
    ErrorCodes[ErrorCodes["STORE_ALREADY_EXISTS"] = 1104] = "STORE_ALREADY_EXISTS";
    // **BAD REQUEST** (1200-1299)
    ErrorCodes[ErrorCodes["BAD_REQUEST"] = 1200] = "BAD_REQUEST";
    ErrorCodes[ErrorCodes["OLD_PASSWORD_REQUIRED"] = 1201] = "OLD_PASSWORD_REQUIRED";
    ErrorCodes[ErrorCodes["OLD_PASSWORD_SHOULD_NOT_BE_PROVIDED"] = 1202] = "OLD_PASSWORD_SHOULD_NOT_BE_PROVIDED";
    ErrorCodes[ErrorCodes["INVALID_OTP"] = 1203] = "INVALID_OTP";
    ErrorCodes[ErrorCodes["IMAGE_REQUIRED"] = 1204] = "IMAGE_REQUIRED";
    ErrorCodes[ErrorCodes["PATH_REQUIRED"] = 1205] = "PATH_REQUIRED";
    ErrorCodes[ErrorCodes["INVALID_PATH"] = 1206] = "INVALID_PATH";
    ErrorCodes[ErrorCodes["CUSTOM_DIMENSIONS_NOT_ALLOWED"] = 1207] = "CUSTOM_DIMENSIONS_NOT_ALLOWED";
    ErrorCodes[ErrorCodes["INCORRECT_PASSWORD"] = 1208] = "INCORRECT_PASSWORD";
    // **UNAUTHORIZED** (1300-1399)
    ErrorCodes[ErrorCodes["UNAUTHORIZED"] = 1300] = "UNAUTHORIZED";
    ErrorCodes[ErrorCodes["ANONYMOUS_USER_UNAUTHORIZED"] = 1301] = "ANONYMOUS_USER_UNAUTHORIZED";
    ErrorCodes[ErrorCodes["CHANGE_PASSWORD_UNAUTHORIZED"] = 1302] = "CHANGE_PASSWORD_UNAUTHORIZED";
    ErrorCodes[ErrorCodes["AUTH_HEADER_MISSING"] = 1303] = "AUTH_HEADER_MISSING";
    ErrorCodes[ErrorCodes["AUTH_TOKEN_MISSING"] = 1304] = "AUTH_TOKEN_MISSING";
    // **FILE ERRORS** (1400-1499)
    ErrorCodes[ErrorCodes["FILE_ERROR"] = 1400] = "FILE_ERROR";
    ErrorCodes[ErrorCodes["FILE_NOT_UPLOADED"] = 1401] = "FILE_NOT_UPLOADED";
    // **INTERNAL SERVER ERRORS** (1500-1599)
    ErrorCodes[ErrorCodes["INTERNAL_SERVER_ERROR"] = 1500] = "INTERNAL_SERVER_ERROR";
    ErrorCodes[ErrorCodes["DATABASE_OPERATION_FAILED"] = 1501] = "DATABASE_OPERATION_FAILED";
    ErrorCodes[ErrorCodes["CREATE_BANK_FAILED"] = 1502] = "CREATE_BANK_FAILED";
    ErrorCodes[ErrorCodes["UPDATE_BANK_FAILED"] = 1503] = "UPDATE_BANK_FAILED";
    ErrorCodes[ErrorCodes["CREATE_CARD_FAILED"] = 1504] = "CREATE_CARD_FAILED";
    ErrorCodes[ErrorCodes["UPDATE_CARD_FAILED"] = 1505] = "UPDATE_CARD_FAILED";
    ErrorCodes[ErrorCodes["CREATE_OFFER_FAILED"] = 1506] = "CREATE_OFFER_FAILED";
    ErrorCodes[ErrorCodes["UPDATE_OFFER_FAILED"] = 1507] = "UPDATE_OFFER_FAILED";
    ErrorCodes[ErrorCodes["DELETE_OFFER_FAILED"] = 1508] = "DELETE_OFFER_FAILED";
    ErrorCodes[ErrorCodes["CREATE_STORE_FAILED"] = 1509] = "CREATE_STORE_FAILED";
    ErrorCodes[ErrorCodes["UPDATE_STORE_FAILED"] = 1510] = "UPDATE_STORE_FAILED";
    ErrorCodes[ErrorCodes["UPDATE_PASSWORD_FAILED"] = 1511] = "UPDATE_PASSWORD_FAILED";
    ErrorCodes[ErrorCodes["UPDATE_USER_FAILED"] = 1512] = "UPDATE_USER_FAILED";
    // **TOKEN ERRORS** (1600-1699)
    ErrorCodes[ErrorCodes["TOKEN_ERROR"] = 1600] = "TOKEN_ERROR";
    ErrorCodes[ErrorCodes["TOKEN_VALIDATION_FAILED"] = 1601] = "TOKEN_VALIDATION_FAILED";
    ErrorCodes[ErrorCodes["TOKEN_GENERATION_FAILED"] = 1602] = "TOKEN_GENERATION_FAILED";
    ErrorCodes[ErrorCodes["TOKEN_MISSING"] = 1603] = "TOKEN_MISSING";
    // **HASHING ERRORS** (1700-1799)
    ErrorCodes[ErrorCodes["HASH_ERROR"] = 1700] = "HASH_ERROR";
    ErrorCodes[ErrorCodes["HASH_PASSWORD_FAILED"] = 1701] = "HASH_PASSWORD_FAILED";
    // **VALIDATION ERRORS** (1800-1899)
    ErrorCodes[ErrorCodes["VALIDATION_ERROR"] = 1800] = "VALIDATION_ERROR";
    ErrorCodes[ErrorCodes["ZOD_VALIDATION_FAILED"] = 1801] = "ZOD_VALIDATION_FAILED";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
