module.exports = function (RED) {
    "use strict";

    function DefineSubject(n) {
        RED.nodes.createNode(this, n);
        this.cn = n.cn;
        this.o = n.o;
        this.ou = n.ou;
        var node = this;

        this.on("input", function (msg, send, done) {
            // Check if the properties are provided via msg
            const msgCN = msg.CN;
            const msgO = msg.O;
            const msgOU = msg.OU;

            let subject = '';


            if (typeof msg.configJSON !== "undefined") {

                let jsonConfig;

                jsonConfig = msg.configJSON

                jsonConfig.subjects.forEach(subjectProperty => {
                    let setValue = null;

                    if (msg[subjectProperty.property] !== undefined) {
                        setValue = msg[subjectProperty.property];
                    } else {
                        setValue = this[subjectProperty.property.toLowerCase()];
                    }

                    const configValue = subjectProperty.value;

                    if (subjectProperty.required && !setValue && !configValue) {
                        node.error(`Missing required property: ${subjectProperty.property}`);
                        done();
                        return;
                    }

                    if (subjectProperty.modifiable && setValue !== undefined) {
                        subject += `${subjectProperty.property}=${setValue}, `; // Use "setValue" here
                    } else {
                        subject += `${subjectProperty.property}=${configValue}, `;
                    }
                });
            } else {
                // Create the subject string using either msg values or config values
                if (msgCN) {
                    subject += `CN=${msgCN}, `;
                } else if (this.cn) {
                    subject += `CN=${this.cn}, `;
                }
                if (msgO) {
                    subject += `O=${msgO}, `;
                } else if (this.o) {
                    subject += `O=${this.o}, `;
                }
                if (msgOU) {
                    subject += `OU=${msgOU}`;
                } else if (this.ou) {
                    subject += `OU=${this.ou}`;
                }
            }

            // Trim any trailing comma and space
            subject = subject.trim();

            // Store the subject in msg.ejbca
            msg.ejbca = {
                subject: subject
            };

            // Continue with further processing or send the message to the next node
            send(msg);

            // Call done() to indicate the node has finished processing
            done();


        });

    }

    RED.nodes.registerType("define subject v2", DefineSubject);
}

