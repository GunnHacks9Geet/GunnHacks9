// Load modules.
var Strategy = require('./strategy')
    , InternalOAuthError = require('./errors/internaloautherror');


// Expose Strategy.
exports = module.exports = Strategy;

// Exports.
exports.SchoologyStrategy = Strategy;
exports.InternalOAuthError = InternalOAuthError;
