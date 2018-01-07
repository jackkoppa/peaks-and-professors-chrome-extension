import { TripRecord } from "../conversion/trip-record.models";

const SQUARESPACE_ID_REGEXP: RegExp = new RegExp(/yui_(\d_\d\d_\d_\d_[\d]{13})_[\d]{4}/);

export class SquarespaceFlowService {
    private templateSquarespaceId: string;
    private templateTripHeader: HTMLElement;

    private newTripId: string;
    private newTripDialog: HTMLElement;

    constructor(
        private tripRecord: TripRecord
    ) { }

    public attemptImport(): Promise<number> {
        return this.verifyPage()
            .then(() => this.verifyLandingTripTitle('WordPress Import Template'))
            .then(templateTripTitle => this.clickTemplateTripTitle(templateTripTitle))
            .then(editButton => this.clickEditButton(editButton))
            .then(dialog => this.clickDuplicateButton(dialog))
            .then(titleFieldInput => this.enterTripTitle(titleFieldInput))
            .then(() => this.saveNewTrip())
            .then(templateTripTitle => this.tripRecord.ID)
    }

    private verifyPage(): Promise<void> {
        const titleElement = document.querySelector('[title="Upcoming Trips"]');
        return titleElement != null ? 
            Promise.resolve() :
            Promise.reject('Not on correct page')
    }

    private verifyLandingTripTitle(intendedTitle: string): Promise<HTMLSpanElement> {
        const templateTripTitle =  this.getLandingTripTitle('WordPress Import Template') 
        return templateTripTitle != null ?
            Promise.resolve(templateTripTitle) :
            Promise.reject(`Could not find ${intendedTitle} title in list`);
    }

    private clickTemplateTripTitle(templateTripTitle: HTMLSpanElement): Promise<HTMLButtonElement> {
        const titleId = templateTripTitle.id;
        const titleIdMatch = titleId.match(SQUARESPACE_ID_REGEXP);
        this.templateSquarespaceId = titleIdMatch && titleIdMatch[1];
        console.log(this.templateSquarespaceId)
        templateTripTitle.click();
        return new Promise<HTMLButtonElement>((resolve, reject) => {
            setTimeout(() => {
                const editButtons = this.templateTripHeader.parentElement.getElementsByClassName('button button-edit')
                const editButton = editButtons && editButtons[0] as HTMLButtonElement;
                if (editButton)
                    resolve(editButton)
                else
                    reject('Failed to find edit button after clicking on trip title');
            }, 2000)
        });
    }

    private clickEditButton(editButton: HTMLButtonElement): Promise<HTMLElement> {
        let findAttempts: number = 0;
        editButton.click();
        return new Promise<HTMLElement>((resolve, reject) => {
            const interval = setInterval(() => {
                findAttempts++;
                console.log(`attempt to find dialog number ${findAttempts}`);
                const dialogClass = 'standard-dialog-wrapper squarespace-managed-ui standard dialog-event-post-editor visible';
                const dialogs = document.getElementsByClassName(dialogClass)
                if (dialogs && dialogs[0] && (dialogs[0].id.includes(this.templateSquarespaceId) || !this.templateSquarespaceId)) {
                    clearInterval(interval);
                    resolve(dialogs[0] as HTMLElement);
                }
                else if (findAttempts >= 20) {
                    clearInterval(interval);
                    reject('Dialog failed to appear after clicking on edit button');
                }
            }, 1000)
        });
    }

    private clickDuplicateButton(dialog: HTMLElement): Promise<HTMLInputElement> {
        const buttonBlocks = dialog.querySelectorAll('[class="button-block"]');
        let findAttempts: number = 0;
        let duplicateButton = this.getButton(dialog, 'duplicate');
        duplicateButton.click();
        return new Promise<HTMLInputElement>((resolve, reject) => {
            const interval = setInterval(() => {
                findAttempts++;
                console.log(`attempt to find duplicate dialog number ${findAttempts}`);
                const dialogClass = 'standard-dialog-wrapper squarespace-managed-ui standard dialog-event-post-editor visible';
                const dialogs = document.getElementsByClassName(dialogClass);
                const titleFieldClass = 'sqs-dialog-field name-title';
                const titleFields = document.getElementsByClassName(titleFieldClass);
                const titleFieldInputs = titleFields && titleFields[0] && titleFields[0].getElementsByTagName('input');                
                if (dialogs && dialogs[0] && 
                    (dialogs[0].id.includes(this.templateSquarespaceId) || !this.templateSquarespaceId) &&
                    titleFieldInputs && titleFieldInputs[0] &&
                    titleFieldInputs[0].value.trim().toUpperCase() == 'COPY OF WORDPRESS IMPORT TEMPLATE') {
                    this.newTripDialog = dialogs[0] as HTMLElement;
                    clearInterval(interval);
                    resolve(titleFieldInputs[0]);
                } else if (findAttempts >= 20) {
                    clearInterval(interval);
                    reject('Dialog failed to appear after duplicating trip template');
                }
            }, 1000)
        });
    }

    private enterTripTitle(titleFieldInput: HTMLInputElement): Promise<void> {
        const titleIdMatch = titleFieldInput.id.match(SQUARESPACE_ID_REGEXP);
        this.newTripId = titleIdMatch && titleIdMatch[1];

        titleFieldInput.focus();
        titleFieldInput.value = this.tripRecord.title;
        titleFieldInput.blur();
        this.newTripDialog.click();
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => resolve(), 20000)
        })
    }

    private saveNewTrip(): Promise<void> {
        const saveAndCloseButton = this.getButton(this.newTripDialog, 'saveAndClose');
        let findAttempts = 0;
        saveAndCloseButton.click();
        return new Promise<void>((resolve, reject) => {
            const interval = setInterval(() => {
                findAttempts++;
                if (this.getLandingTripTitle(this.tripRecord.title)) {
                    clearInterval(interval);
                    resolve();
                } else if (findAttempts >= 20) {
                    clearInterval(interval);
                    reject('Failed to find title of imported trip on landing page');
                }
            }, 1000)
        });
    }

    private getLandingTripTitle(intendedTitle: string): HTMLSpanElement {
        const allTripHeaders = document.querySelectorAll('[class="blog-list-item-header list-item-header"]');
        let templateTripTitle: HTMLSpanElement;
        allTripHeaders && allTripHeaders.forEach(tripHeader => {
            const title = tripHeader.getElementsByClassName('title')[0] as HTMLSpanElement;
            if (title && title.innerHTML.trim().toUpperCase() == intendedTitle.toUpperCase()) {
                this.templateTripHeader = tripHeader as HTMLElement;
                templateTripTitle = title;
            }
        });
        return templateTripTitle;
    }

    private getButton(dialog: HTMLElement, target: 'duplicate' | 'saveAndClose'): HTMLElement {
        const buttonBlocks = dialog.querySelectorAll('[class="button-block"]');
        let findAttempts: number = 0;
        let targetButton: HTMLElement;
        buttonBlocks && buttonBlocks.forEach(buttonBlock => {
            const input = buttonBlock.getElementsByTagName('input')
            if (target === 'duplicate') {
                if (input && input[0].value.trim().toUpperCase() == 'DUPLICATE')
                    targetButton = input[0] as HTMLInputElement;
            } else if (target === 'saveAndClose') {
                if (input && input[0].classList.contains('saveAndClose'))
                    targetButton = input[0] as HTMLInputElement;
            }            
        });
        return targetButton;
    }
}