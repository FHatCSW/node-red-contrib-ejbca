# node-red-contrib-ejbca Integration Package

![Node-RED Logo](https://nodered.org/about/resources/media/nodered-icon-2.png)

This Node-RED package provides a set of nodes for integrating with the EJBCA (Enterprise JavaBeans Certificate
Authority) using the EJBCA REST interface. With these nodes, you can automate certificate management tasks and create
custom certificate workflows within Node-RED.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Nodes](#nodes)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install this Node-RED package, follow these steps:

1. Open your Node-RED instance.

2. Go to the menu on the top-right corner and select "Manage palette."

3. In the "Install" tab, search for "node-red-contrib-ejbca" and click "Install" to add the package to your Node-RED
   instance.

4. After installation, restart Node-RED for the changes to take effect.

## Configuration

Before using the nodes, you must configure the EJBCA connection by creating an "EJBCA Configuration" node. The
configuration should have the following structure:

```json
{
  "subjects": [
    {
      "property": "CN",
      "prop_value": "",
      "prop_required": true,
      "prop_modifiable": true
    },
    {
      "property": "O",
      "prop_value": "Campus Schwarzwald",
      "prop_required": true,
      "prop_modifiable": false
    },
    {
      "property": "OU",
      "prop_value": "Showcase Robot",
      "prop_required": true,
      "prop_modifiable": false
    },
    {
      "property": "C",
      "prop_value": "",
      "prop_required": true,
      "prop_modifiable": false
    }
  ],
  "subject_alternative_names": [],
  "profile": {
    "hostname": "YOUR_HOSTNAME.com",
    "certificate_profile_name": "YOUR_CERTIFICATE_PROFILE_NAME",
    "end_entity_profile_name": "YOUR_END_ENTITY_PROFILE_NAME",
    "certificate_authority_name": "YOUR_CERTIFICATE_AUTHORITY_NAME",
    "username": {
      "value": "",
      "auto_generated": false
    },
    "enrollment_code": {
      "required": true,
      "auto_generated": false,
      "minimum_bits": 0
    },
    "mail": {
      "use": true,
      "required": false,
      "modifiable": false
    }
  }
}
```

## Nodes

This package includes the following nodes:

* **configure-entity**: This node handles the configuration related to a PKCS10 signing request.
* **create-csr**: This node is used to create a PKCS10 Certificate Signing Request (CSR) which is a request for a
  digital certificate.
* **ejbca-config** (config-node): This is a configuration node that stores the connection settings and certificate
  related settings for the EJBCA instance.
* **ejbca-status**: This node is used to check the status or health of the EJBCA instance.
* **enroll-keystore**: This node enrolls a keystore, which is a container for keys and certificates.
* **enroll-pkcs10**: This node is used to enroll or request a certificate using a PKCS#10 Certificate Signing Request (
  CSR).
* **export-keys**: This node is used to export cryptographic keys.
* **generate-keys**: This node generates cryptographic keys.
* **generate-p12**: This node generates a PKCS#12 (P12) file, which typically includes a private key and its associated
  certificate.
* **revocation-status**: This node checks the revocation status of a certificate.
* **revoke**: This node is used to revoke a certificate.
* **search-certificates**: This node is used to search for certificates within the EJBCA instance.

## Usage Examples

To help you get started, here are some usage examples and workflows that demonstrate how to use the nodes in this
package:

### Example 1: Certificate Enrollment Workflow

![Enrollment workflow](media/pkcs10_enrollment.png)

<details>
  <summary>Click to expand/collapse</summary>

