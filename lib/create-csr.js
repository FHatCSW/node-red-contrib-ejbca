const forge = require('node-forge');

module.exports = function (RED) {
    "use strict";

    function isValidSubject(subject) {
        // Check if the subject is an object
        if (typeof subject !== 'object' || subject === null) {
            return false;
        }

        // Check if 'shortName' and 'value' keys are present
        if (!subject.hasOwnProperty('shortName') || !subject.hasOwnProperty('value')) {
            return false;
        }

        // Check if 'shortName' and 'value' are non-empty strings
        if (typeof subject.shortName !== 'string' || typeof subject.value !== 'string') {
            return false;
        }

        // You can add more validation rules here if needed

        return true;
    }

    function isValidSubjectAlternativeName(san) {
    // Check if the SAN is an object
    if (typeof san !== 'object' || san === null) {
        return false;
    }

    // Check if 'type' key is present and has a valid value
    if (!san.hasOwnProperty('type') || typeof san.type !== 'number') {
        return false;
    }

    // Check if 'value' or 'ip' key is present based on 'type' value
    if (
        (san.type === 2 || san.type === 6) &&
        (!san.hasOwnProperty('value') || typeof san.value !== 'string')
    ) {
        return false;
    }

    if (san.type === 7 && (!san.hasOwnProperty('ip') || typeof san.ip !== 'string')) {
        return false;
    }

    // You can add more validation rules here if needed

    return true;
}

    // Function to create a CSR based on the provided private key and subject
    function createCSR(privateKey, publicKey, subjects, subject_alternative_names) {

        const csr = forge.pki.createCertificationRequest();
        csr.publicKey = publicKey;

        csr.setSubject(subjects);

        // Add extensions (e.g., subject alternative names)
        const extensions = [
            {
                name: "subjectAltName",
                altNames: subject_alternative_names
            }
        ];

        csr.addAttribute({
            name: 'extensionRequest',
            extensions: extensions
        });

        csr.sign(privateKey);

        // Convert the CSR to PEM format
        const csrPem = forge.pki.certificationRequestToPem(csr);

        return csrPem;
    }

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
