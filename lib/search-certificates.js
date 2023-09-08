const forge = require('node-forge');
const request = require('request');
const validateConfig = require('./resources/validate-config.js');

module.exports = function (RED) {


    function SearchCertificates(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        this.search = config.template;

        function validateJSONStructure(inputJSON) {
            const expectedProperties = ["max_number_of_results", "current_page", "criteria", "sort_operation"];
            return expectedProperties.every(property => property in inputJSON);
        }

        node.on('input', function (msg, send, done) {

            var ejbcaConfigNode = RED.nodes.getNode(config.ejbcaConfig);
            const validationResult = validateConfig(ejbcaConfigNode.ejbcaConf);
            if (validationResult !== null) {
                node.error(`Invalid EJBCA config: ${validationResult}`);
                return;
            }
            var ejbcaConfigParsed = JSON.parse(ejbcaConfigNode.ejbcaConf);
            var tlsConfigNode = RED.nodes.getNode(config.tls);

            const api = "/ejbca/ejbca-rest-api/v1/certificate/search";


            if (ejbcaConfigParsed) {

                var final_url = ejbcaConfigParsed.profile.hostname + api;

                if (!((final_url.indexOf("http://") === 0) || (final_url.indexOf("https://") === 0))) {
                    final_url = "https://" + final_url;
                }

                this.jsonPayload = {};

                if (this.search) {
                    this.jsonPayload = JSON.parse(this.search);
                }

                if (!validateJSONStructure) {
                    node.error("Invalid JSON configuration");
                    return;
                }

                if (!tlsConfigNode || !tlsConfigNode.valid) {
                    node.error("Invalid or missing TLS configuration");
                    return;
                }

                const requestOptions = {
                    uri: final_url,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(this.jsonPayload),
                    agentOptions: tlsConfigNode.addTLSOptions({}) // Use the TLS options to configure the agent
                };

                request(requestOptions, function (error, response, body) {
                    if (error) {
                        node.error("An error occurred: " + error);
                        node.status({fill: "red", shape: "ring", text: error.code});
                    } else {
                        try {
                            const data = JSON.parse(body);
                            msg.search_certificate = data;
                            node.status({fill: 'green', shape: 'dot', text: 'Success'});
                            send(msg);
                        } catch (jsonError) {
                            node.error("An error occurred: " + jsonError);
                            node.status({fill: "red", shape: "ring", text: jsonError.code});
                        }
                        done();
                    }
                });

            }

        });
    }

    RED.nodes.registerType('search-certificates', SearchCertificates);
};