```json
[
    {
        "id": "1e1d90a44661c2dc",
        "type": "generate-keys",
        "z": "c24ed033437e3a9c",
        "name": "",
        "bitLength": "2048",
        "x": 460,
        "y": 460,
        "wires": [
            [
                "857b75b2703a5547",
                "861d4a82fc7471d2",
                "dbd9ec2ecc88e951"
            ]
        ]
    },
    {
        "id": "857b75b2703a5547",
        "type": "configure-entity",
        "z": "c24ed033437e3a9c",
        "name": "",
        "ejbcaConfig": "4eedf14773d23515",
        "CN": "test",
        "O": "Campus Schwarzwald",
        "OU": "Showcase Robot",
        "C": "DE",
        "L": "",
        "ST": "",
        "postalCode": "",
        "streetAdress": "",
        "serialNumber": "",
        "emailAdress": "",
        "givenName": "",
        "surName": "",
        "initials": "",
        "title": "",
        "description": "",
        "ipAddress1": "",
        "ipAddress2": "",
        "ipAddress3": "",
        "Uri1": "",
        "Uri2": "",
        "Uri3": "",
        "Dns1": "",
        "Dns2": "",
        "Dns3": "",
        "x": 460,
        "y": 520,
        "wires": [
            [
                "f95252ac488c3a2b",
                "47b6ba00be43e308"
            ]
        ]
    },
    {
        "id": "f95252ac488c3a2b",
        "type": "create-csr",
        "z": "c24ed033437e3a9c",
        "name": "",
        "privateKey": "",
        "x": 450,
        "y": 580,
        "wires": [
            [
                "10ed98f8720adaca",
                "bd7aaa5dbe362511"
            ]
        ]
    },
    {
        "id": "10ed98f8720adaca",
        "type": "enroll-pkcs10",
        "z": "c24ed033437e3a9c",
        "name": "",
        "tls": "7f5a2ba045b1a9b1",
        "ejbcaConfig": "4eedf14773d23515",
        "username": "node_red_test_user_fhk",
        "x": 460,
        "y": 640,
        "wires": [
            [
                "9a8b01ac9b9d5bc8",
                "55ebd375010e5ca5"
            ]
        ]
    },
    {
        "id": "9a8b01ac9b9d5bc8",
        "type": "generate-p12",
        "z": "c24ed033437e3a9c",
        "name": "",
        "output_directory": "/Users/florianhandke/Downloads",
        "x": 460,
        "y": 700,
        "wires": [
            [
                "4f57f015d2716d39"
            ]
        ]
    },
    {
        "id": "861d4a82fc7471d2",
        "type": "debug",
        "z": "c24ed033437e3a9c",
        "name": "debug generate keys",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 700,
        "y": 420,
        "wires": []
    },
    {
        "id": "47b6ba00be43e308",
        "type": "debug",
        "z": "c24ed033437e3a9c",
        "name": "debug entity configuration",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 720,
        "y": 520,
        "wires": []
    },
    {
        "id": "bd7aaa5dbe362511",
        "type": "debug",
        "z": "c24ed033437e3a9c",
        "name": "debug create CSR",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 690,
        "y": 580,
        "wires": []
    },
    {
        "id": "55ebd375010e5ca5",
        "type": "debug",
        "z": "c24ed033437e3a9c",
        "name": "debug pkcs#10 request",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 710,
        "y": 640,
        "wires": []
    },
    {
        "id": "4f57f015d2716d39",
        "type": "debug",
        "z": "c24ed033437e3a9c",
        "name": "debug P12 generation",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 700,
        "y": 700,
        "wires": []
    },
    {
        "id": "dbd9ec2ecc88e951",
        "type": "export-keys",
        "z": "c24ed033437e3a9c",
        "name": "",
        "exportLocation": "/Users/florianhandke/Downloads",
        "x": 670,
        "y": 460,
        "wires": []
    },
    {
        "id": "9a35189ec430d633",
        "type": "inject",
        "z": "c24ed033437e3a9c",
        "name": "trigger",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 190,
        "y": 460,
        "wires": [
            [
                "1e1d90a44661c2dc"
            ]
        ]
    },
    {
        "id": "cbc6c2bd6781ac93",
        "type": "ejbca-config-3",
        "name": "testconfig",
        "ejbcaConf": "{\n    \"subjects\": [\n        {\n            \"property\": \"CN\",\n            \"prop_value\": \"\",\n            \"prop_required\": true,\n            \"prop_modifiable\": true\n        },\n        {\n            \"property\": \"O\",\n            \"prop_value\": \"Campus Schwarzwald\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        },\n        {\n            \"property\": \"OU\",\n            \"prop_value\": \"Showcase Robot\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        },\n        {\n            \"property\": \"C\",\n            \"prop_value\": \"DE\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        }\n    ],\n    \"subject_alternative_names\": [],\n    \"profile\": {\n        \"hostname\": \"hostname.com\",\n        \"certificate_profile_name\": \"MQTT-CertProfile\",\n        \"end_entity_profile_name\": \"MQTT-Client-EndEntity\",\n        \"certificate_authority_name\": \"MQTT-CA\",\n        \"username\": {\n            \"value\": \"\",\n            \"auto_generated\": false\n        },\n        \"enrollment_code\": {\n            \"required\": true,\n            \"auto_generated\": false,\n            \"minimum_bits\": 0\n        },\n        \"mail\": {\n            \"use\": true,\n            \"required\": false,\n            \"modifiable\": false\n        }\n    }\n}"
    },
    {
        "id": "7f5a2ba045b1a9b1",
        "type": "tls-config",
        "name": "",
        "cert": "",
        "key": "",
        "ca": "",
        "certname": "NodeRedRestAdmin001.cert.pem",
        "keyname": "NodeRedRestAdmin001.key.pem",
        "caname": "ca-chain.cert.pem",
        "servername": "",
        "verifyservercert": true,
        "alpnprotocol": ""
    }
]
```

