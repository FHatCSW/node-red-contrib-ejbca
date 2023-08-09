/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

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

            // Create the subject string using either msg values or config values
            let subject = '';
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

    RED.nodes.registerType("define subject", DefineSubject);
}

