# Gather Town Bulk Changes UI
User-facing application to make bulk data changes to *maps* on your [Gather.Town](https://www.gather.town/) account. The application uses the [Gather http API](https://www.notion.so/EXTERNAL-Gather-http-API-3bbf6c59325f40aca7ef5ce14c677444) to query and mutate map data associated with your account.

## Motivation
I was commissioned to help out with mass asset uploading for an online festival called [*Festival Theater der Welt: Our house is on fire!*](https://www.theaterderwelt.de/en/program/future-there/). There were about 30 maps that needed digital assets to be uploaded and placed. Doing this manually was tedious, so instead I wrote scripts that used the [Gather http API](https://www.notion.so/EXTERNAL-Gather-http-API-3bbf6c59325f40aca7ef5ce14c677444) to automate the process. I then decided to build a user-interface so that if others were in the same position, they could easily update map data in bulk without writing any scripts.

## Features
- Edit map data using a form and update as you go.
- Backup map data from Gather.Town servers to a JSON file. 
- Add your API key and multiple Space ID/Map ID configurations to the application **(these are stored in your browser using the [localStorage Web API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)).**
![MainPage](/docs/main.jpg)

- Ability to upload data to the form from a backed up JSON file
![UploadFromFile](/docs/uploadFromFile.jpg)

- Upload local images to the gather town server and recieve image URLs to be used in form data.
![UploadImage](/docs/uploadImage.jpg)
## Tech / Frameworks used

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
 
<b>Built with</b>
- [Docker](https://www.docker.com/)
- [Typescript](https://www.typescriptlang.org/)
- <b>Server-side</b>
    - [Node.js](https://nodejs.org/)
    - [Express](https://expressjs.com/)
- <b>Client-side</b>
    - [React](https://reactjs.org/)
    - [Material-ui](https://material-ui.com/)
    - [JSONForms](https://jsonforms.io/)

## How to use?

#### Requirements
- [Docker](https://www.docker.com/products/docker-desktop)
- [docker-compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads) (Optional)

#### Getting the application running
1. Download this repository by using `git clone` or download it as a zip file.
2. Unzip the repository if you need to, open up a terminal and change directory to the root of the repository.
3. Run `docker-compose up`. This will build the client and server images and spin up the containers so you can run a local version of the application.
4. Once the terminal output says 'You can now view client in the browser', open up a browser at http://localhost:3000/ to find the application running.
5. Click 'Add new Space' to enter your Space-ID and Map-ID. These properties are found in the *mapmaker* view in the Gather.Town application. ![gettingSpaceAndMapId](/docs/gettingSpaceAndMapId.png)
6. Add your API key by clicking 'Edit API Key'. If you don't already have one generated, you can generate one [here](https://gather.town/apiKeys).
7. The application will now pull data from the Gather.Town server for you to edit and update as you please.

## Issues

If you have suggestions for new features or have found a bug, please write a new issue.

## Contribute

If you would like to contribute to the list of issues, please create a new pull request.

## License
A short snippet describing the license (MIT, Apache etc)
https://choosealicense.com/licenses/agpl-3.0/

AGPL © [Waseem G](https://www.waseem-g.com/)

