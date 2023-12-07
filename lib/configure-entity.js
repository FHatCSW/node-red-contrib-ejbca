const validateConfig = require('./resources/validate-config.js');
const resolveValue = require("./resources/resolve-value");

module.exports = function (RED) {
    "use strict";

    function ConfigureEntity(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        var globalContext = this.context().global;
        var flowContext = this.context().flow;

        this.fieldType_CN = config.CN_fieldType;
        this.fieldType_O = config.O_fieldType;
        this.fieldType_OU = config.OU_fieldType;
        this.fieldType_C = config.C_fieldType;
        this.fieldType_L = config.L_fieldType;
        this.fieldType_ST = config.ST_fieldType;
        this.fieldType_postalCode = config.postalCode_fieldType;
        this.fieldType_streetAdress = config.streetAdress_fieldType;
        this.fieldType_serialNumber = config.serialNumber_fieldType;
        this.fieldType_emailAdress = config.emailAdress_fieldType;
        this.fieldType_givenName = config.givenName_fieldType;
        this.fieldType_surName = config.surName_fieldType;
        this.fieldType_initials = config.initials_fieldType;
        this.fieldType_title = config.title_fieldType;
        this.fieldType_description = config.description_fieldType;

        this.fieldType_ipAddress1 = config.ipAddress1_fieldType;
        this.fieldType_ipAddress2 = config.ipAddress2_fieldType;
        this.fieldType_ipAddress3 = config.ipAddress3_fieldType;
        this.fieldType_Uri1 = config.Uri1_fieldType;
        this.fieldType_Uri2 = config.Uri2_fieldType;
        this.fieldType_Uri3 = config.Uri3_fieldType;
        this.fieldType_Dns1 = config.Dns1_fieldType;
        this.fieldType_Dns2 = config.Dns2_fieldType;
        this.fieldType_Dns3 = config.Dns3_fieldType;

        this.CN = config.CN;
        this.O = config.O;
        this.OU = config.OU;
        this.C = config.C;
        this.L = config.L;
        this.ST = config.ST;
        this.postalCode = config.postalCode;
        this.streetAdress = config.streetAdress;
        this.serialNumber = config.serialNumber;
        this.emailAdress = config.emailAdress;
        this.givenName = config.givenName;
        this.surName = config.surName;
        this.initials = config.initials;
        this.title = config.title;
        this.description = config.description;

        this.ipAddress1 = config.ipAddress1;
        this.ipAddress2 = config.ipAddress2;
        this.ipAddress3 = config.ipAddress3;
        this.Uri1 = config.Uri1;
        this.Uri2 = config.Uri2;
        this.Uri3 = config.Uri3;
        this.Dns1 = config.Dns1;
        this.Dns2 = config.Dns2;
        this.Dns3 = config.Dns3;


        node.on('input', function (msg, send, done) {

            const ejbcaConfigNode = RED.nodes.getNode(config.ejbcaConfig);
            const validationResult = validateConfig(ejbcaConfigNode.ejbcaConf);

            var args_defined = {};

            args_defined.CN = resolveValue(msg, this.fieldType_CN, globalContext, flowContext, this.CN, true);
            args_defined.O = resolveValue(msg, this.fieldType_O, globalContext, flowContext, this.O, true);
            args_defined.OU = resolveValue(msg, this.fieldType_OU, globalContext, flowContext, this.OU, true);
            args_defined.C = resolveValue(msg, this.fieldType_C, globalContext, flowContext, this.C, true);
            args_defined.L = resolveValue(msg, this.fieldType_L, globalContext, flowContext, this.L, true);

            args_defined.ST = resolveValue(msg, this.fieldType_ST, globalContext, flowContext, this.ST, true);
            args_defined.postalCode = resolveValue(msg, this.fieldType_postalCode, globalContext, flowContext, this.postalCode, true);
            args_defined.streetAdress = resolveValue(msg, this.fieldType_streetAdress, globalContext, flowContext, this.streetAdress, true);
            args_defined.serialNumber = resolveValue(msg, this.fieldType_serialNumber, globalContext, flowContext, this.serialNumber, true);
            args_defined.emailAdress = resolveValue(msg, this.fieldType_emailAdress, globalContext, flowContext, this.emailAdress, true);
            args_defined.givenName = resolveValue(msg, this.fieldType_givenName, globalContext, flowContext, this.givenName, true);
            args_defined.surName = resolveValue(msg, this.fieldType_surName, globalContext, flowContext, this.surName, true);
            args_defined.initials = resolveValue(msg, this.fieldType_initials, globalContext, flowContext, this.initials, true);
            args_defined.title = resolveValue(msg, this.fieldType_title, globalContext, flowContext, this.title, true);
            args_defined.description = resolveValue(msg, this.fieldType_description, globalContext, flowContext, this.description, true);

            args_defined.ipAddress1 = resolveValue(msg, this.fieldType_ipAddress1, globalContext, flowContext, this.ipAddress1, true);
            args_defined.ipAddress2 = resolveValue(msg, this.fieldType_ipAddress2, globalContext, flowContext, this.ipAddress2, true);
            args_defined.ipAddress3 = resolveValue(msg, this.fieldType_ipAddress3, globalContext, flowContext, this.ipAddress3, true);
            args_defined.Uri1 = resolveValue(msg, this.fieldType_Uri1, globalContext, flowContext, this.Uri1, true);
            args_defined.Uri2 = resolveValue(msg, this.fieldType_Uri2, globalContext, flowContext, this.Uri2, true);
            args_defined.Uri3 = resolveValue(msg, this.fieldType_Uri3, globalContext, flowContext, this.Uri3, true);
            args_defined.Dns1 = resolveValue(msg, this.fieldType_Dns1, globalContext, flowContext, this.Dns1, true);
            args_defined.Dns2 = resolveValue(msg, this.fieldType_Dns2, globalContext, flowContext, this.Dns2, true);
            args_defined.Dns3 = resolveValue(msg, this.fieldType_Dns3, globalContext, flowContext, this.Dns3, true);

            if (validationResult !== null) {
                node.error(`Invalid EJBCA config: ${validationResult}`);
                return;
            }

            const ejbcaConfigParsed = JSON.parse(ejbcaConfigNode.ejbcaConf);


            var ejbcaConfig = {
                subjects: [],
                subject_alternative_names: []
            };

            if (ejbcaConfigParsed) {
                ejbcaConfig.profile = ejbcaConfigParsed.profile;
            }

            var subjects = [
                "CN", "O", "OU", "C", "L", "ST", "postalCode", "streetAddress",
                "serialNumber", "emailAddress", "givenName", "surName", "initials",
                "title", "description"
            ];

            var subject_alternative_names = [
                "ipAddress1", "ipAddress2", "ipAddress3",
                "Uri1", "Uri2", "Uri3", "Dns1", "Dns2", "Dns3"
            ];

            subjects.forEach(function (inputName) {
                let inputValue = args_defined[inputName];

                if (ejbcaConfigParsed) {
                    const subjectProperty = ejbcaConfigParsed.subjects.find(subject => subject.property === inputName);
                    if (subjectProperty && subjectProperty.prop_required && !inputValue) {
                        node.error(`Missing required property: ${inputName}`);
                        done();
                        return;
                    }
                }

                if (inputValue !== "" && inputValue !== undefined) {
                    ejbcaConfig.subjects.push({
                        shortName: inputName,
                        value: inputValue,
                    });
                }
            });

            subject_alternative_names.forEach(function (inputName) {
                let inputValue = args_defined[inputName];

                if (ejbcaConfigParsed) {
                    let subjectProperty = ejbcaConfigParsed.subject_alternative_names.find(subject => subject.property === inputName);
                    if (subjectProperty && subjectProperty.prop_required && !inputValue) {
                        node.error(`Missing required property: ${inputName}`);
                        done();
                        return;
                    }
                }


                if (inputValue !== "" && inputValue !== undefined) {
                    var san_object;

                    if (inputName.startsWith("ipAddress")) {
                        san_object = {
                            type: 7,
                            ip: inputValue
                        };
                    } else if (inputName.startsWith("Dns")) {
                        san_object = {
                            type: 2,
                            value: inputValue
                        };
                    } else if (inputName.startsWith("Uri")) {
                        san_object = {
                            type: 6,
                            value: inputValue
                        };
                    }

                    ejbcaConfig.subject_alternative_names.push(san_object);
                }
            });

            if (!msg.ejbca) {
                msg.ejbca = {};
            }

            msg.ejbca.subjects = ejbcaConfig.subjects;
            msg.ejbca.subject_alternative_names = ejbcaConfig.subject_alternative_names;

            // Assuming you want to send the modified message downstream
            send(msg);

            done();
        });
    }

    // Register the custom node
    RED.nodes.registerType("configure-entity", ConfigureEntity);
};
