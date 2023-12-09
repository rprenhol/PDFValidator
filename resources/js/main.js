// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library

function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

function openDocs() {
    Neutralino.os.open("https://neutralino.js.org/docs");
}

function openTutorial() {
    Neutralino.os.open("https://www.youtube.com/watch?v=txDlNNsgSh8&list=PLvTbqpiPhQRb2xNQlwMs0uVV0IN8N-pKj");
}

function setTray() {
    if (NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            { id: "VERSION", text: "Get version" },
            { id: "SEP", text: "-" },
            { id: "QUIT", text: "Quit" }
        ]
    };
    Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
    switch (event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}

function onWindowClose() {
    Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if (NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

// showInfo();
window.ondragover = e => {
    e.preventDefault();
}
window.ondrop = e => {
    e.preventDefault();
}
window.onload = e => {
    // $('.file-dragging-container').on('dragenter dragleave', draggingFile);
    // $('.file-dragging-container').on('drop', fileDropped);

    let fileDrop = document.querySelector('.file-dragging-container')
    fileDrop.addEventListener('drop', fileDropped, true);
    fileDrop.addEventListener('dragenter', draggingFile, true);
    fileDrop.addEventListener('dragleave', draggingFile, true);

    $('#file-dialog').on('click',openFileDialog);
    // document.querySelector('#file-dialog').addEventListener('click', openFileDialog)
}

const draggingFile = ev => {
    ev.stopPropagation();
    [...ev.dataTransfer.items].forEach((item, i) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file" || item.type === 'text/uri-list') {
            const file = item.getAsFile();
            switch (ev.type) {
                case 'dragenter':
                    ev.currentTarget.classList.add('file-dragging');
                    break;
                case 'dragleave':
                default:
                    ev.currentTarget.classList.remove('file-dragging');
                    break;
            }
        } else {
            switch (ev.type) {
                case 'dragenter':
                    ev.currentTarget.classList.add('not-file-dragging');
                    break;
                case 'dragleave':
                default:
                    ev.currentTarget.classList.remove('not-file-dragging');
                    break;
            }
        }
    });
}

const fileDropped = ev => {
    ev.preventDefault();
    draggingFile(ev);
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                console.log(`… file[${i}].name = ${file.name}`);
            }
        });
    } else {
        // Use DataTransfer interface to access the file(s)
        [...ev.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
        });
    }
}

const openFileDialog = () => {
    Neutralino.os.showOpenDialog('Selecionar um PDF...', {
        filters: [
            { name: 'Documentos PDF', extensions: ['pdf'] },
            { name: 'Todos os arquivos', extensions: ['*'] }
        ],
        multiSelections: false
    });
}