import axios from 'axios';

export const sendNotification = async ({ title, message }: { title: string, message: string }) => {
    try {
        const pushoverToken = process.env.PUSHOVER_TOKEN;
        const pushoverUser = process.env.PUSHOVER_USER;

        if (!pushoverToken || !pushoverUser) {
            throw new Error('Pushover credentials are not set');
        }

        await axios.post('https://api.pushover.net/1/messages.json', {
            token: pushoverToken,
            user: pushoverUser,
            title,
            message,
        });
    } catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
    }
};