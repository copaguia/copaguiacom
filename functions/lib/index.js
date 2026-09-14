"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sincronizarNegociosCopacabana = void 0;
const admin = __importStar(require("firebase-admin"));
const scheduler_1 = require("firebase-functions/v2/scheduler");
const sync_businesses_1 = require("./google/places/sync-businesses");
const config_1 = require("./google/places/config");
// Initialize Firebase Admin
if (admin.apps.length === 0) {
    admin.initializeApp();
}
/**
 * Función programada que se ejecuta diariamente a las 3:00 AM (hora de Colombia)
 */
exports.sincronizarNegociosCopacabana = (0, scheduler_1.onSchedule)({
    schedule: config_1.SYNC_CONFIG.schedule,
    timeZone: config_1.SYNC_CONFIG.timeZone,
    secrets: ['PLACES_API_KEY'],
    timeoutSeconds: config_1.SYNC_CONFIG.timeoutSeconds,
    memory: config_1.SYNC_CONFIG.memory,
    invoker: 'private',
}, async (event) => {
    const apiKey = process.env.PLACES_API_KEY;
    if (!apiKey) {
        console.error('PLACES_API_KEY environment variable is not defined.');
        return;
    }
    console.log('Starting scheduled synchronization of Copacabana businesses from Google Places...');
    try {
        const summary = await (0, sync_businesses_1.syncBusinesses)(apiKey);
        console.log(`Sync completed successfully: Added ${summary.added}, Updated ${summary.updated}, Deleted ${summary.deleted}, Total: ${summary.total}`);
    }
    catch (error) {
        console.error('Error during scheduled synchronization:', error);
    }
});
//# sourceMappingURL=index.js.map