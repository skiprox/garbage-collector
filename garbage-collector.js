'use strict';

// Requires
const OS = require('os');
const CONFIG = {
	"trash": `${OS.homedir()}/.Trash`,
	"saved_trash": `${OS.homedir()}/Documents/.saved_trash`
}
const fs = require('fs');
const jetpack = require('fs-jetpack');
const chokidar = require('chokidar');
const sharp = require('sharp');

class TrashCollector {
	/**
	 * constructor
	 *
	 * Change directory stuff if we're on linux, exit if windows.
	 * Create the saved trash directory if it doesn't exist.
	 * Run watch();
	 */
	constructor() {
		let type = OS.type();
		if (type == 'Linux') {
			// Set to /home/$USER/.local/share/Trash
			CONFIG.trash = `${OS.homedir()}/.local/share/Trash`;
			CONFIG.saved_trash = `${OS.homedir()}/.saved_trash`;
		} else if (type == 'Windows_NT') {
			// probably return false?? for now??
			return false;
		}
		// Create the saved trash folder, if it doesn't exist
		if (!fs.existsSync(CONFIG.saved_trash)){
			fs.mkdirSync(CONFIG.saved_trash);
		}
		this.watch();
	}
	/**
	 * watch
	 *
	 * watch the trash, store everything we throw away
	 */
	watch() {
		let watcher = chokidar.watch(CONFIG.trash);
		watcher.on('all', (event, path) => {
			this.runSaveTrashItem(event, path);
		});
	}
	/**
	 * runSaveNames
	 *
	 * save all trashed file names into a JSON file,
	 * keeping the name, file size, and date added to trash
	 */
	runSaveTrashItem(event, path) {
		if (event == 'add') {
			// save the file info,
			// and create an object with an additional timestamp
			let fileInfo = jetpack.inspect(path);
			let trashObj = {
				name: fileInfo.name,
				path: `${CONFIG.trash}/${fileInfo.name}`,
				type: fileInfo.type,
				size: fileInfo.size
			};
			// If we have a file, and if it's a screenshot
			if (trashObj.type == 'file' && fs.existsSync(trashObj.path) && this.checkIfImg(trashObj)) {
				// Copy the file here
				// TODO, upload the file instead
				let newImgName = this.createNewImgName(trashObj.name);
				sharp(`${trashObj.path}`)
					.toFile(`${CONFIG.saved_trash}/${newImgName}`, (err, info) => {
						if (err) {
							console.warn(err);
						} else {
							info.filePath = `${CONFIG.saved_trash}/${newImgName}`;
							console.log(info);
						}
					});
			}
		}
	}
	/**
	 * checkIfImg
	 *
	 * @param  {object} obj [the trash object]
	 * @return {bool}     [whether the object is an image]
	 */
	checkIfImg(obj) {
		if (obj.name.indexOf('.png') !== -1 ||
			obj.name.indexOf('.jpg') !== -1 ||
			obj.name.indexOf('.jpeg') !== -1 ||
			obj.name.indexOf('.gif') !== -1) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * createNewImgName
	 *
	 * @param  {string} name [the name of the file]
	 * @return {string}      [the new name for the file, with .jpg]
	 *
	 * This is a horrible fucking function to give us a correctly named file, with jpg at the end
	 */
	createNewImgName(name) {
		let noSpacesName = name.split(' ').join('-');
		if (noSpacesName.indexOf('.png') !== -1) {
			return `${noSpacesName.split('.png')[0]}.jpg`;
		} else if (noSpacesName.indexOf('.jpg') !== -1) {
			return noSpacesName;
		} else if (noSpacesName.indexOf('.jpeg') !== -1) {
			return `${noSpacesName.split('.jpeg')[0]}.jpg`;
		} else if (noSpacesName.indexOf('.gif') !== -1) {
			return `${noSpacesName.split('.gif')[0]}.jpg`;
		}
	}
}

const collector = new TrashCollector();