</details>

### Example 2: Certificate Revocation Status

![Revocation status](media/revocation_status.png)

<details>
  <summary>Click to expand/collapse</summary>

```json
[
    {
        "id": "4c882a8e897f4a62",
        "type": "revocation-status",
        "z": "c24ed033437e3a9c",
        "name": "",
        "tls": "7f5a2ba045b1a9b1",
        "ejbcaConfig": "4eedf14773d23515",
        "serial_number": "75E994749BA1F89F96C0B29EC22691C75BD95AC5",
        "x": 470,
        "y": 160,
        "wires": [
            [
                "160147056b61e853"
            ]
        ]
    },
    {
        "id": "5e198606b2b6739d",
        "type": "inject",
        "z": "c24ed033437e3a9c",
        "name": "trigger",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": 190,
        "y": 160,
        "wires": [
            [
                "4c882a8e897f4a62"
            ]
        ]
    },
    {
        "id": "160147056b61e853",
        "type": "debug",
        "z": "c24ed033437e3a9c",
        "name": "debug revocation status",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 710,
        "y": 160,
        "wires": []
    },
    {
        "id": "7f5a2ba045b1a9b1",
        "type": "tls-config",
        "name": "",
        "cert": "",
        "key": "",
        "ca": "",
        "certname": "NodeRedRestAdmin001.cert.pem",
        "keyname": "NodeRedRestAdmin001.key.pem",
        "caname": "ca-chain.cert.pem",
        "servername": "",
        "verifyservercert": true,
        "alpnprotocol": ""
    },
    {
        "id": "cbc6c2bd6781ac93",
        "type": "ejbca-config-3",
        "name": "testconfig",
        "ejbcaConf": "{\n    \"subjects\": [\n        {\n            \"property\": \"CN\",\n            \"prop_value\": \"\",\n            \"prop_required\": true,\n            \"prop_modifiable\": true\n        },\n        {\n            \"property\": \"O\",\n            \"prop_value\": \"Campus Schwarzwald\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        },\n        {\n            \"property\": \"OU\",\n            \"prop_value\": \"Showcase Robot\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        },\n        {\n            \"property\": \"C\",\n            \"prop_value\": \"DE\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        }\n    ],\n    \"subject_alternative_names\": [],\n    \"profile\": {\n        \"hostname\": \"hostname.com\",\n        \"certificate_profile_name\": \"MQTT-CertProfile\",\n        \"end_entity_profile_name\": \"MQTT-Client-EndEntity\",\n        \"certificate_authority_name\": \"MQTT-CA\",\n        \"username\": {\n            \"value\": \"\",\n            \"auto_generated\": false\n        },\n        \"enrollment_code\": {\n            \"required\": true,\n            \"auto_generated\": false,\n            \"minimum_bits\": 0\n        },\n        \"mail\": {\n            \"use\": true,\n            \"required\": false,\n            \"modifiable\": false\n        }\n    }\n}"
    }
]
```

