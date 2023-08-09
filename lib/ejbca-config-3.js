module.exports = function (RED) {
    function EJBCAConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.name = config.name;
        this.ejbcaConf = config.ejbcaConf;
        this.configData = {};

        if (this.ejbcaConf) {
            this.configData = JSON.parse(this.ejbcaConf);
        }
    }

    RED.nodes.registerType("ejbca-config-3", EJBCAConfigNode);
};
