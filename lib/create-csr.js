const forge = require('node-forge');
const isValidSubject = require('./resources/validate-subject.js');
const isValidSubjectAlternativeName = require('./resources/validate-subject-altname.js');
const resolveValue = require('./resources/resolve-value.js');
const createCSR = require('./resources/create-csr.js');


module.exports = function (RED) {
    "use strict";

    function CreateCSRNode(config) {
        RED.nodes.createNode(this, config);
        var globalContext = this.context().global;
        var flowContext = this.context().flow;
        const node = this;

        this.subjects = config.subjects;
        this.fieldTypesubjects = config.subjects_fieldType;
        this.subjectAltnames = config.subjectAltnames;
        this.fieldTypesubjectAltnames = config.subjectAltnames_fieldType;
        this.privateKey = config.privateKey;
        this.fieldTypePrivateKey = config.privateKey_fieldType;
        this.publicKey = config.publicKey;
        this.fieldTypePublicKey = config.publicKey_fieldType;

        // Function to handle incoming messages
        this.on("input", function (msg, done) {

            const privateKey = resolveValue(msg, this.fieldTypePrivateKey, globalContext, flowContext, this.privateKey, false);
            const publicKey = resolveValue(msg, this.fieldTypePublicKey, globalContext, flowContext, this.publicKey, false);
            const subjects = resolveValue(msg, this.fieldTypesubjects, globalContext, flowContext, this.subjects, false);
            const subject_alternative_names = resolveValue(msg, this.fieldTypesubjectAltnames, globalContext, flowContext, this.subjectAltnames, false);

            // Check if the private key and subject are available
            if (!privateKey || !subjects || !publicKey) {
                node.error("Private key, Public key or subject is missing. Please ensure all are available.");
                return;
            }

            const allSubjectsValid = subjects.every(isValidSubject);
            const allSANsValid = subject_alternative_names.every(isValidSubjectAlternativeName);


            if (!allSubjectsValid) {
                node.error(`Subjects do not have the right format: e.g. {"key": "CN", "value": "example"}`);
                done();
                return;
            }
            if (!allSANsValid) {
                node.error(`Subject Alternative Names do not have the right format: e.g. {"type": 2, "value": "www.example.de"} or {"type": 7, "ip": "192.168.1.1"}`);
                done();
                return;
            }

            try {
                // Generate the CSR based on the private key and subject
                const csr = createCSR(privateKey, publicKey, subjects, subject_alternative_names);

                if (!msg.ejbca) {
                    msg.ejbca = {};
                }

                // Send the CSR in the output message
                msg.ejbca.csr = csr;
                node.send(msg);
            } catch (err) {
                node.error("Error occurred while generating the CSR: " + err.message);
            }
        });
    }

    RED.nodes.registerType("create-csr", CreateCSRNode);
};