</details>

### Example 3: EJBCA Status Check

![EJBCA status](media/ejbca_status.png)

<details>
  <summary>Click to expand/collapse</summary>

```json
[
  {
    "id": "aa2a9a549ee0b813",
    "type": "ejbca-status",
    "z": "c24ed033437e3a9c",
    "name": "",
    "tls": "7f5a2ba045b1a9b1",
    "ejbcaConfig": "4eedf14773d23515",
    "x": 450,
    "y": 80,
    "wires": [
      [
        "aff9a51a7c018eef"
      ]
    ]
  },
  {
    "id": "aff9a51a7c018eef",
    "type": "debug",
    "z": "c24ed033437e3a9c",
    "name": "debug EJBCA status",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "true",
    "targetType": "full",
    "statusVal": "",
    "statusType": "auto",
    "x": 700,
    "y": 80,
    "wires": []
  },
  {
    "id": "a65c6140332d3fa3",
    "type": "inject",
    "z": "c24ed033437e3a9c",
    "name": "trigger",
    "props": [
      {
        "p": "payload"
      }
    ],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 190,
    "y": 80,
    "wires": [
      [
        "aa2a9a549ee0b813"
      ]
    ]
  },
  {
    "id": "7f5a2ba045b1a9b1",
    "type": "tls-config",
    "name": "",
    "cert": "",
    "key": "",
    "ca": "",
    "certname": "NodeRedRestAdmin001.cert.pem",
    "keyname": "NodeRedRestAdmin001.key.pem",
    "caname": "ca-chain.cert.pem",
    "servername": "",
    "verifyservercert": true,
    "alpnprotocol": ""
  },
  {
        "id": "cbc6c2bd6781ac93",
        "type": "ejbca-config-3",
        "name": "testconfig",
        "ejbcaConf": "{\n    \"subjects\": [\n        {\n            \"property\": \"CN\",\n            \"prop_value\": \"\",\n            \"prop_required\": true,\n            \"prop_modifiable\": true\n        },\n        {\n            \"property\": \"O\",\n            \"prop_value\": \"Campus Schwarzwald\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        },\n        {\n            \"property\": \"OU\",\n            \"prop_value\": \"Showcase Robot\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        },\n        {\n            \"property\": \"C\",\n            \"prop_value\": \"DE\",\n            \"prop_required\": true,\n            \"prop_modifiable\": false\n        }\n    ],\n    \"subject_alternative_names\": [],\n    \"profile\": {\n        \"hostname\": \"hostname.com\",\n        \"certificate_profile_name\": \"MQTT-CertProfile\",\n        \"end_entity_profile_name\": \"MQTT-Client-EndEntity\",\n        \"certificate_authority_name\": \"MQTT-CA\",\n        \"username\": {\n            \"value\": \"\",\n            \"auto_generated\": false\n        },\n        \"enrollment_code\": {\n            \"required\": true,\n            \"auto_generated\": false,\n            \"minimum_bits\": 0\n        },\n        \"mail\": {\n            \"use\": true,\n            \"required\": false,\n            \"modifiable\": false\n        }\n    }\n}"
  }
]
```

</details>

## Contributing

Contributions are welcome! If you would like to contribute to this project or report issues, please follow
our [Contributing Guidelines](/CONTRIBUTING.md).

## License

This Node-RED EJBCA Integration Package is licensed under the [MIT License](/LICENSE).

## Authors

**FHatCSW** - [GitHub Profile](https://github.com/FHatCSW)