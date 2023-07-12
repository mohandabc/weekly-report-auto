## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\

### `npm run build`

Builds the app for production to the `build` folder.\

## Use Docker to deploy

- First build the react app with `npm run build`
- Then run `docker build -t <reporting-image-name> . ` command to build the docker image.
- If you want to deploy in the same machine where the image is build, skip to `Run container` step.

- ### Save docker image to a file

If the image needs to be transfered to another machine, you can save it to a .tar file with :
`docker save -o filename.tar <reporting-image-name>`

- ### Load docker image from a file

You can load the image saved previously to another machine using :
`docker laod -i filename.tar`
after that you can use the `<reporting-image-name>` image to run a container

- ### Run a container

To run a new container with an image use:
`docker run --name <container-name> -p 3000:3000 -d <reporting-image-name>`

To expose port 80 instead use `-p 80:3000`.

## Add new fonts to pdfmake

In order to add new fonts to pdf make (default is roboto), follow these steps :

- download TTF font files and put them in fonts folder

- run this command

`node ./node_modules/pdfmake/build-vfs.js "./src/fonts/" "./src/fonts/vfs_fonts.js"`

- This will create a compiled version of the fonts

- In the js project, import the custom fonts

`import mypdfFonts from "../fonts/vfs_fonts";`

- add them the the default fonts of pdfmake

`pdfMake.vfs = {...pdfFonts.pdfMake.vfs, ...mypdfFonts.pdfMake.vfs};`

### create fonts names

```
pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    },
    Arial: {
      normal: 'ARIALN.TTF',
      bold: 'ARIALNB.TTF',
      italics: 'ARIALNI.TTF',
      bolditalics: 'Arialnbi.ttf'
    },

};`
```

- You are now ready to use 'Arial' Font
