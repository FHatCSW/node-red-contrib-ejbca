module.exports = function (RED) {
    function CustomNodeConfigurable(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        var testConfigNode = RED.nodes.getNode(config.ejbcaConfig);

        node.on('input', function (msg) {

            if (!testConfigNode) {
                node.error("Test Config node not found. Please select a valid configuration.");
                return;
            }

            // Access properties from the testConfigNode here
            var option1 = testConfigNode.certificate_authority_name;
            var option2 = testConfigNode.certificate_profile_name;
            // Add more configuration options here

            // Do whatever processing you need with the properties
            // For example, you can use them in the message payload
            msg.payload = {
                option1: option1,
                option2: option2
                // Add more configuration options here
            };

            node.send(msg);
        });
    }
    RED.nodes.registerType('custom-node-configurable', CustomNodeConfigurable);
};