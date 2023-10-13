const fs = require('fs');
const path = require('path');
const forge = require('node-forge');
const resolveValue = require("./resources/resolve-value");

module.exports = function (RED) {
    "use strict";

    function ExportKeysNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        var globalContext = this.context().global;
        var flowContext = this.context().flow;

        this.fieldTypeOutputDirectory = config.outputDirectory_fieldType;
        this.fieldTypePrivateFileName = config.privatefileName_fieldType;
        this.fieldTypePublicFileName = config.publicfileName_fieldType;
        this.fieldTypePrivateKey = config.privateKey_fieldType;
        this.fieldTypePublicKey = config.publicKey_fieldType;

        this.outputDirectory = config.outputDirectory;
        this.privatefileName = config.privatefileName;
        this.publicfileName = config.publicfileName;
        this.privateKey = config.privateKey;
        this.publicKey = config.publicKey;

        // Function to handle incoming messages
        this.on("input", function (msg) {

            const outputDirectory = resolveValue(msg, this.fieldTypeOutputDirectory, globalContext, flowContext, this.outputDirectory);
            const privatefileName = resolveValue(msg, this.fieldTypePrivateFileName, globalContext, flowContext, this.privatefileName);
            const publicfileName = resolveValue(msg, this.fieldTypePublicFileName, globalContext, flowContext, this.publicfileName);
            const privateKey = resolveValue(msg, this.fieldTypePrivateKey, globalContext, flowContext, this.privateKey);
            const publicKey = resolveValue(msg, this.fieldTypePublicKey, globalContext, flowContext, this.publicKey);

            // Convert the keys to PEM format (PKCS#8 for private key and SPKI for public key)
            const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
            const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

            // Create file paths for private and public keys
            const privateKeyPath = path.join(outputDirectory, privatefileName);
            const publicKeyPath = path.join(outputDirectory, publicfileName);

            try {
                // Write private key to file
                fs.writeFileSync(privateKeyPath, privateKeyPem, 'utf-8');

                // Write public key to file
                fs.writeFileSync(publicKeyPath, publicKeyPem, 'utf-8');

                // Set the exported message in the node's configuration
                node.exportedMessage = `Keys exported successfully to ${outputDirectory}`;

                // Send the exported message in the output message
                msg.payload = node.exportedMessage;
                node.status({fill: 'green', shape: 'dot', text: 'Success'});

                node.send(msg);
            } catch (error) {
                node.error("Error occurred while exporting keys: " + error.message);
                node.status({fill: "red", shape: "ring", text: error.code});

            }
        });
    }

    RED.nodes.registerType("export-keys", ExportKeysNode);
};
