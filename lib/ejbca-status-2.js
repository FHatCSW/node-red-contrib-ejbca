const forge = require('node-forge');
const request = require('request');

module.exports = function (RED) {
    function EjbcaStatus(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function (msg, send, done) {

            var ejbcaConfigNode = RED.nodes.getNode(config.ejbcaConfig);
            var ejbcaConfigParsed = JSON.parse(ejbcaConfigNode.ejbcaConf);
            var tlsConfigNode = RED.nodes.getNode(config.tls);

            const api = "/ejbca/ejbca-rest-api/v1/certificate/status";


            if (ejbcaConfigParsed) {

                var final_url = ejbcaConfigParsed.profile.hostname + api;

                if (!((final_url.indexOf("http://") === 0) || (final_url.indexOf("https://") === 0))) {
                    final_url = "https://" + final_url;
                }

                if (!tlsConfigNode || !tlsConfigNode.valid) {
                    node.error("Invalid or missing TLS configuration");
                    return;
                }

                const requestOptions = {
                    uri: final_url,
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Accept': 'application/json'
                    },
                    agentOptions: tlsConfigNode.addTLSOptions({}) // Use the TLS options to configure the agent
                };

                request(requestOptions, function (error, response, body) {
                    if (error) {
                        node.error("An error occurred: " + error);
                        node.status({fill: "red", shape: "ring", text: error.code});
                    } else {
                        try {
                            const data = JSON.parse(body);
                            msg.ejbca_status = data;
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

    RED.nodes.registerType('ejbca-status', EjbcaStatus);
};
