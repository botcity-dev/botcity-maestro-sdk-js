"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotMaestroSdk = void 0;
var utils_1 = require("./utils");
var fs_1 = __importDefault(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
var axios = require('axios');
var BotMaestroSdk = /** @class */ (function () {
    function BotMaestroSdk(server, login, key) {
        this._server = server;
        this._login = login;
        this._key = key;
        this._accessToken = "";
    }
    Object.defineProperty(BotMaestroSdk.prototype, "server", {
        get: function () {
            return this._server;
        },
        set: function (server) {
            if (server && server.slice(-1) === "/") {
                server = server.slice(0, -1);
            }
            this._server = server;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BotMaestroSdk.prototype, "accessToken", {
        get: function () {
            return this._accessToken;
        },
        set: function (accessToken) {
            this._accessToken = accessToken;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BotMaestroSdk.prototype, "headers", {
        get: function () {
            return { "headers": { "token": this.accessToken, "organization": this._login } };
        },
        enumerable: false,
        configurable: true
    });
    BotMaestroSdk.prototype.login = function (server, login, key) {
        if (server === void 0) { server = ""; }
        if (login === void 0) { login = ""; }
        if (key === void 0) { key = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (server)
                            this.server = server;
                        this._login = login || this._login;
                        this._key = key || this._key;
                        if (!this.server)
                            throw new Error("Server is required.");
                        if (!this._login)
                            throw new Error("Login is required.");
                        if (!this._key)
                            throw new Error("Key is required.");
                        url = "".concat(this._server, "/api/v2/workspace/login");
                        data = { "login": this._login, "key": this._key };
                        return [4 /*yield*/, axios.post(url, data)];
                    case 1:
                        response = _a.sent();
                        this.accessToken = response.data.accessToken;
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BotMaestroSdk.prototype.logoff = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.accessToken = "";
                return [2 /*return*/];
            });
        });
    };
    BotMaestroSdk.prototype.createTask = function (activityLabel, parameters, test) {
        if (test === void 0) { test = false; }
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/task");
                        data = { activityLabel: activityLabel, test: test, parameters: parameters };
                        return [4 /*yield*/, axios.post(url, data, this.headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.finishTask = function (taskId, state, finishStatus, finishMessage) {
        if (finishMessage === void 0) { finishMessage = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/task/").concat(taskId);
                        data = { state: state, finishStatus: finishStatus, finishMessage: finishMessage };
                        return [4 /*yield*/, axios.post(url, data, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.getTask = function (taskId) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/task/").concat(taskId);
                        return [4 /*yield*/, axios.get(url, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.createLog = function (activityLabel, columns) {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log");
                        data = { activityLabel: activityLabel, columns: columns, "organizationLabel": this._login };
                        return [4 /*yield*/, axios.post(url, data, this.headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    BotMaestroSdk.prototype.getLogs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log");
                        return [4 /*yield*/, axios.get(url, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.getLog = function (idLog) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log/").concat(idLog);
                        return [4 /*yield*/, axios.get(url, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // TODO: Implement others queries params
    BotMaestroSdk.prototype.fetchDataLog = function (idLog, days) {
        if (days === void 0) { days = 7; }
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log/").concat(idLog, "/entry-list?days=").concat(days);
                        return [4 /*yield*/, axios.get(url, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.downloadCsvLog = function (idLog, filepath, days) {
        if (days === void 0) { days = 7; }
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log/").concat(idLog, "/csv?days=").concat(days);
                        return [4 /*yield*/, axios.get(url, __assign(__assign({}, this.headers), { responseType: 'arraybuffer' }))
                                .catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, fs_1.default.promises.writeFile(filepath, response.data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.deleteLog = function (idLog) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log/").concat(idLog);
                        return [4 /*yield*/, axios.delete(url, this.headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.logEntry = function (idLog, content) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/log/").concat(idLog, "/entry");
                        return [4 /*yield*/, axios.post(url, content, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.createAlert = function (taskId, title, message, type) {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/alerts");
                        data = { taskId: taskId, title: title, message: message, type: type };
                        return [4 /*yield*/, axios.post(url, data, this.headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.createMessage = function (emails, logins, subject, body, type) {
        if (logins === void 0) { logins = []; }
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/message");
                        data = { emails: emails, logins: logins, subject: subject, body: body, type: type };
                        return [4 /*yield*/, axios.post(url, data, this.headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.createArtifact = function (taskId, name, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var url, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/artifact");
                        data = { taskId: taskId, name: name, filename: filename };
                        return [4 /*yield*/, axios.post(url, data, this.headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.uploadFile = function (artifactId, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, file, url, contentType, headers, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new form_data_1.default();
                        file = fs_1.default.createReadStream(filepath);
                        formData.append("file", file);
                        url = "".concat(this._server, "/api/v2/artifact/log/").concat(artifactId);
                        contentType = "multipart/form-data; boundary=".concat(formData.getBoundary());
                        headers = __assign(__assign({}, this.headers), { 'Content-Type': contentType });
                        return [4 /*yield*/, axios.post(url, formData, headers).catch(function (error) {
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.uploadArtifact = function (taskId, name, filename, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var artifact, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createArtifact(taskId, name, filename)];
                    case 1:
                        artifact = _a.sent();
                        return [4 /*yield*/, this.uploadFile(artifact.id, filepath)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    //Todo: Ajust pageable
    BotMaestroSdk.prototype.getArtifacts = function (size, page, sort, days) {
        if (sort === void 0) { sort = ["dateCreation"]; }
        if (days === void 0) { days = "7"; }
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/artifact?size=").concat(size, "&page=").concat(page, "&sort=").concat(sort.join(","), "&days=").concat(days);
                        return [4 /*yield*/, axios.get(url, this.headers).catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    BotMaestroSdk.prototype.downloadArtifact = function (artifactId, filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this._server, "/api/v2/artifact/").concat(artifactId, "/file");
                        return [4 /*yield*/, axios.get(url, __assign(__assign({}, this.headers), { responseType: 'arraybuffer' }))
                                .catch(function (error) {
                                console.log({ error: error });
                                throw new Error(error.response.data.message);
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, fs_1.default.promises.writeFile(filepath, response.data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "createTask", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "finishTask", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "getTask", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "createLog", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "getLogs", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "getLog", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "fetchDataLog", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "downloadCsvLog", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "deleteLog", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "logEntry", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "createAlert", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "createMessage", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "createArtifact", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "uploadFile", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "uploadArtifact", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "getArtifacts", null);
    __decorate([
        utils_1.ensureAccessToken,
        utils_1.catchError
    ], BotMaestroSdk.prototype, "downloadArtifact", null);
    return BotMaestroSdk;
}());
exports.BotMaestroSdk = BotMaestroSdk;
