module.exports = function (RED) {
    function EJBCAConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.certificate_profile_name = n.certificate_profile_name;
        this.end_entity_profile_name = n.end_entity_profile_name;
        this.certificate_authority_name = n.certificate_authority_name;
        this.hostname = n.hostname;
    }

    RED.nodes.registerType("ejbca-config", EJBCAConfigNode);
}