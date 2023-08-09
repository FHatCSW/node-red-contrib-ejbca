module.exports = function (RED) {
    "use strict";

    function ConfigureEntity(config) {
        RED.nodes.createNode(this, config);
        const node = this;


        node.on('input', function (msg, send, done) {

            const ejbcaConfigNode = RED.nodes.getNode(config.ejbcaConfig);
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
                let inputValue = null;
                if (msg[inputName] !== undefined) {
                    inputValue = msg[inputName];
                    if (config[inputName] !== undefined) {
                        node.warn(`configure-entity: ${inputName} was overwritten by msg.${inputName}`);
                    }
                } else {
                    inputValue = config[inputName];
                }

                if (ejbcaConfigParsed) {
                    const subjectProperty = ejbcaConfigParsed.subjects.find(subject => subject.property === inputName);
                    if (subjectProperty && subjectProperty.required && !inputValue) {
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
                let inputValue = null;
                if (msg[inputName] !== undefined) {
                    inputValue = msg[inputName];
                } else {
                    inputValue = config[inputName];
                }

                if (ejbcaConfigParsed) {
                    let subjectProperty = ejbcaConfigParsed.subject_alternative_names.find(subject => subject.property === inputName);
                    if (subjectProperty && subjectProperty.required && !inputValue) {
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
