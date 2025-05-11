import * as dotenv from 'dotenv';

dotenv.config()

class configEmail {
    public host = process.env.EMAIL_HOST;
    public port = 587 | parseInt(process.env.EMAIL_PORT);
    public user = process.env.EMAIL_USER;
    public password = process.env.EMAIL_PASSWORD;
}

export default new configEmail;