const forge = require("node-forge");

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
        console.error(csrPem);

        return csrPem;
    }

            module.exports = createCSR;