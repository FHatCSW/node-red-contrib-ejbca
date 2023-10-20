const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

module.exports = function (RED) {
    function TransformP12Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.p12_password = config.p12_password;

        node.on('input', function (msg) {
            if (!msg.ejbca && !msg.ejbca.privateKey) {
                node.error("Private key not found in msg.ejbca");
                return;
            }
            if (!msg.ejbca && !msg.ejbca.publicKey) {
                node.error("Public key not found in msg.ejbca");
                return;
            }
            if (!msg.ejbca && !msg.ejbca.enroll_pkcs10 && !msg.ejbca.enroll_pkcs10.certificate) {
                node.error("Certificate not found in msg.ejbca.enroll_pkcs10");
                return;
            }

            try {
                // Get the private key and certificate in DER format from the input message
                var privateKey = msg.ejbca.privateKey; // Assuming it's already in DER format

                // Convert private key DER to PEM format
                var privateKey_forge = forge.pki.privateKeyToPem(privateKey);

                const derCertificate = forge.util.decode64(msg.ejbca.enroll_pkcs10.certificate);
                var certificate_pem = forge.pki.certificateToPem(forge.pki.certificateFromAsn1(forge.asn1.fromDer(derCertificate)));
                var certificate_forge = forge.pki.certificateFromPem(certificate_pem);

                var asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, [certificate_forge], this.p12_password);

                console.error(asn1);

                var der = forge.asn1.toDer(asn1).getBytes();

                // Get the user-defined directory from the configuration
                var outputDirectory = config.outputDirectory;

                var outputFilename = config.fileName + ".p12" || "user.p12";

                // Construct the output path
                var outputFilePath = path.join(outputDirectory, outputFilename);

                // Write the P12 file to the user-defined directory
                fs.writeFileSync(outputFilePath, der, 'binary');

                node.status({fill: 'green', shape: 'dot', text: 'Success'});

                // Send a success message or the modified message with the P12 data
                node.send(msg);

            } catch (error) {
                node.error("Error occurred while generating p12 token: " + error.message);
                node.status({fill: "red", shape: "ring", text: error.code});

            }
        });
    }

    RED.nodes.registerType("generate-p12", TransformP12Node);
};
