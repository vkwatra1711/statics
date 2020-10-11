define({ "api": [
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./public/generated-docs/main.js",
    "group": "C:\\Users\\vansh\\codingfile\\code\\SIT209\\TrackMe\\mqtt\\public\\generated-docs\\main.js",
    "groupTitle": "C:\\Users\\vansh\\codingfile\\code\\SIT209\\TrackMe\\mqtt\\public\\generated-docs\\main.js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/send-command",
    "title": "AllDevices An array of all devices",
    "group": "Device",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n published new message\n}",
          "type": "String"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\nnull\n}",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./mqtt.js",
    "groupTitle": "Device",
    "name": "PostSendCommand"
  },
  {
    "type": "put",
    "url": "/sensor-data",
    "title": "",
    "group": "Device",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "[\n{\n \"deviceId\": \"apple\"\n}\npublished new message\n]",
          "type": "string"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\nnull\n}",
          "type": "string"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./mqtt.js",
    "groupTitle": "Device",
    "name": "PutSensorData"
  }
] });
