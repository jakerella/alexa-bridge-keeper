
let router = require('express').Router(),
    verifier = require('alexa-verifier');

router.use(function(req, res, next) {
    if (!req.headers.signaturecertchainurl) {
        return next();
    }
    verifier(req.headers.signaturecertchainurl, req.headers.signature, req.rawBody, function(err) {
        if (err) {
            console.error(err);
            res.status(401).json({ status: 'Verification Failure', reason: err.message });
        } else {
            next();
        }
    });
});

module.exports = router;
