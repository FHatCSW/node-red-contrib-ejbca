module.exports = function (RED) {
    function EJBCAConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.certificate_profile_name = n.certificate_profile_name;
        this.end_entity_profile_name = n.end_entity_profile_name;
        this.certificate_authority_name = n.certificate_authority_name;
        this.hostname = n.hostname;
        this.commonNameDefault = n.commonNameDefault;
        this.commonNameRequired = n.commonNameRequired;
        this.commonNameModifiable = n.commonNameModifiable;

        this.organizationNameDefault = n.organizationNameDefault;
        this.organizationNameRequired = n.organizationNameRequired;
        this.organizationNameModifiable = n.organizationNameModifiable;

        this.organizationUnitNameDefault = n.organizationUnitNameDefault;
        this.organizationUnitNameRequired = n.organizationUnitNameRequired;
        this.organizationUnitNameModifiable = n.organizationUnitNameModifiable;

    }

    RED.nodes.registerType("ejbca-config-2", EJBCAConfigNode);
}