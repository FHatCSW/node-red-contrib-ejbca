const fs = require('fs');
const path = require('path');

module.exports = function (RED) {
    "use strict";

    function ExportKeysNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Function to handle incoming messages
        this.on("input", function (msg) {
            // Get the selected export location from the node's configuration
            const exportLocation = config.exportLocation;

            // Check if the export location is provided
            if (!exportLocation || exportLocation.trim() === "") {
                node.error("Export location is not specified.");
                return;
            }

            // Check if the provided export location is a valid directory
            if (!fs.existsSync(exportLocation) || !fs.statSync(exportLocation).isDirectory()) {
                node.error("Invalid export location. Please provide a valid directory.");
                return;
            }

            // Get the private and public keys from the input message or the node's configuration
            const privateKey = msg.ejbca.privateKey || config.privateKey;
            const publicKey = msg.ejbca.publicKey || config.publicKey;

            // Check if the keys are available
            if (!privateKey || !publicKey) {
                node.error("Private key or public key is missing. Please ensure the keys are available.");
                return;
            }

            // Convert the keys to PEM format (PKCS#8 for private key and SPKI for public key)
            const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
            const publicKeyPem = forge.pki.publicKeyToPem(publicKey);

            // Generate file names for private and public keys
            const privateKeyName = "private_key.pem";
            const publicKeyName = "public_key.pem";

            // Create file paths for private and public keys
            const privateKeyPath = path.join(exportLocation, privateKeyName);
            const publicKeyPath = path.join(exportLocation, publicKeyName);

            try {
                // Write private key to file
                fs.writeFileSync(privateKeyPath, privateKeyPem, 'utf-8');

                // Write public key to file
                fs.writeFileSync(publicKeyPath, publicKeyPem, 'utf-8');

                // Set the exported message in the node's configuration
                node.exportedMessage = `Keys exported successfully to ${exportLocation}`;

                // Send the exported message in the output message
                msg.payload = node.exportedMessage;
                node.send(msg);
            } catch (err) {
                node.error("Error occurred while exporting keys: " + err.message);
            }
        });
    }

    RED.nodes.registerType("export-keys", ExportKeysNode);
};
