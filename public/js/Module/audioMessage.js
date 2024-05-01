import { env } from '../../env';
import { socketModule } from '../core/socket';

export const audioUpload = {
    init: function () {
        this.$mainRecordDiv = document.querySelector('#mainRecordDiv')
        this.$audioSend = document.querySelector('#audioSend')
        this.$audioClear = document.querySelector('#audioClear')
        this.$recordingBar = document.querySelector('#recordingBar')
        this.$button = document.querySelector('#audioMessage')
        this.$button.addEventListener('click', this.recordInitiated.bind(this))
        this.$audioSend.addEventListener('click', this.stopRecording.bind(this));
        this.$audioClear.addEventListener('click', this.audioMessageClear.bind(this));
        // this.toggleDisable(socketModule.livechat)
    },

    // toggleDisable: function (show = true) {
    //     if (!show) {
    //         this.clear();
    //         this.$button.style.cursor = 'not-allowed';
    //         this.$button.setAttribute("disabled", true)
    //     } else {
    //         this.$button.style.cursor = 'pointer';
    //         this.$button.removeAttribute("disabled")
    //     }
    // },

    checkMicrophonePermission: async function () {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return stream
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    },

    recordInitiated: async function () {
        let permission = await this.checkMicrophonePermission();
        if (permission) {
            this.$mainRecordDiv.style.display = 'flex';
            this.$recordingBar.style.width = '0%';
            this.recordingStartTime = Date.now();
            this.animateRecording();
            await this.startRecording();
        }
        this.checkMicrophonePermission();

    },

    animateRecording: function () {
        const elapsedTime = Date.now() - this.recordingStartTime;
        const progress = Math.min((elapsedTime / 15000) * 100, 100);
        // console.log('Progress:', progress);
        this.$recordingBar.style.width = `${progress}%`;
        if (progress < 100) {
            this.animationFrameId = requestAnimationFrame(() => this.animateRecording());
        } else {
            this.stopRecording();
        }
    },

    startRecording: async function () {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.file = [];

            // Event handler when data is available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.file.push(event.data);
                }
            };

            // Event handler when recording stops
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.file, { type: 'audio/mp3' });
                this.getFileUrl(audioBlob)
            };
            this.mediaRecorder.start();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    },

    stopRecording: async function () {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.$mainRecordDiv.style.display = 'none';
            this.$recordingBar.style.width = '100%'; // Finish the animation (set to 100%)
            cancelAnimationFrame(this.animationFrameId);
        }
    },

    getFileUrl: async function (audioBlob) {
        if (!this.file) {
            return '';
        }

        try {
            let bufferData = await audioBlob.arrayBuffer()
            const fetchUrl = `${env.protocol}://${env.server}:${env.port}/rest/v1/chat/file?visitor=${socketModule.getUniqueId()}&filename=${this.generateUniqueFilename()}&from_chatbot=${true}`;
            const response = await fetch(fetchUrl, {
                method: 'POST',
                body: bufferData,
                headers: {
                    'Content-Type': 'audio/mp3'
                }
            });

            const data = await response.json();
            socketModule.messageSend("", { payload: data.path, type: "audio" })
            return data.path;
        } catch (error) {
            console.log('ERROR IN UPLOAD FILE => ', error);
            this.toastMessage(error.message);
            return '';
        } finally {
            this.clear();
        }
    },
    generateUniqueFilename: function () {
        const timestamp = Date.now();
        return `audiomessage_${timestamp}.mp3`;
    },
    audioMessageClear: function () {
        this.$mainRecordDiv.style.display = 'none';
        this.clear();
    },

    clear: function () {
        this.file = null;
        this.mediaRecorder = null;
        this.$button.value = '';  // Clear file input
        this.$button.dispatchEvent(new Event('change'));  // Trigger change event
        this.$button.dispatchEvent(new Event('input'));  // Trigger input event
    },

    toastMessage: function (message) {
        let toggleParent = $("#message-module");
        let toastDiv = $(
            '<div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center" id="Toast_messageCOntainer"></div>'
        ).appendTo(toggleParent);
        toastDiv.css({ "min-height": "100px", position: "absolute", bottom: "24px", "z-index": "99", left: "50%", transform: "translate(-50%,0)" });

        let toastClass = $(
            '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"></div>'
        ).appendTo(toastDiv);
        toastClass.css({ opacity: "1" });
        $(`<div class="toast-body">${message}</div>`).appendTo(toastClass);
        setTimeout(() => {
            $("#Toast_messageCOntainer").remove();
        }, 2000);
    },
};