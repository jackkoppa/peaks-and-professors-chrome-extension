// const ELEMENTS: { [key: string]: string} = {
//     wpExportsTextarea: 'wp-exports',
//     convertExportsButton: 'convert-exports',
//     readyForImportTextarea: 'ready-for-import',
//     startImportButton: 'start-import',
//     importedTextarea: 'imported'
// }

export class PopupInteractionHelper {
    static get wpExportsTextarea(): HTMLTextAreaElement {
        return document.getElementById('wp-exports') as HTMLTextAreaElement;
    }

    static get convertExportsButton(): HTMLButtonElement {
        return document.getElementById('convert-exports') as HTMLButtonElement;
    }

    static get remainingTextarea(): HTMLTextAreaElement {
        return document.getElementById('remaining') as HTMLTextAreaElement;
    }

    static get startImportButton(): HTMLButtonElement {
        return document.getElementById('start-import') as HTMLButtonElement;
    }

    static get importedTextarea(): HTMLTextAreaElement {
        return document.getElementById('imported') as HTMLTextAreaElement;
    }
}