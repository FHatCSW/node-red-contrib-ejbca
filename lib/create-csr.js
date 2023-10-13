const forge = require('node-forge');
const isValidSubject = require('./resources/validate-subject.js');
const isValidSubjectAlternativeName = require('./resources/validate-subject-altname.js');


module.exports = function (RED) {
    "use strict";

    function CreateCSRNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Function to handle incoming messages
        this.on("input", function (msg, done) {
            // Get the private key and subject from the input message or the node's configuration
            const privateKey = msg.ejbca.privateKey || config.privateKey;
            const publicKey = msg.ejbca.publicKey || config.publicKey;
            const subjects = msg.ejbca.subjects;
            const subject_alternative_names = msg.ejbca.subject_alternative_names;

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

                // Set the generated CSR in the node's configuration
                node.csr = csr;

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


