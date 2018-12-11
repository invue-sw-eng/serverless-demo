'use strict';

const axios = require('axios');
const elasticsearch = require('elasticsearch');
const aws = require('aws-sdk');

const firehose = new aws.Firehose(
    {
        apiVersion: '2015-08-04',
        region: 'region'
    }
);

const esClient = new elasticsearch.Client(
    {
        host: 'your-es-host',
        httpAuth: 'username:password'
    }
);

const handler = async (event) => {
    let threshold;

    try {
        threshold = (await axios.get('https://wb5eu1ifj7.execute-api.us-east-1.amazonaws.com/dev')).data;
    } catch (e) {
        console.log('No threshold found.');
    }

    const { firehoseLogs, esLogs } = event.reduce((prev, log) => {
        prev.firehoseLogs.push(
            {
                Data: log
            }
        );
        if (threshold && log.message.batteryTemperature > threshold.batteryTemperature) {
            prev.esLogs = prev.esLogs.concat(
                [
                    {
                        index: { _index: 'your-es-index', _type: 'your-es-type' }
                    },
                    log
                ]
            );
        }
        return prev;
    }, { firehoseLogs: [], esLogs: [] });

    let firehoseRecord;

    try {
        firehoseRecord = await firehose.putRecordBatch(
            {
                DeliveryStreamName: "stream",
                Records: firehoseLogs
            }
        );
    } catch (e) {
        // Fails the entire function. Retry later.
        throw e;
    }

    if (esLogs.length > 0) {

        try {
            await esClient.bulk(
                {
                    body: esLogs
                }
            );
        } catch (e) {
            // Use firehoseRecord to rollback logs sent to firehose.
            // Send to backup queue for processing later.
        }
    }


}

module.exports = {
    handler
}