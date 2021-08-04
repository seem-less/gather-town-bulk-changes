const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.listen(port, () => console.log(`Listening on port ${port}`));

import { Request, Response } from 'express';
app.get('/getSpace', async (req: Request, res: Response) => {
    try {
        const response = await axios.get('https://gather.town/api/getMap',
            {
                params:
                {
                    apiKey: req.query.apiKey as string,
                    spaceId: req.query.spaceId as string,
                    mapId: req.query.mapId as string
                }
            });
        res.status(200).send(response.data);
        console.log("Successfully recieved for spaceId: " + req.query.spaceId + " and mapId: " + req.query.mapId);
    } catch (error) {
        console.log(error.response.data);
        res.status(400).send(error.response.data);
    }
});

app.use(express.json({ limit: "5mb" }));
app.post('/uploadImageData', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            "https://gather.town/api/uploadImage",
            {
                bytes: Buffer.from(req.body.bytes.split(',')[1], 'base64'),
                spaceId: req.body.spaceId,
            },
            { maxContentLength: Infinity, maxBodyLength: Infinity }
        );
        res.status(200).send(response.data);
        console.log("Successfully sent image data for spaceId: " + req.body.spaceId);
    } catch (error) {
        res.status(400).send(error.response.data);
        console.log(error);
    }
})

app.post('/setMap', async (req: Request, res: Response) => {
    try {
        const response = await axios.post("https://gather.town/api/setMap", {
            apiKey: req.body.apiKey,
            spaceId: req.body.spaceId,
            mapId: req.body.mapId,
            mapContent: req.body.mapContent
        });
        res.status(200).send(response.data);
        console.log("Successfully updated data for spaceId: " + req.body.spaceId + " mapId: " + req.body.mapId);
    } catch (error) {
        res.status(400).send(error.response.data);
        console.log(error);
    };
})