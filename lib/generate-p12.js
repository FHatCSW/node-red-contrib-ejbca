const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

module.exports = function (RED) {
    function TransformP12Node(config) {
        RED.nodes.createNode(this, config);
        var node = this;

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

            // Get the private key and certificate in DER format from the input message
            var privateKey = msg.ejbca.privateKey; // Assuming it's already in DER format

            // Convert private key DER to PEM format
            var privateKey_forge = forge.pki.privateKeyToPem(privateKey);
            console.log(privateKey_forge);

            const derCertificate = forge.util.decode64(msg.ejbca.enroll_pkcs10.certificate);
            var certificate_pem = forge.pki.certificateToPem(forge.pki.certificateFromAsn1(forge.asn1.fromDer(derCertificate)));
            var certificate_forge = forge.pki.certificateFromPem(certificate_pem);
            console.log(certificate_forge);

            var asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, [certificate_forge], this.credentials.p12_password);
            console.log(certificate_forge);

            var der = forge.asn1.toDer(asn1).getBytes();

            // Get the user-defined directory from the configuration
            var outputDirectory = config.output_directory || "/path/to/default/directory";

            // Construct the output path
            var outputFilePath = path.join(outputDirectory, "user.p12");

            // Write the P12 file to the user-defined directory
            fs.writeFileSync(outputFilePath, der, 'binary');

            // Send a success message or the modified message with the P12 data
            node.send(msg);
        });
    }

    RED.nodes.registerType("generate-p12", TransformP12Node, {
        credentials: {
            p12_password: {type: "password"}
        }
        });
};
