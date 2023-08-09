module.exports = function (RED) {
    function EjbcaStatus(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const url = RED.util.ensureString(config.url);
        const api = "/ejbca-rest-api/v1/certificate/status";
        let final_url = url + api;
        var method = "GET";
        var Timeout = 120000;
        const headers = {'Content-Type': 'application/json'};
        var tlsNode = RED.nodes.getNode(config.tls);

        node.on('input', function (msg) {

            if (!((url.indexOf("http://") === 0) || (url.indexOf("https://") === 0))) {
                    final_url = "https://" + final_url;
            }

            var opts = {
                method: method,
                url: final_url,
                timeout: Timeout,
                headers: headers,
                encoding: null,
            };

            if (tlsNode) {
                tlsNode.addTLSOptions(opts);
            }

            var request = require('request');

            request(opts, function (error, response, body) {
                node.status({});
                msg.ejbca_status = {};
                if (error) {
                    node.error(error, msg);
                    msg.ejbca_status.error_message = error.toString() + " : " + inputUrl;
                    msg.ejbca_status.statusCode = error.code;
                    node.send(msg);
                    node.status({fill: "red", shape: "ring", text: error.code});
                } else {
                    msg.ejbca_status.body = body;
                    msg.ejbca_status.headers = response.headers;
                    msg.ejbca_status.statusCode = response.statusCode;

                    try {
                        msg.ejbca_status.body = JSON.parse(body);
                        node.status({fill: 'green', shape: 'dot', text: 'Success'});
                    } catch (parseError) {
                        node.warn('Failed to parse JSON response: ' + parseError.message);
                    }

                    node.send(msg);
                }
            });

        });
    }

    RED.nodes.registerType('ejbca-status', EjbcaStatus);
};
