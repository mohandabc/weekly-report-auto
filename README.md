# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\

### `npm run build`

Builds the app for production to the `build` folder.\

## Use Docker

### `docker build --build-arg HTTP_PROXY=http://10.111.66.213:9999 HTTPS_PROXY=http://10.111.66.213:9999 . -t reporting-image`

Builds a docker image. The build step is done inside the container, that's why we pass proxy to the build command.
Then, the built app will be copied to the nginx folder inside the container and use the nginx.config file.

### `docker save -o name.tar`

Save the image to a file in order to transfer it to the deployement machine

### `docker laod -i name.tar`

Loads the image from tar file to docker in deployement machine

### `docker run --name reporting -p 3000:3000 -d reporting-image`

Runs the image in a container. To expose port 80 instead use -p 80:3000 instead
