import express from'express';
// import path from'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import MongoDB from "./config/mongoose.js";
import helmet from 'helmet';
// import {connectRedis} from "./config/redis.js"
import {globalErrorHandler} from "./middlewares/globalErrorHandler.js"
import {config}  from "./config/config.js";
import indexRoute from "./routes/indexRoute.js";
const app = express();


MongoDB();

// Set trust proxy (modify as needed for your environment)
// app.set('trust proxy', 1); // or 1, or 'multiple'




const frontendURLs = [config.get("LOCALHOST_FRONTEND_URL"), config.get("PRODUCTION_FRONTEND_URL")];
const allowedOrigins = frontendURLs;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent and received,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Use Helmet for security headers
app.use(helmet());

// Additional headers for extra security
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader("Content-Security-Policy", "default-src 'self'");
  next();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/api",indexRoute);


app.use(globalErrorHandler);

app.listen(config.get("PORT"), () => {
  console.log("🚀 Server running on port 3000");
});

// (async () => {
//   try {
//     await connectRedis(); // ensure connection first
//   } catch (err) {
//     console.error("❌ Could not connect to Redis", err);
//     process.exit(1); // Exit if Redis fails to connect
//   }
// })();

// module.exports = app;
