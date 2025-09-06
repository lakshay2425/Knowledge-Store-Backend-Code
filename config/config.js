const _config = {
    PORT: process.env.PORT, 
    NODE_ENV: process.env.NODE_ENV,
    ISSUER: process.env.ISSUER,
    AUDIENCE: process.env.AUDIENCE,
    JWT_SECRET: process.env.JWT_SECRET,
    maxAge: process.env.maxAge,
    ARCJET_KEY: process.env.ARCJET_KEY,
    LOCALHOST_FRONTEND_URL: process.env.LOCALHOST_FRONTEND_URL,
    PRODUCTION_FRONTEND_URL: process.env.PRODUCTION_FRONTEND_URL,
    MONGO_ATLAS_URI: process.env.MONGO_ATLAS_URI,
    REDIS_URL: process.env.REDIS_URL,
    EMAIL: process.env.EMAIL,
    EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
}

export const config = {
    get(key){
        const value = _config[key];
        if(!value){
            console.error(`❌ No Environment variable: ${key} is not defined`);
            process.exit(1);
        }
        return value;
    }
}

