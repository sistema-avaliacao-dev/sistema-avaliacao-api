"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = capitalizePhrase;
function capitalizePhrase(phrase) {
    const phraseFormated = phrase.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return phraseFormated.toString();
}
//# sourceMappingURL=capitalizePhrase.js.map