const fs = require('fs');
const mkdirp = require('mkdirp');
const forge = require('node-forge');
const resolveValue = require('./resources/resolve-value.js');


module.exports = function (RED) {
    function StoreCertificateNode(config) {
        RED.nodes.createNode(this, config);
        var globalContext = this.context().global;
        var flowContext = this.context().flow;


        this.outputFormat = config.outputFormat || 'PEM';
        this.fieldTypeOutputDirectory = config.outputDirectory_fieldType;
        this.fieldTypeFileName = config.fileName_fieldType;
        this.fieldTypeCertificate = config.certificate_fieldType;

        this.outputDirectory = config.outputDirectory;
        this.fileName = config.fileName;
        this.certificate = config.certificate;

        this.fileExtension = config.fileExtension;


        this.on('input', function (msg) {

            const outputDirectory = resolveValue(msg, this.fieldTypeOutputDirectory, globalContext, flowContext, this.outputDirectory);
            const fileName = resolveValue(msg, this.fieldTypeFileName, globalContext, flowContext, this.fileName);
            const certificate = resolveValue(msg, this.fieldTypeCertificate, globalContext, flowContext, this.certificate);

            // Choose the appropriate output format
            let outputCertificate;
            if (this.outputFormat === 'PEM') {
                const certPem = forge.pki.certificateToPem(forge.pki.certificateFromAsn1(forge.asn1.fromDer(forge.util.decode64(certificate))));
                outputCertificate = certPem;
            } else if (this.outputFormat === 'DER') {
                outputCertificate = forge.util.decode64(certificate);
            }

            // Construct the file path
            const filePath = `${outputDirectory}/${fileName}.${this.fileExtension}`;

            // Create the output directory if it doesn't exist
            mkdirp.sync(outputDirectory);

            // Write the certificate to the specified file
            fs.writeFileSync(filePath, outputCertificate);

            // Emit a message to the next node in the flow
            msg.payload = `Certificate saved to ${filePath}`;
            this.send(msg);
        });
    }

    RED.nodes.registerType('store-certificate', StoreCertificateNode);
};
