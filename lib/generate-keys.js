const forge = require('node-forge');

module.exports = function (RED) {
    "use strict";

    // Function to generate an RSA key pair based on the selected bit length
    function generateKeys(bitLength) {
        const rsaKeyPair = forge.pki.rsa.generateKeyPair({ bits: parseInt(bitLength) });

        const privateKeyPem = rsaKeyPair.privateKey;
        const publicKeyPem = rsaKeyPair.publicKey;
        return { privateKey: privateKeyPem, publicKey: publicKeyPem };
    }

    function GenerateKeysNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        // Function to handle incoming messages
        this.on("input", function (msg) {
            // Get the selected bit length from the node's configuration
            const bitLength = config.bitLength;

            try {
                            // Generate the key pair
            const keys = generateKeys(bitLength);

            // Set the generated keys in the node's configuration
            node.privateKey = keys.privateKey;
            node.publicKey = keys.publicKey;

            // Send the keys in the output message
            msg.ejbca = {
                privateKey: keys.privateKey,
                publicKey: keys.publicKey
            };
            node.send(msg);

            } catch (error) {
                node.error("Error occurred while generating keypair: " + error.message);
                node.status({fill: "red", shape: "ring", text: error.code});

            }
        });
    }

    RED.nodes.registerType("generate-keys", GenerateKeysNode);
};
