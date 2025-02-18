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
exports.eventsRepository = exports.EventsRepository = exports.EventsEn = void 0;
const db_1 = require("../configs/db");
var EventsEn;
(function (EventsEn) {
    EventsEn["NewOffer"] = "new-offer";
})(EventsEn || (exports.EventsEn = EventsEn = {}));
class EventsRepository {
    constructor() {
        this.pushEvent = (event) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._collection.insertOne(event);
            }
            catch (error) {
                console.error("Error pushing event:", error);
            }
        });
        this.getEventsByType = (type) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._collection.find({ type }).toArray();
            }
            catch (e) {
                console.error("Error getting events by type:", e);
            }
        });
        this.clearEventsByType = (type) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._collection.deleteMany({ type });
            }
            catch (e) {
                console.error("Error clearing events by type:", e);
            }
        });
        this._collection = db_1.db.getCollection("events");
    }
}
exports.EventsRepository = EventsRepository;
exports.eventsRepository = new EventsRepository();
